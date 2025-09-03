import { SpeechClient } from '@google-cloud/speech';
import { SpeechRecognitionRequest, SpeechRecognitionResponse, WordInfo } from '../types';
import { GoogleAuthService, GoogleAuthConfig } from './google-auth';

export class GoogleSpeechService {
  private client: SpeechClient;
  private authService: GoogleAuthService;

  constructor(authConfig: GoogleAuthConfig) {
    this.authService = new GoogleAuthService(authConfig);
    this.client = new SpeechClient({
      projectId: authConfig.projectId,
      authClient: undefined // Will be set when needed
    });
  }

  /**
   * Convert speech to text using Google Cloud Speech API
   */
  async recognizeSpeech(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResponse> {
    try {
      // Get authenticated client and create new SpeechClient instance
      const authClient = await this.authService.getAuthenticatedClient();
      const projectId = await this.client.getProjectId();
      const speechClient = new SpeechClient({
        projectId: projectId,
        authClient: authClient as any
      });

      const audio = {
        content: request.audio.toString('base64'),
      };

      const config = {
        encoding: request.encoding as any,
        sampleRateHertz: request.sampleRateHertz || 16000,
        languageCode: request.languageCode || 'en-US',
        enableWordTimeOffsets: request.enableWordTimeOffsets || false,
        enableAutomaticPunctuation: request.enableAutomaticPunctuation || true,
        model: 'default',
        useEnhanced: true,
      };

      const speechRequest = {
        audio: audio,
        config: config,
      };

      const [response] = await speechClient.recognize(speechRequest);
      
      if (!response.results || response.results.length === 0) {
        throw new Error('No transcription results returned');
      }

      const result = response.results[0];
      const transcript = result.alternatives?.[0]?.transcript || '';
      const confidence = result.alternatives?.[0]?.confidence || 0;

      let words: WordInfo[] = [];
      if (request.enableWordTimeOffsets && result.alternatives?.[0]?.words) {
        words = result.alternatives[0].words.map(word => ({
          word: word.word || '',
          startTime: word.startTime?.seconds ? `${word.startTime.seconds}s` : '0s',
          endTime: word.endTime?.seconds ? `${word.endTime.seconds}s` : '0s',
          confidence: word.confidence || 0,
        }));
      }

      return {
        transcript,
        confidence,
        words,
        languageCode: config.languageCode,
      };
    } catch (error) {
      console.error('Error in speech recognition:', error);
      throw new Error(`Speech recognition failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert speech to text with streaming support
   */
  async recognizeSpeechStream(audioChunk: Buffer, encoding: string, sampleRateHertz: number = 16000): Promise<string> {
    try {
      // Get authenticated client and create new SpeechClient instance
      const authClient = await this.authService.getAuthenticatedClient();
      const projectId = await this.client.getProjectId();
      const speechClient = new SpeechClient({
        projectId: projectId,
        authClient: authClient as any
      });

      const audio = {
        content: audioChunk.toString('base64'),
      };

      const config = {
        encoding: encoding as any,
        sampleRateHertz: sampleRateHertz,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true,
      };

      const speechRequest = {
        audio: audio,
        config: config,
      };

      const [response] = await speechClient.recognize(speechRequest);
      
      if (!response.results || response.results.length === 0) {
        return '';
      }

      return response.results[0].alternatives?.[0]?.transcript || '';
    } catch (error) {
      console.error('Error in streaming speech recognition:', error);
      throw new Error(`Streaming speech recognition failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<string[]> {
    // Google Cloud Speech API supports many languages, but we'll return a curated list
    // of commonly used languages. The full list can be found in the Google Cloud documentation.
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN',
      'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE',
      'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH',
      'de-DE', 'de-AT', 'de-CH',
      'it-IT', 'it-CH',
      'pt-BR', 'pt-PT',
      'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'zh-HK',
      'ru-RU', 'nl-NL', 'pl-PL', 'tr-TR', 'ar-SA',
      'hi-IN', 'th-TH', 'vi-VN', 'id-ID', 'ms-MY'
    ];
  }

  /**
   * Test the service connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // First test authentication
      const authTest = await this.authService.testAuth();
      if (!authTest) {
        return false;
      }
      
      // Then test Speech API
      await this.getSupportedLanguages();
      return true;
    } catch (error) {
      console.error('Google Speech API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get authentication information
   */
  getAuthInfo() {
    return this.authService.getAuthInfo();
  }
}
