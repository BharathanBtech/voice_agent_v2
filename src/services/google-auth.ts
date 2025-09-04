import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import * as path from 'path';

export interface GoogleAuthConfig {
  projectId: string;
  serviceAccountKeyPath?: string;
}

export class GoogleAuthService {
  private auth: GoogleAuth;
  private config: GoogleAuthConfig;

  constructor(config: GoogleAuthConfig) {
    this.config = config;
    
    const authOptions: GoogleAuthOptions = {
      projectId: config.projectId,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/speech'
      ]
    };

    // Set the GOOGLE_APPLICATION_CREDENTIALS environment variable if service account key is provided
    if (config.serviceAccountKeyPath) {
      // Resolve the path relative to the project root
      const keyPath = path.resolve(process.cwd(), config.serviceAccountKeyPath);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
      console.log(`Set GOOGLE_APPLICATION_CREDENTIALS to: ${keyPath}`);
    }

    this.auth = new GoogleAuth(authOptions);
  }

  /**
   * Get authenticated client
   */
  async getAuthenticatedClient() {
    try {
      const client = await this.auth.getClient();
      return client;
    } catch (error) {
      console.error('Failed to get authenticated client:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get access token
   */
  async getAccessToken() {
    try {
      const token = await this.auth.getAccessToken();
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get project ID
   */
  getProjectId(): string {
    return this.config.projectId;
  }

  /**
   * Test authentication
   */
  async testAuth(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch (error) {
      console.error('Authentication test failed:', error);
      return false;
    }
  }

  /**
   * Get authentication info
   */
  getAuthInfo() {
    return {
      projectId: this.config.projectId,
      hasServiceAccount: !!this.config.serviceAccountKeyPath,
      authMethod: this.config.serviceAccountKeyPath ? 'Service Account' : 'Default Credentials'
    };
  }
}
