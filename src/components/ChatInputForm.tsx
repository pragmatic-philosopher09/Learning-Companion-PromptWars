'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { Send, Mic, MicOff, Paperclip, X, Loader2 } from 'lucide-react';
import { getFirebaseApp } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

interface ChatInputFormProps {
  onSendMessage: (text: string) => void;
  loading: boolean;
}

const ChatInputForm = memo(function ChatInputForm({ onSendMessage, loading }: ChatInputFormProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Voice input setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        setBrowserSupportsSpeech(true);
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;
    try {
      const { storage } = getFirebaseApp();
      const auth = getAuth();
      const userId = auth.currentUser?.uid || 'anonymous';
      
      const storageRef = ref(storage, `uploads/${userId}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            setUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setFile(null);
            setUploadProgress(0);
            resolve(downloadURL);
          }
        );
      });
    } catch (e) {
      console.error('Firebase Storage not configured correctly', e);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !file) || loading || uploading) return;

    let finalMessage = input.trim();

    // If there's a file, upload it and append the URL to the message
    if (file) {
      const url = await uploadFile();
      if (url) {
        finalMessage += `\n\n[Attached File: ${file.name}](${url})`;
      }
    }

    if (finalMessage) {
      onSendMessage(finalMessage);
      setInput('');
    }
  };

  return (
    <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
      {/* File Preview */}
      {file && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg max-w-sm">
          <Paperclip size={14} className="text-indigo-500" />
          <span className="text-xs text-indigo-700 truncate flex-1">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-indigo-400 hover:text-indigo-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full h-1 bg-gray-200 rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,.pdf,.txt"
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl border flex-shrink-0 transition-colors"
          style={{ 
            borderColor: 'var(--border-color)', 
            background: file ? '#e0e7ff' : 'var(--bg-primary)',
            color: file ? '#4f46e5' : 'var(--text-secondary)'
          }}
          disabled={loading || uploading}
        >
          <Paperclip size={20} />
        </button>

        {/* Voice button */}
        {browserSupportsSpeech && (
          <button
            type="button"
            onClick={toggleVoice}
            className="p-3 rounded-xl border flex-shrink-0 transition-colors"
            style={{ 
              borderColor: isListening ? '#ef4444' : 'var(--border-color)', 
              background: isListening ? '#fef2f2' : 'var(--bg-primary)',
              color: isListening ? '#ef4444' : 'var(--text-secondary)'
            }}
            disabled={loading || uploading}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask anything..."}
          disabled={loading || uploading}
          className="flex-1 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          style={{ 
            background: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)', 
            color: 'var(--text-primary)' 
          }}
        />
        
        <button
          type="submit"
          disabled={(!input.trim() && !file) || loading || uploading}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 transition-all shadow-sm flex items-center justify-center min-w-[48px]"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
      <div className="text-center mt-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          Powered by Gemini Pro
        </span>
      </div>
    </div>
  );
});

export default ChatInputForm;
