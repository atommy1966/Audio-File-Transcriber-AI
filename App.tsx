import React, { useState, useCallback, useRef, useEffect } from 'react';
import { transcribeAudio } from './services/geminiService';
import { AppState } from './types';
import { UploadIcon, LoaderIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [transcription, setTranscription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioSrc(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setTranscription('');
      setErrorMessage(null);
      setAppState(AppState.IDLE);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleTranscribe = useCallback(async () => {
    if (!audioFile) return;

    setAppState(AppState.PROCESSING);
    setErrorMessage(null);
    setTranscription('');

    try {
      const result = await transcribeAudio(audioFile);
      setTranscription(result);
      if (result.toLowerCase().startsWith('transcription failed:')) {
         setErrorMessage(result);
         setAppState(AppState.ERROR);
      } else {
         setAppState(AppState.IDLE);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setErrorMessage(`Failed to transcribe audio: ${message}`);
      setAppState(AppState.ERROR);
    }
  }, [audioFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex items-center justify-center font-sans p-4">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <header className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Audio File Transcriber AI
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Select an audio file and let Gemini transcribe it for you.
          </p>
        </header>
        
        <div className="w-full flex flex-col items-center gap-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/mp3,audio/wav,audio/webm,audio/ogg,audio/m4a,audio/x-m4a"
                className="hidden"
            />
            <div 
                onClick={handleDropzoneClick}
                className="w-full max-w-lg h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800/20 transition-colors"
            >
                {audioFile ? (
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-300">File Selected:</p>
                        <p className="text-cyan-400 mt-1">{audioFile.name}</p>
                        <p className="text-sm text-gray-500 mt-2">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <UploadIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-semibold">Click to select an audio file</p>
                        <p className="text-sm text-gray-500">MP3, WAV, WEBM, OGG, M4A</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleTranscribe}
                disabled={!audioFile || appState === AppState.PROCESSING}
                className="w-64 h-16 rounded-lg flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:shadow-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 text-white"
            >
              {appState === AppState.PROCESSING ? (
                <>
                    <LoaderIcon className="h-8 w-8 mr-3 animate-spin" />
                    Transcribing...
                </>
              ) : (
                'Transcribe Audio'
              )}
            </button>
        </div>

        {audioSrc && (
          <div className="w-full max-w-lg mt-8">
            <audio controls src={audioSrc} className="w-full rounded-lg" aria-label="Audio player for uploaded file">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="w-full mt-8 min-h-[150px]">
          {appState === AppState.ERROR && errorMessage && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {transcription && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 w-full text-left">
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Transcription Result:</h2>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {transcription}
              </p>
            </div>
          )}

          {appState === AppState.IDLE && !transcription && !errorMessage && !audioFile && (
             <p className="text-gray-500">Your transcribed text will appear here.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;