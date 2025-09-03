import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';

export interface GoogleAuthConfig {
  projectId: string;
  serviceAccountKeyPath?: string;
  clientId?: string;
  clientSecret?: string;
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

    // If service account key is provided, use it
    if (config.serviceAccountKeyPath) {
      authOptions.keyFile = config.serviceAccountKeyPath;
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
      hasOAuth: !!(this.config.clientId && this.config.clientSecret),
      authMethod: this.config.serviceAccountKeyPath ? 'Service Account' : 'OAuth'
    };
  }
}
