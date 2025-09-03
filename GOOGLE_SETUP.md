# Google Cloud Setup Guide for Voice Agent

## 🎯 Your Project Configuration

**Project ID:** `gemini-ai-yuniq`  
**OAuth Client ID:** `383981119147-dof48ep1d286i5u5hrs4i9u6543jobcj.apps.googleusercontent.com`

## 📋 Required Setup Steps

### 1. Enable Speech API in Your Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **gemini-ai-yuniq**
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Speech-to-Text API"**
5. Click on it and press **Enable**

### 2. Choose Authentication Method

#### Option A: Service Account (Recommended for Production)

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name: `voice-agent-speech`
4. Description: `Service account for Voice Agent Speech-to-Text`
5. Click **Create and Continue**
6. Add these roles:
   - **Speech-to-Text Admin**
   - **Cloud Platform Admin** (or more restricted if preferred)
7. Click **Done**
8. Click on the created service account
9. Go to **Keys** tab
10. Click **Add Key** > **Create New Key**
11. Choose **JSON** format
12. Download the key file
13. Place it in your project root (e.g., `service-account-key.json`)
14. Update your `.env` file:
    ```bash
    GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
    ```

#### Option B: Use OAuth (Alternative)

Your OAuth credentials are already configured, but you'll need to:
1. Ensure the Speech API is enabled
2. Set up proper OAuth consent screen
3. Add necessary scopes for Speech API access

### 3. Environment Configuration

Create a `.env` file in your project root:

```bash
# Your project details
GOOGLE_PROJECT_ID=gemini-ai-yuniq

# Option 1: Service Account Key (Recommended)
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Option 2: OAuth (Alternative)
GOOGLE_CLIENT_ID=your google client id here
GOOGLE_CLIENT_SECRET= google client secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Testing Your Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Test the setup:**
   - Open: http://localhost:3000
   - Click "Get Authentication Information"
   - Click "Test Speech-to-Text Component"

## 🔍 Troubleshooting

### Common Issues:

1. **"Permission denied" errors:**
   - Ensure Speech API is enabled
   - Check service account permissions
   - Verify project ID is correct

2. **"Authentication failed" errors:**
   - Check service account key file path
   - Ensure key file has correct permissions
   - Verify the key hasn't expired

3. **"API not enabled" errors:**
   - Go to Google Cloud Console
   - Enable Speech-to-Text API
   - Wait a few minutes for activation

### Testing Commands:

```bash
# Test with demo script
node demo.js

# Check environment variables
echo $GOOGLE_APPLICATION_CREDENTIALS
echo $GOOGLE_PROJECT_ID
```

## 📚 Additional Resources

- [Google Cloud Speech API Documentation](https://cloud.google.com/speech-to-text/docs)
- [Google Cloud Authentication Guide](https://cloud.google.com/docs/authentication)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/service-accounts)

## 🆘 Need Help?

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your Google Cloud project settings
3. Ensure all required APIs are enabled
4. Check that your service account has the correct permissions
