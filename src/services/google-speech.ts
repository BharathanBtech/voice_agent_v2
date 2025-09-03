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
      authClient: this.authService.getAuthenticatedClient()
    });
  }

  /**
   * Convert speech to text using Google Cloud Speech API
   */
  async recognizeSpeech(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResponse> {
    try {
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

      const [response] = await this.client.recognize(speechRequest);
      
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

      const [response] = await this.client.recognize(speechRequest);
      
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
    try {
      const [response] = await this.client.getSupportedLanguages();
      return response.languages?.map(lang => lang.languageCode || '') || [];
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'];
    }
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
