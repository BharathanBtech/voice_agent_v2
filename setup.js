#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Voice Agent - Speech-to-Text Component\n');

// Check if Node.js is installed
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
  
  // Check if version is 16 or higher
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 16) {
    console.error('❌ Node.js version 16 or higher is required');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Node.js is not installed');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not available');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
    console.log('⚠️  Please update .env with your Google Cloud credentials');
  } catch (error) {
    console.error('❌ Failed to create .env file');
  }
}

// Build the project
console.log('\n🔨 Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Project built successfully');
} catch (error) {
  console.error('❌ Failed to build project');
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up Google Cloud Speech API credentials:');
console.log('   - Go to Google Cloud Console (https://console.cloud.google.com/)');
console.log('   - Select your project: gemini-ai-yuniq');
console.log('   - Enable the Speech API');
console.log('   - Create a service account and download the JSON key');
console.log('   - Update the .env file with the key path');
console.log('\n2. Alternative: Use OAuth (if you prefer):');
console.log('   - Your OAuth credentials are already configured');
console.log('   - Make sure Speech API is enabled in your project');
console.log('\n3. Start the server:');
console.log('   npm start');
console.log('\n4. Open your browser to:');
console.log('   http://localhost:3000');
console.log('\n5. Test the speech-to-text functionality!');
console.log('\n📚 For more information, see the README.md file');
