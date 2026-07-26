import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { PrecedentGraph, CitationNode, CitationEdge } from '../types';
import {
  Network,
  GitFork,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  BookOpen,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface PrecedentCitationGraphProps {
  graph: PrecedentGraph;
  caseTitle: string;
}

export type LayoutMode = 'force' | 'tree';

interface D3Node extends d3.SimulationNodeDatum, CitationNode {
  id: string;
  depth?: number;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  label?: string;
}

export const PrecedentCitationGraph: React.FC<PrecedentCitationGraphProps> = ({
  graph,
  caseTitle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('force');
  const [filterType, setFilterType] = useState<'ALL' | 'SECTION' | 'PRECEDENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Normalize nodes and ensure CURRENT_CASE exists
  const rawNodes = useMemo(() => graph?.nodes || [], [graph]);
  const rawEdges = useMemo(() => graph?.edges || [], [graph]);

  const processedGraph = useMemo(() => {
    let nodes: CitationNode[] = [...rawNodes];
    let edges: CitationEdge[] = [...rawEdges];

    // Ensure subject case node is present
    let currentCaseNode = nodes.find((n) => n.id === 'CURRENT_CASE');
    if (!currentCaseNode) {
      currentCaseNode = {
        id: 'CURRENT_CASE',
        title: caseTitle || 'Current Subject Case',
        type: 'PRECEDENT',
        category: 'Subject Case',
        relevance: 'Central subject matter under active judicial review',
        status: 'APPLICABLE',
        summary: 'Primary matter before the Court.'
      };
      nodes.unshift(currentCaseNode);
    }

    // Connect any unlinked nodes to CURRENT_CASE
    const linkedNodeIds = new Set<string>();
    edges.forEach((e) => {
      const srcId = typeof e.source === 'string' ? e.source : (e.source as any).id;
      const tgtId = typeof e.target === 'string' ? e.target : (e.target as any).id;
      linkedNodeIds.add(srcId);
      linkedNodeIds.add(tgtId);
    });

    nodes.forEach((node) => {
      if (node.id !== 'CURRENT_CASE' && !linkedNodeIds.has(node.id)) {
        edges.push({
          source: 'CURRENT_CASE',
          target: node.id,
          label: 'cites'
        });
      }
    });

    return { nodes, edges };
  }, [rawNodes, rawEdges, caseTitle]);

  // Default selected node on load
  useEffect(() => {
    if (!selectedNodeId) {
      const initial =
        processedGraph.nodes.find((n) => n.id !== 'CURRENT_CASE') ||
        processedGraph.nodes[0];
      if (initial) {
        setSelectedNodeId(initial.id);
      }
    }
  }, [processedGraph, selectedNodeId]);

  // Selected node object
  const selectedNode = useMemo(
    () => processedGraph.nodes.find((n) => n.id === selectedNodeId) || null,
    [processedGraph, selectedNodeId]
  );

  // D3 Visualization Render Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 700;
    const height = containerRef.current.clientHeight || 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Create main zoomable container group
    const zoomGroup = svg.append('g').attr('class', 'zoom-group');

    // Zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform);
      });

    svg.call(zoomBehavior as any);

    // Filter nodes according to user selection and search
    let filteredNodesList = processedGraph.nodes.filter((node) => {
      if (node.id === 'CURRENT_CASE') return true;
      if (filterType === 'SECTION') {
        if (node.type !== 'SECTION' && node.type !== 'ARTICLE' && node.type !== 'STATUTE')
          return false;
      }
      if (filterType === 'PRECEDENT') {
        if (node.type !== 'PRECEDENT') return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          node.title.toLowerCase().includes(q) ||
          node.relevance.toLowerCase().includes(q) ||
          (node.category && node.category.toLowerCase().includes(q))
        );
      }
      return true;
    });

    const activeNodeIds = new Set(filteredNodesList.map((n) => n.id));

    let filteredEdgesList = processedGraph.edges.filter((edge) => {
      const srcId = typeof edge.source === 'string' ? edge.source : (edge.source as any).id;
      const tgtId = typeof edge.target === 'string' ? edge.target : (edge.target as any).id;
      return activeNodeIds.has(srcId) && activeNodeIds.has(tgtId);
    });

    // Arrow markers
    const defs = svg.append('defs');

    defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#f59e0b');

    defs
      .append('marker')
      .attr('id', 'arrowhead-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 9)
      .attr('markerHeight', 9)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#fbbf24');

    // Clone data for D3 mutation safety
    const d3Nodes: D3Node[] = filteredNodesList.map((d) => ({ ...d }));
    const d3Links: D3Link[] = filteredEdgesList.map((e) => ({
      source: e.source,
      target: e.target,
      label: e.label
    }));

    // LAYOUT 1: Force-Directed Network
    if (layoutMode === 'force') {
      const simulation = d3
        .forceSimulation<D3Node>(d3Nodes)
        .force(
          'link',
          d3
            .forceLink<D3Node, D3Link>(d3Links)
            .id((d) => d.id)
            .distance(140)
        )
        .force('charge', d3.forceManyBody().strength(-450))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(50));

      // Draw Link lines
      const linkGroup = zoomGroup
        .append('g')
        .selectAll('g')
        .data(d3Links)
        .enter()
        .append('g')
        .attr('class', 'link-item');

      const linkLines = linkGroup
        .append('line')
        .attr('stroke', '#334155')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', (d) => (d.label ? '4,4' : 'none'))
        .attr('marker-end', 'url(#arrowhead)');

      const linkLabels = linkGroup
        .append('text')
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .attr('fill', '#94a3b8')
        .attr('text-anchor', 'middle')
        .text((d) => d.label || '');

      // Draw Node groups
      const nodeGroups = zoomGroup
        .append('g')
        .selectAll('.node')
        .data(d3Nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .style('cursor', 'pointer')
        .call(
          d3
            .drag<SVGGElement, D3Node>()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        )
        .on('click', (event, d) => {
          setSelectedNodeId(d.id);
        })
        .on('mouseenter', (event, d) => {
          setHoveredNodeId(d.id);
        })
        .on('mouseleave', () => {
          setHoveredNodeId(null);
        });

      // Outer Glow circle for selected/hovered node
      nodeGroups
        .append('circle')
        .attr('r', (d) => (d.id === 'CURRENT_CASE' ? 28 : 22))
        .attr('fill', (d) => {
          if (d.id === 'CURRENT_CASE') return '#f59e0b';
          if (d.type === 'SECTION' || d.type === 'ARTICLE' || d.type === 'STATUTE')
            return '#3b82f6';
          return '#8b5cf6';
        })
        .attr('opacity', 0.2)
        .attr('class', 'glow-circle');

      // Inner Node Circle
      nodeGroups
        .append('circle')
        .attr('r', (d) => (d.id === 'CURRENT_CASE' ? 22 : 18))
        .attr('fill', (d) => {
          if (d.id === 'CURRENT_CASE') return '#b45309';
          if (d.type === 'SECTION' || d.type === 'ARTICLE' || d.type === 'STATUTE')
            return '#1e3a8a';
          return '#581c87';
        })
        .attr('stroke', (d) => {
          if (d.id === selectedNodeId) return '#fbbf24';
          if (d.id === 'CURRENT_CASE') return '#f59e0b';
          if (d.type === 'SECTION' || d.type === 'ARTICLE' || d.type === 'STATUTE')
            return '#60a5fa';
          return '#c084fc';
        })
        .attr('stroke-width', (d) => (d.id === selectedNodeId ? 3 : 2));

      // Node Label Text
      nodeGroups
        .append('text')
        .attr('dy', (d) => (d.id === 'CURRENT_CASE' ? 36 : 30))
        .attr('text-anchor', 'middle')
        .attr('fill', '#f8fafc')
        .attr('font-size', '11px')
        .attr('font-weight', (d) => (d.id === 'CURRENT_CASE' ? 'bold' : '600'))
        .text((d) => {
          if (d.id === 'CURRENT_CASE') return 'Subject Case';
          return d.title.length > 22 ? d.title.substring(0, 20) + '...' : d.title;
        });

      // Type Badge under label
      nodeGroups
        .append('text')
        .attr('dy', (d) => (d.id === 'CURRENT_CASE' ? 48 : 42))
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text((d) => d.category || d.type || '');

      simulation.on('tick', () => {
        linkLines
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        linkLabels
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 6);

        nodeGroups.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });
    }

    // LAYOUT 2: Tree-Hierarchical View
    else if (layoutMode === 'tree') {
      // Build a hierarchy with CURRENT_CASE as root
      const rootNode = d3Nodes.find((n) => n.id === 'CURRENT_CASE') || d3Nodes[0];

      // Build adjacency mapping
      const childrenMap = new Map<string, D3Node[]>();
      d3Links.forEach((link) => {
        const srcId = typeof link.source === 'string' ? link.source : (link.source as any).id;
        const tgtId = typeof link.target === 'string' ? link.target : (link.target as any).id;

        if (!childrenMap.has(srcId)) childrenMap.set(srcId, []);
        const targetObj = d3Nodes.find((n) => n.id === tgtId);
        if (targetObj && targetObj.id !== srcId) {
          childrenMap.get(srcId)!.push(targetObj);
        }
      });

      // Construct Stratified Hierarchy structure manually to handle cyclic graphs safely
      const visited = new Set<string>();

      function buildTreeHierarchy(node: D3Node): d3.HierarchyNode<D3Node> {
        visited.add(node.id);
        const children = (childrenMap.get(node.id) || []).filter(
          (c) => !visited.has(c.id)
        );

        const hierarchyDatum: any = {
          ...node,
          children: children.map((c) => buildTreeHierarchy(c))
        };

        return d3.hierarchy<D3Node>(hierarchyDatum);
      }

      const rootHierarchy = buildTreeHierarchy(rootNode);

      // Apply Tree Layout
      const treeLayout = d3
        .tree<D3Node>()
        .size([width - 160, height - 160]);

      const treeData = treeLayout(rootHierarchy);

      // Translate root to center-top
      const treeGroup = zoomGroup
        .append('g')
        .attr('transform', `translate(80, 80)`);

      // Draw Curved Bezier Links
      const linkPathGenerator = d3
        .linkVertical<any, any>()
        .x((d) => d.x)
        .y((d) => d.y);

      treeGroup
        .append('g')
        .selectAll('.tree-link')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('class', 'tree-link')
        .attr('d', linkPathGenerator as any)
        .attr('fill', 'none')
        .attr('stroke', '#334155')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')
        .attr('marker-end', 'url(#arrowhead)');

      // Draw Tree Nodes
      const treeNodeGroups = treeGroup
        .append('g')
        .selectAll('.tree-node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'tree-node')
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          setSelectedNodeId(d.data.id);
        })
        .on('mouseenter', (event, d) => {
          setHoveredNodeId(d.data.id);
        })
        .on('mouseleave', () => {
          setHoveredNodeId(null);
        });

      // Outer Ring
      treeNodeGroups
        .append('circle')
        .attr('r', (d) => (d.data.id === 'CURRENT_CASE' ? 26 : 20))
        .attr('fill', (d) => {
          if (d.data.id === 'CURRENT_CASE') return '#b45309';
          if (
            d.data.type === 'SECTION' ||
            d.data.type === 'ARTICLE' ||
            d.data.type === 'STATUTE'
          )
            return '#1e3a8a';
          return '#581c87';
        })
        .attr('stroke', (d) => {
          if (d.data.id === selectedNodeId) return '#fbbf24';
          if (d.data.id === 'CURRENT_CASE') return '#f59e0b';
          if (
            d.data.type === 'SECTION' ||
            d.data.type === 'ARTICLE' ||
            d.data.type === 'STATUTE'
          )
            return '#60a5fa';
          return '#c084fc';
        })
        .attr('stroke-width', (d) => (d.data.id === selectedNodeId ? 3 : 2));

      // Node Text
      treeNodeGroups
        .append('text')
        .attr('dy', (d) => (d.children ? -28 : 32))
        .attr('text-anchor', 'middle')
        .attr('fill', '#f8fafc')
        .attr('font-size', '11px')
        .attr('font-weight', (d) => (d.data.id === 'CURRENT_CASE' ? 'bold' : '600'))
        .text((d) =>
          d.data.title.length > 20
            ? d.data.title.substring(0, 18) + '...'
            : d.data.title
        );

      // Node Category
      treeNodeGroups
        .append('text')
        .attr('dy', (d) => (d.children ? -14 : 44))
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text((d) => d.data.category || d.data.type || '');
    }
  }, [processedGraph, layoutMode, filterType, searchQuery, selectedNodeId]);

  // Handle Zoom Buttons
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom().scaleBy as any, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(d3.zoom().transform as any, d3.zoomIdentity);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Left/Main Graph Area */}
      <div className="flex-1 flex flex-col p-4 bg-slate-950 relative min-h-[420px]" ref={containerRef}>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
          {/* Header Title & Mode Badge */}
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                <span>Precedent & Statutory Citation Map</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  D3 {layoutMode === 'force' ? 'Force Network' : 'Tree Hierarchy'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Connected graph mapping citations, binding sections, and Supreme Court rulings
              </p>
            </div>
          </div>

          {/* Action Toolbar: Layout Switcher, Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Layout Toggle Controls */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-1">
              <button
                onClick={() => setLayoutMode('force')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center space-x-1 ${
                  layoutMode === 'force'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Force-Directed Network View"
              >
                <GitFork className="w-3.5 h-3.5 rotate-90" />
                <span>Force Graph</span>
              </button>

              <button
                onClick={() => setLayoutMode('tree')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center space-x-1 ${
                  layoutMode === 'tree'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Hierarchical Tree View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tree View</span>
              </button>
            </div>

            {/* Filter Types */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-1">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  filterType === 'ALL'
                    ? 'bg-slate-800 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({processedGraph.nodes.length})
              </button>
              <button
                onClick={() => setFilterType('SECTION')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  filterType === 'SECTION'
                    ? 'bg-blue-900/60 text-blue-300 font-bold border border-blue-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setFilterType('PRECEDENT')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  filterType === 'PRECEDENT'
                    ? 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Precedents
              </button>
            </div>

            {/* Quick Node Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="pl-8 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-28 md:w-36 transition-all"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                title="Reset Camera View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* D3 Canvas Container */}
        <div className="flex-1 relative overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 flex items-center justify-center">
          <svg ref={svgRef} className="w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing" />

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl backdrop-blur-md text-[10px] space-y-1.5 shadow-lg pointer-events-none">
            <div className="font-bold uppercase text-slate-400 tracking-wider text-[9px] mb-1">
              Legend
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-300"></span>
              <span className="text-slate-300">Subject Case</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-blue-400"></span>
              <span className="text-slate-300">Statutory Section / Act</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block border border-purple-400"></span>
              <span className="text-slate-300">Case Precedent / Ruling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Drawer: Selected Node Details & Judicial Analysis */}
      <div className="w-full lg:w-80 bg-slate-900 p-5 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between shrink-0">
        {selectedNode ? (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Node Analysis
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {selectedNode.type}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-white">
                {selectedNode.title}
              </h3>
              {selectedNode.category && (
                <span className="text-xs text-amber-300 font-mono block mt-1">
                  Category: {selectedNode.category}
                </span>
              )}
            </div>

            {/* Legal Status */}
            {selectedNode.status && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Judicial Authority Status
                  </div>
                  <div className="text-xs font-bold text-emerald-400">
                    {selectedNode.status} (Binding Record)
                  </div>
                </div>
              </div>
            )}

            {/* Relevance */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Applicability & Ratio</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedNode.relevance}
              </p>
            </div>

            {/* Summary / Excerpt */}
            {selectedNode.summary && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Statutory Provision / Excerpt</span>
                </h4>
                <p className="text-xs text-slate-300 italic font-serif leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  "{selectedNode.summary}"
                </p>
              </div>
            )}

            {/* Kanoon Search Action */}
            <a
              href={`https://indiankanoon.org/search/?formInput=${encodeURIComponent(
                selectedNode.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-slate-800 flex items-center justify-center space-x-2 transition-colors mt-2"
            >
              <span>Search Official Kanoon Precedents</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
            <Info className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs">
              Click any node in the interactive D3 map to inspect detailed precedent ratios.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Saakshya D3 Citation Engine</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
      </div>
    </div>
  );
};
