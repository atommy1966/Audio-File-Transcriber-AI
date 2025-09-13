
import { GoogleGenAI } from "@google/genai";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve(base64data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const audioData = await blobToBase64(audioBlob);
    
    const audioPart = {
      inlineData: {
        mimeType: audioBlob.type || 'audio/webm',
        data: audioData,
      },
    };
    
    const textPart = {
      text: "Transcribe the following audio recording. Provide only the transcribed text, without any additional comments or introductions.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error during transcription:", error);
    if (error instanceof Error) {
        return `Transcription failed: ${error.message}`;
    }
    return "An unknown error occurred during transcription.";
  }
};
