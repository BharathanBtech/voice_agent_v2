# Voice Agent

A TypeScript application for a voice agent with speech-to-text, LLM, and text-to-speech capabilities.

## Current Status

**Phase 1: Speech-to-Text Component** ✅ (In Development)
- Using Google Cloud Speech API
- REST API endpoint for audio file upload
- Real-time speech recognition

**Phase 2: LLM Integration** 🔄 (Planned)
- Will be developed after Phase 1 completion

**Phase 3: Text-to-Speech** 🔄 (Planned)
- Will be developed after Phase 2 completion

## Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Google Cloud Account** with Speech API enabled
3. **Google Cloud Project** (your project: `gemini-ai-yuniq`)
4. **Authentication** (Service Account Key or OAuth credentials)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Google Cloud credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project: `gemini-ai-yuniq`
   - Enable the Speech API
   - Choose authentication method:
     - **Service Account** (recommended): Create service account and download JSON key
     - **OAuth**: Your OAuth credentials are already configured
   - See [GOOGLE_SETUP.md](GOOGLE_SETUP.md) for detailed instructions

4. Build the project:
   ```bash
   npm run build
   ```

5. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

### Speech-to-Text
- `POST /api/speech-to-text` - Upload audio file for transcription
- `POST /api/speech-to-text/stream` - Real-time speech recognition

## Development

- `npm run dev` - Run with ts-node for development
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application

## Project Structure

```
src/
├── components/
│   └── speech-to-text/     # Speech-to-text functionality
├── services/
│   └── google-speech.ts     # Google Speech API integration
├── types/
│   └── index.ts            # Type definitions
└── index.ts                # Main application entry point
```
