import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Pause,
  Play,
  Sparkles,
  Check,
  RotateCcw,
  Volume2,
  Globe,
  Radio,
  FileText,
  StickyNote
} from 'lucide-react';

interface VoiceDictationBarProps {
  onAppendText: (text: string, targetField: 'notes' | 'orderText') => void;
  targetField: 'notes' | 'orderText';
  setTargetField: (field: 'notes' | 'orderText') => void;
  disabled?: boolean;
}

export const VoiceDictationBar: React.FC<VoiceDictationBarProps> = ({
  onAppendText,
  targetField,
  setTargetField,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [dictationLang, setDictationLang] = useState('en-IN');
  const [audioLevel, setAudioLevel] = useState(0);
  const [appendMode, setAppendMode] = useState<'APPEND' | 'REPLACE'>('APPEND');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = dictationLang;

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => (prev ? prev + ' ' + finalChunk.trim() : finalChunk.trim()));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [dictationLang]);

  // Timer loop
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Start Dictation via MediaRecorder & Speech Recognition
  const startRecording = async () => {
    try {
      setTranscript('');
      setInterimTranscript('');
      setRecordingSeconds(0);

      // Request microphone media stream (MediaRecorder API requirement)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start(250);

      // Set up Web Audio API AnalyserNode for visual mic meters
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudioMeter = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
          }
        };
        updateAudioMeter();
      } catch (audioErr) {
        console.warn('Audio Context meter setup issue:', audioErr);
      }

      // Start Web Speech Recognition alongside MediaRecorder
      if (recognitionRef.current) {
        recognitionRef.current.lang = dictationLang;
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition already active:', e);
        }
      }

      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required for judicial voice dictation. Please check browser permissions.');
    }
  };

  // Pause / Resume Dictation
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsPaused(true);
    }
  };

  // Stop Recording and apply transcribed text
  const stopRecording = (applyText = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }

    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);

    if (applyText) {
      const finalText = (transcript + ' ' + interimTranscript).trim();
      if (finalText) {
        onAppendText(finalText, targetField);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const fullTextPreview = (transcript + ' ' + interimTranscript).trim();

  return (
    <div className="bg-[#111214] border border-purple-500/30 rounded-2xl p-4 shadow-2xl space-y-3 font-sans">
      
      {/* Top Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Mic className={`w-4 h-4 ${isRecording && !isPaused ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-syne flex items-center space-x-1.5">
              <span>Judicial Voice Dictation Engine</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MediaRecorder + WebSpeech API
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Dictate bench notes or order text directly using real-time speech recognition
            </p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Target Selector */}
          <div className="flex items-center bg-[#08090a] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTargetField('notes')}
              disabled={isRecording}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
                targetField === 'notes'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <StickyNote className="w-3 h-3" />
              <span>Bench Notes</span>
            </button>

            <button
              onClick={() => setTargetField('orderText')}
              disabled={isRecording}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
                targetField === 'orderText'
                  ? 'bg-amber-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Order Body Text</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-[#08090a] px-2.5 py-1 rounded-xl border border-white/10 text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={dictationLang}
              onChange={(e) => setDictationLang(e.target.value)}
              disabled={isRecording}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-mono"
            >
              <option value="en-IN" className="bg-[#111214]">English (en-IN)</option>
              <option value="hi-IN" className="bg-[#111214]">Hindi (hi-IN)</option>
              <option value="ta-IN" className="bg-[#111214]">Tamil (ta-IN)</option>
              <option value="te-IN" className="bg-[#111214]">Telugu (te-IN)</option>
              <option value="bn-IN" className="bg-[#111214]">Bengali (bn-IN)</option>
              <option value="mr-IN" className="bg-[#111214]">Marathi (mr-IN)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Dictation Control Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl bg-[#08090a] border border-white/10">
        
        {/* Record Button & Status Indicator */}
        <div className="flex items-center space-x-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 border border-purple-400/40"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Start Dictating</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => stopRecording(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5 border border-emerald-400/40"
              >
                <Check className="w-4 h-4" />
                <span>Apply Dictation</span>
              </button>

              <button
                onClick={togglePause}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                title={isPaused ? 'Resume Recording' : 'Pause Recording'}
              >
                {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => stopRecording(false)}
                className="p-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 transition-colors border border-red-800/50"
                title="Cancel Recording"
              >
                <Square className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {/* Recording Timer & Pulse Meter */}
          {isRecording && (
            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <div className="flex items-center space-x-1.5">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="font-mono font-bold text-sm text-red-400">
                  {formatTime(recordingSeconds)}
                </span>
              </div>

              {/* Dynamic Audio Level Meter */}
              <div className="flex items-center space-x-1 h-4 w-16 bg-[#111214] px-1 rounded-md border border-white/10">
                {[20, 40, 60, 80, 100].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-3 rounded-xs transition-all duration-75 ${
                      audioLevel >= step ? (step > 80 ? 'bg-red-400' : step > 50 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Append vs Replace Mode Option */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-zinc-500">Insertion Mode:</span>
          <button
            onClick={() => setAppendMode(appendMode === 'APPEND' ? 'REPLACE' : 'APPEND')}
            className="px-2.5 py-1 rounded-lg bg-[#111214] border border-white/10 text-purple-300 font-bold hover:border-purple-500/50 transition-all"
          >
            {appendMode === 'APPEND' ? ' Append to End' : ' Replace Text'}
          </button>
        </div>

      </div>

      {/* Live Transcript Preview Container */}
      {(fullTextPreview || isRecording) && (
        <div className="p-3 rounded-xl bg-[#08090a] border border-purple-500/20 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono border-b border-white/5 pb-1">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Real-Time Recognized Dictation Transcript:</span>
            </span>
            <span className="text-purple-300 font-bold">
              Target: {targetField === 'notes' ? 'Bench Notes' : 'Order Body'}
            </span>
          </div>

          <div className="min-h-[36px] max-h-24 overflow-y-auto text-zinc-200 leading-relaxed font-sans italic p-2 bg-[#111214] rounded-lg border border-white/5">
            {transcript && <span className="not-italic text-white font-medium">{transcript} </span>}
            {interimTranscript && (
              <span className="text-purple-300 font-medium animate-pulse">{interimTranscript}</span>
            )}
            {!fullTextPreview && isRecording && (
              <span className="text-zinc-500 not-italic">Listening... Speak clearly into microphone...</span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
