import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './Icons';

interface TranscriptionEditorProps {
  transcription: string;
}

export const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({ transcription }) => {
  const [editableTranscription, setEditableTranscription] = useState(transcription);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setEditableTranscription(transcription);
  }, [transcription]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableTranscription).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col">
            <h2 className="text-xl font-semibold mb-3 text-gray-200 text-left">Transcription</h2>
            <textarea
                value={editableTranscription}
                onChange={(e) => setEditableTranscription(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl shadow-inner p-6 text-gray-200 whitespace-pre-wrap leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
                aria-label="Editable transcription text"
            />
            <button
                onClick={handleCopy}
                className="mt-4 w-full md:w-auto md:self-end px-6 py-3 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors duration-200 ease-in-out shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 focus:ring-green-400 text-white"
                disabled={isCopied}
            >
                <ClipboardIcon className="h-6 w-6 mr-2" />
                {isCopied ? 'Copied!' : 'Copy Text'}
            </button>
        </div>
    </div>
  );
};
