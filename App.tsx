import React, { useState, useCallback, useRef, useEffect } from 'react';
import { transcribeAudio } from './services/geminiService';
import { AppState } from './types';
import { UploadIcon, LoaderIcon, XCircleIcon } from './components/Icons';
import { TranscriptionEditor } from './components/TranscriptionEditor';

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
    } else {
      setAudioSrc(null);
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
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClearFile = () => {
    setAudioFile(null);
    setAudioSrc(null);
    setTranscription('');
    setErrorMessage(null);
    setAppState(AppState.IDLE);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <header className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Audio File Transcriber AI
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Select an audio file, let Gemini transcribe it, and edit the result.
          </p>
        </header>
        
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/mp3,audio/wav,audio/webm,audio/ogg,audio/m4a,audio/x-m4a"
                className="hidden"
            />
            {!audioFile ? (
                <div 
                    onClick={handleDropzoneClick}
                    className="w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800/20 transition-colors"
                >
                    <div className="text-center text-gray-400">
                        <UploadIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-semibold">Click to select an audio file</p>
                        <p className="text-sm text-gray-500">MP3, WAV, WEBM, OGG, M4A</p>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300">
                    <div className="flex-grow w-full text-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Selected file:</p>
                                <p className="font-semibold text-white truncate pr-2" title={audioFile.name}>{audioFile.name}</p>
                            </div>
                            <button onClick={handleClearFile} className="text-gray-400 hover:text-white transition-colors" aria-label="Clear file selection">
                                <XCircleIcon className="w-7 h-7" />
                            </button>
                        </div>
                         {audioSrc && (
                            <audio controls src={audioSrc} className="w-full rounded-lg mt-2" aria-label="Audio player for uploaded file">
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                    <button
                        onClick={handleTranscribe}
                        disabled={appState === AppState.PROCESSING}
                        className="w-full sm:w-48 h-14 flex-shrink-0 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:shadow-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 text-white"
                    >
                    {appState === AppState.PROCESSING ? (
                        <>
                            <LoaderIcon className="h-7 w-7 mr-2 animate-spin" />
                            Transcribing...
                        </>
                    ) : (
                        'Transcribe'
                    )}
                    </button>
                </div>
            )}
        </div>

        <div className="w-full mt-8 min-h-[150px]">
          {appState === AppState.ERROR && errorMessage && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-3xl mx-auto" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {transcription && !errorMessage && (
            <TranscriptionEditor transcription={transcription} />
          )}

          {appState === AppState.IDLE && !transcription && !errorMessage && !audioFile && (
             <p className="text-gray-500 mt-4">Your transcribed text will appear here.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;