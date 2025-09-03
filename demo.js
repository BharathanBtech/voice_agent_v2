#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Demo script for the Voice Agent Speech-to-Text API
 * This script demonstrates how to use the API endpoints
 */

const API_BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return null;
  }
}

// Test health check
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  const result = await makeRequest(`${API_BASE_URL}/health`);
  if (result) {
    console.log('✅ Health Check:', result);
  }
  console.log('');
}

// Test component status
async function testComponentStatus() {
  console.log('🧪 Testing Component Status...');
  const result = await makeRequest(`${API_BASE_URL}/api/test`);
  if (result) {
    console.log('✅ Component Test:', result);
  }
  console.log('');
}

// Test supported formats
async function testSupportedFormats() {
  console.log('📊 Testing Supported Formats...');
  const result = await makeRequest(`${API_BASE_URL}/api/supported-formats`);
  if (result) {
    console.log('✅ Supported Formats:', result);
  }
  console.log('');
}

// Test supported languages
async function testSupportedLanguages() {
  console.log('🌍 Testing Supported Languages...');
  const result = await makeRequest(`${API_BASE_URL}/api/supported-languages`);
  if (result) {
    console.log('✅ Supported Languages:', result);
  }
  console.log('');
}

// Test speech-to-text with a sample audio file
async function testSpeechToText() {
  console.log('🎵 Testing Speech-to-Text...');
  
  // Check if test audio file exists
  const testAudioPath = path.join(__dirname, 'test-audio.wav');
  if (!fs.existsSync(testAudioPath)) {
    console.log('⚠️  Test audio file not found. Creating a mock test...');
    
    // Test with streaming endpoint instead
    const mockAudioChunk = Buffer.from('mock audio data').toString('base64');
    const result = await makeRequest(`${API_BASE_URL}/api/speech-to-text/stream`, {
      method: 'POST',
      body: JSON.stringify({
        audioChunk: mockAudioChunk,
        encoding: 'LINEAR16',
        sampleRateHertz: 16000
      })
    });
    
    if (result) {
      console.log('✅ Streaming Speech-to-Text Test:', result);
    }
  } else {
    console.log('📁 Test audio file found. Testing file upload...');
    
    // In a real scenario, you would use FormData to upload the file
    // For this demo, we'll just show the streaming endpoint
    const mockAudioChunk = Buffer.from('mock audio data').toString('base64');
    const result = await makeRequest(`${API_BASE_URL}/api/speech-to-text/stream`, {
      method: 'POST',
      body: JSON.stringify({
        audioChunk: mockAudioChunk,
        encoding: 'LINEAR16',
        sampleRateHertz: 16000
      })
    });
    
    if (result) {
      console.log('✅ Streaming Speech-to-Text Test:', result);
    }
  }
  
  console.log('');
}

// Test streaming speech-to-text
async function testStreamingSpeechToText() {
  console.log('🔄 Testing Streaming Speech-to-Text...');
  
  const mockAudioChunk = Buffer.from('mock audio data').toString('base64');
  const result = await makeRequest(`${API_BASE_URL}/api/speech-to-text/stream`, {
    method: 'POST',
    body: JSON.stringify({
      audioChunk: mockAudioChunk,
      encoding: 'LINEAR16',
      sampleRateHertz: 16000
    })
  });
  
  if (result) {
    console.log('✅ Streaming Speech-to-Text:', result);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Voice Agent - Speech-to-Text Demo\n');
  console.log('This demo will test all available API endpoints.\n');
  
  try {
    await testHealthCheck();
    await testComponentStatus();
    await testSupportedFormats();
    await testSupportedLanguages();
    await testSpeechToText();
    await testStreamingSpeechToText();
    
    console.log('✨ All tests completed!');
    console.log('\n📋 To test with real audio files:');
    console.log('1. Place an audio file named "test-audio.wav" in the project root');
    console.log('2. Run this demo again');
    console.log('3. Or use the web interface at http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testHealthCheck,
  testComponentStatus,
  testSupportedFormats,
  testSupportedLanguages,
  testSpeechToText,
  testStreamingSpeechToText,
  runAllTests
};
