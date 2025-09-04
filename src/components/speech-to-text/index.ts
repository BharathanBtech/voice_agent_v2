import { GoogleSpeechService } from '../../services/google-speech';
import { GoogleAuthConfig } from '../../services/google-auth';
import { SpeechRecognitionRequest, SpeechRecognitionResponse, ApiResponse } from '../../types';

export class SpeechToTextComponent {
  private speechService: GoogleSpeechService;

  constructor(authConfig: GoogleAuthConfig) {
    this.speechService = new GoogleSpeechService(authConfig);
  }

  /**
   * Process audio file and convert to text
   */
  async processAudioFile(request: SpeechRecognitionRequest): Promise<ApiResponse<SpeechRecognitionResponse>> {
    try {
      // Validate input
      if (!request.audio || request.audio.length === 0) {
        return {
          success: false,
          error: 'Audio data is required'
        };
      }

      if (!request.encoding) {
        return {
          success: false,
          error: 'Audio encoding is required'
        };
      }

      // Process speech recognition
      const result = await this.speechService.recognizeSpeech(request);

      return {
        success: true,
        data: result,
        message: 'Speech recognition completed successfully'
      };
    } catch (error) {
      console.error('Error in speech-to-text processing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Process streaming audio chunk
   */
  async processAudioChunk(audioChunk: Buffer, encoding: string, sampleRateHertz: number = 16000): Promise<ApiResponse<string>> {
    try {
      if (!audioChunk || audioChunk.length === 0) {
        return {
          success: false,
          error: 'Audio chunk is required'
        };
      }

      const transcript = await this.speechService.recognizeSpeechStream(audioChunk, encoding, sampleRateHertz);

      return {
        success: true,
        data: transcript,
        message: 'Audio chunk processed successfully'
      };
    } catch (error) {
      console.error('Error in streaming audio processing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get supported audio encodings
   */
  getSupportedEncodings(): string[] {
    return [
      'LINEAR16',
      'FLAC',
      'MP3',
      'MULAW',
      'AMR',
      'AMR_WB',
      'OGG_OPUS',
      'SPEEX_WITH_HEADER_BYTE',
      'WEBM_OPUS'
    ];
  }

  /**
   * Get supported sample rates
   */
  getSupportedSampleRates(): number[] {
    return [8000, 12000, 16000, 24000, 48000];
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<string[]> {
    try {
      return await this.speechService.getSupportedLanguages();
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'];
    }
  }

  /**
   * Test the component functionality
   */
  async testComponent(): Promise<boolean> {
    try {
      return await this.speechService.testConnection();
    } catch (error) {
      console.error('Component test failed:', error);
      return false;
    }
  }

  /**
   * Get authentication information
   */
  getAuthInfo() {
    return this.speechService.getAuthInfo();
  }

  /**
   * Validate audio format
   */
  validateAudioFormat(encoding: string, sampleRateHertz?: number): boolean {
    const supportedEncodings = this.getSupportedEncodings();
    const supportedSampleRates = this.getSupportedSampleRates();

    if (!supportedEncodings.includes(encoding)) {
      return false;
    }

    if (sampleRateHertz && !supportedSampleRates.includes(sampleRateHertz)) {
      return false;
    }

    return true;
  }
}
