/**
 * API Client for OpenAI Image Generation
 * Handles API calls to OpenAI for image generation
 */

// Initialize OpenAI client
let openaiClient = null;

/**
 * Initialize the OpenAI client with the API key
 * @param {string} apiKey - The OpenAI API key
 */
export function initializeClient(apiKey) {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  
  // Store the API key for later use
  openaiClient = { apiKey };
  return openaiClient;
}

/**
 * Get available models for image generation
 * @returns {Array} - Array of available models
 */
export function getAvailableModels() {
  return [
    { id: 'dall-e-2', name: 'DALL-E 2', sizes: ['256x256', '512x512', '1024x1024'] },
    { id: 'dall-e-3', name: 'DALL-E 3', sizes: ['1024x1024', '1792x1024', '1024x1792'], styles: ['vivid', 'natural'] },
  ];
}

/**
 * Generate images using OpenAI API
 * @param {Object} params - Parameters for image generation
 * @returns {Promise} - Promise resolving to generated images
 */
export async function generateImages(params) {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeClient first.');
  }

  const { prompt, model, size, n, quality, style, imageBase64 } = params;
  
  // Prepare request body based on model
  const requestBody = {
    prompt,
    model: model || 'dall-e-3',
    n: model === 'dall-e-2' ? (n || 1) : 1, // DALL-E 3 only supports n=1
    size: size || '1024x1024',
  };
  
  // Add optional parameters based on model
  if (model === 'dall-e-3') {
    if (quality) requestBody.quality = quality;
    if (style) requestBody.style = style;
  }
  
  // If image is provided and it's a valid base64 string
  if (imageBase64 && typeof imageBase64 === 'string') {
    // For future implementation when OpenAI supports image input for generations
    // Currently, we'll just log this as it's not directly supported
    console.log('Image input provided, but not directly supported by current API');
  }

  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiClient.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate images');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}