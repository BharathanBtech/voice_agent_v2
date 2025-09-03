import fs from 'fs';
import path from 'path';

/**
 * Simple test client for the Speech-to-Text API
 * This file demonstrates how to use the API endpoints
 */

const API_BASE_URL = 'http://localhost:3000';

async function testHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
  }
}

async function testComponentStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`);
    const data = await response.json();
    console.log('✅ Component Test:', data);
  } catch (error) {
    console.error('❌ Component Test Failed:', error);
  }
}

async function testSupportedFormats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supported-formats`);
    const data = await response.json();
    console.log('✅ Supported Formats:', data);
  } catch (error) {
    console.error('❌ Supported Formats Failed:', error);
  }
}

async function testSupportedLanguages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supported-languages`);
    const data = await response.json();
    console.log('✅ Supported Languages:', data);
  } catch (error) {
    console.error('❌ Supported Languages Failed:', error);
  }
}

async function testSpeechToText(audioFilePath: string) {
  try {
    if (!fs.existsSync(audioFilePath)) {
      console.log(`⚠️  Audio file not found: ${audioFilePath}`);
      console.log('   Create a test audio file or use an existing one');
      return;
    }

    const audioBuffer = fs.readFileSync(audioFilePath);
    const formData = new FormData();
    
    // Create a Blob from the buffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('audio', audioBlob, 'test-audio.wav');
    formData.append('encoding', 'LINEAR16');
    formData.append('sampleRateHertz', '16000');
    formData.append('languageCode', 'en-US');
    formData.append('enableAutomaticPunctuation', 'true');

    const response = await fetch(`${API_BASE_URL}/api/speech-to-text`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('✅ Speech-to-Text Test:', data);
  } catch (error) {
    console.error('❌ Speech-to-Text Test Failed:', error);
  }
}

async function testStreamingSpeechToText() {
  try {
    // Simulate an audio chunk (in real usage, this would come from microphone)
    const mockAudioChunk = Buffer.from('mock audio data').toString('base64');
    
    const response = await fetch(`${API_BASE_URL}/api/speech-to-text/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioChunk: mockAudioChunk,
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
      }),
    });

    const data = await response.json();
    console.log('✅ Streaming Speech-to-Text Test:', data);
  } catch (error) {
    console.error('❌ Streaming Speech-to-Text Test Failed:', error);
  }
}

async function runAllTests() {
  console.log('🧪 Running Speech-to-Text API Tests...\n');

  await testHealthCheck();
  await testComponentStatus();
  await testSupportedFormats();
  await testSupportedLanguages();
  
  console.log('\n📁 Testing Speech-to-Text with file upload...');
  console.log('   Note: Create a test audio file to test this endpoint');
  await testSpeechToText('./test-audio.wav');
  
  console.log('\n🔄 Testing Streaming Speech-to-Text...');
  await testStreamingSpeechToText();

  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export {
  testHealthCheck,
  testComponentStatus,
  testSupportedFormats,
  testSupportedLanguages,
  testSpeechToText,
  testStreamingSpeechToText,
  runAllTests,
};
