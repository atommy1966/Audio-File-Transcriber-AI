# Audio File Transcriber AI

This is a web application that transcribes audio files into text using Google's Gemini AI. Users can upload an audio file, and the application will provide a text transcription, along with an audio player to verify the results.

## App Link

<a href="https://audio-file-transcriber-ai-369376059789.us-west1.run.app/" target="_blank" rel="noopener noreferrer">Audio File Transcriber AI</a>

## Features

-   **File Upload**: Supports various audio formats including MP3, WAV, WEBM, OGG, and M4A.
-   **AI-Powered Transcription**: Utilizes the powerful `gemini-2.5-flash` model via the Google Gemini API for accurate and fast transcription.
-   **Audio Playback**: An integrated HTML5 audio player allows users to listen to the uploaded audio file, making it easy to check the transcription accuracy.
-   **User-Friendly Interface**: A clean and intuitive UI with clear states for idle, processing, and error conditions.
-   **Responsive Design**: The interface is designed to work smoothly on both desktop and mobile devices.

## Technologies Used

-   **Frontend**: React, TypeScript
-   **AI Model**: Google Gemini API (`@google/genai`)
-   **Styling**: Tailwind CSS

## Installation and Setup

Follow these steps to set up the project locally.

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [repository-directory]
    ```

2.  **Install dependencies:**
    This project uses a CDN for its dependencies, so no local installation step like `npm install` is required to run the `index.html` file directly in a browser with a local server.

3.  **Set up Environment Variables:**
    The application requires a Google Gemini API key. This key must be available as an environment variable named `API_KEY` in the execution environment where the application is hosted.

    *Example*: If deploying to a platform, set the environment variable in the platform's settings.

4.  **Run the application:**
    Since this is a static project, you can serve the files using any simple web server. For example, using Python's built-in server:
    ```bash
    python -m http.server
    ```
    Or using a tool like `live-server` for automatic reloading.

## How to Use

1.  Open the application in your web browser.
2.  Click on the upload area to select an audio file from your device.
3.  Once a file is selected, its name and size will be displayed.
4.  Click the **"Transcribe Audio"** button to start the transcription process.
5.  The button will show a "Transcribing..." status with a loading indicator.
6.  When the transcription is complete, the resulting text will be displayed in a result box below.
7.  You can use the audio player that appears after file selection to play, pause, and seek through the original audio to verify the transcription.
8.  If an error occurs, a descriptive error message will be shown.