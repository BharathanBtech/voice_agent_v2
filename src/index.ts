import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { SpeechToTextComponent } from './components/speech-to-text';
import { GoogleAuthConfig } from './services/google-auth';
import { ApiResponse } from './types';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Auth configuration
const googleAuthConfig: GoogleAuthConfig = {
  projectId: process.env.GOOGLE_PROJECT_ID || 'gemini-ai-yuniq',
  serviceAccountKeyPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

// Debug: Log the configuration
console.log('🔧 Google Auth Configuration:');
console.log('  Project ID:', googleAuthConfig.projectId);
console.log('  Service Account Key Path:', googleAuthConfig.serviceAccountKeyPath);
console.log('  Authentication Method: Service Account');

// Initialize components
const speechToTextComponent = new SpeechToTextComponent(googleAuthConfig);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Voice Agent - Speech-to-Text',
    version: '1.0.0'
  });
});

// Test component endpoint
app.get('/api/test', async (req, res) => {
  try {
    const isWorking = await speechToTextComponent.testComponent();
    const authInfo = speechToTextComponent.getAuthInfo();
    
    res.json({
      success: true,
      data: {
        component: 'speech-to-text',
        status: isWorking ? 'working' : 'not working',
        auth: authInfo,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get authentication information
app.get('/api/auth-info', (req, res) => {
  try {
    const authInfo = speechToTextComponent.getAuthInfo();
    res.json({
      success: true,
      data: authInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get supported formats and languages
app.get('/api/supported-formats', (req, res) => {
  try {
    const encodings = speechToTextComponent.getSupportedEncodings();
    const sampleRates = speechToTextComponent.getSupportedSampleRates();
    
    res.json({
      success: true,
      data: {
        encodings,
        sampleRates,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/supported-languages', async (req, res) => {
  try {
    const languages = await speechToTextComponent.getSupportedLanguages();
    res.json({
      success: true,
      data: {
        languages,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Speech-to-text endpoint for file upload
app.post('/api/speech-to-text', upload.single('audio'), async (req: express.Request & { file?: Express.Multer.File }, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    const {
      encoding = 'LINEAR16',
      sampleRateHertz = 16000,
      languageCode = 'en-US',
      enableWordTimeOffsets = false,
      enableAutomaticPunctuation = true
    } = req.body;

    // Validate audio format
    if (!speechToTextComponent.validateAudioFormat(encoding, parseInt(sampleRateHertz))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid audio format or sample rate'
      });
    }

    const request = {
      audio: req.file.buffer,
      encoding,
      sampleRateHertz: parseInt(sampleRateHertz),
      languageCode,
      enableWordTimeOffsets: enableWordTimeOffsets === 'true',
      enableAutomaticPunctuation: enableAutomaticPunctuation === 'true'
    };

    const result = await speechToTextComponent.processAudioFile(request);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing speech-to-text request:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Streaming speech-to-text endpoint
app.post('/api/speech-to-text/stream', async (req, res) => {
  try {
    const { audioChunk, encoding, sampleRateHertz = 16000 } = req.body;

    if (!audioChunk) {
      return res.status(400).json({
        success: false,
        error: 'Audio chunk is required'
      });
    }

    // Convert base64 string back to buffer
    const audioBuffer = Buffer.from(audioChunk, 'base64');
    
    const result = await speechToTextComponent.processAudioChunk(
      audioBuffer,
      encoding || 'LINEAR16',
      parseInt(sampleRateHertz)
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing streaming speech-to-text request:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Voice Agent Speech-to-Text service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Speech-to-text: http://localhost:${PORT}/api/speech-to-text`);
  console.log(`📊 Test component: http://localhost:${PORT}/api/test`);
});

export default app;
