
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

/**
 * Formats a block of text by adding line breaks and paragraphs for better readability.
 * @param ai - The GoogleGenAI instance.
 * @param text - The text to format.
 * @returns The formatted text, or the original text if formatting fails.
 */
const formatTranscription = async (ai: GoogleGenAI, text: string): Promise<string> => {
  if (!text.trim()) {
    return text;
  }
  try {
    const prompt = `Please format the following text with appropriate line breaks and paragraphs to improve readability. Do not change the original words. Return only the formatted text.\n\nText to format:\n"""\n${text}\n"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error during text formatting:", error);
    // Fallback to original text if formatting fails
    return text;
  }
};


export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Step 1: Transcribe audio to raw text
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

    const transcriptionResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    const rawTranscription = transcriptionResponse.text.trim();

    if (!rawTranscription) {
        return "The audio appears to be silent or could not be transcribed.";
    }

    // Step 2: Format the raw text for readability
    const formattedTranscription = await formatTranscription(ai, rawTranscription);

    return formattedTranscription;

  } catch (error) {
    console.error("Error during transcription process:", error);
    if (error instanceof Error) {
        return `Transcription failed: ${error.message}`;
    }
    return "An unknown error occurred during transcription.";
  }
};
