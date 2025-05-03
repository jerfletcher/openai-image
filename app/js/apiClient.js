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
    { id: 'gpt-4o', name: 'GPT-4o', sizes: ['1024x1024', '1792x1024', '1024x1792'] },
    { id: 'gpt-4-vision', name: 'GPT-4 Vision', sizes: ['1024x1024', '1792x1024', '1024x1792'] },
    { id: 'gpt-image-1', name: 'GPT-image-1', sizes: ['1024x1024', '1792x1024', '1024x1792'] },
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
  
  // Check if we're using GPT-4o or GPT-4-vision for image generation
  if (model === 'gpt-4o' || model === 'gpt-4-vision') {
    return await generateImagesWithGPTVision(params);
  }
  
  // Check if we're using GPT-image-1 for image generation
  if (model === 'gpt-image-1') {
    return await generateImagesWithGPTImage(params);
  }
  
  // Prepare request body based on model (DALL-E models)
  const requestBody = {
    prompt,
    model: model || 'dall-e-3',
    n: model === 'dall-e-2' ? (n || 1) : 1, // DALL-E 3 only supports n=1
    size: size || '1024x1024',
    response_format: "b64_json" // Request base64 encoded images
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

/**
 * Generate images using GPT-4o or GPT-4-vision models
 * @param {Object} params - Parameters for image generation
 * @returns {Promise} - Promise resolving to generated images
 */
async function generateImagesWithGPTVision(params) {
  const { prompt, model, size, imageBase64 } = params;
  
  // Prepare the messages array
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt }
      ]
    }
  ];
  
  // If image is provided and it's a valid base64 string, add it to the message
  if (imageBase64 && typeof imageBase64 === 'string') {
    // Extract the MIME type and base64 data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      
      // Add the image to the first message's content
      messages[0].content.push({
        type: "image_url",
        image_url: {
          url: imageBase64
        }
      });
    }
  }
  
  // Prepare the request body
  const requestBody = {
    model: model === 'gpt-4-vision' ? "gpt-4-vision-preview" : "gpt-4o",
    messages: messages,
    max_tokens: 1000,
    response_format: { type: "image_url" }
  };
  
  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiClient.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to generate images with ${model}`);
    }

    const data = await response.json();
    
    // Transform the response to match the format of the DALL-E API
    // Extract image URL from the response
    const content = data.choices[0]?.message?.content;
    
    // Parse the content to extract the image URL
    // The content might be in different formats, so we need to handle various cases
    let imageUrl = '';
    
    try {
      // Try to parse as JSON first
      const jsonContent = JSON.parse(content);
      if (jsonContent && jsonContent.url) {
        imageUrl = jsonContent.url;
      }
    } catch (e) {
      // If not JSON, check if it's a direct URL
      if (content && (content.startsWith('http://') || content.startsWith('https://'))) {
        imageUrl = content;
      } else if (content && content.includes('http')) {
        // Try to extract URL from text
        const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }
    }
    
    // If we couldn't extract a URL, use the content as is
    if (!imageUrl) {
      imageUrl = content;
    }
    
    return {
      created: data.created,
      data: [
        {
          url: imageUrl,
          revised_prompt: prompt
        }
      ]
    };
  } catch (error) {
    console.error(`Error generating images with ${model}:`, error);
    throw error;
  }
}

/**
 * Generate images using GPT-image-1 model
 * @param {Object} params - Parameters for image generation
 * @returns {Promise} - Promise resolving to generated images
 */
async function generateImagesWithGPTImage(params) {
  const { prompt, size, n, imageBase64 } = params;
  
  // Prepare request body for GPT-image-1
  const requestBody = {
    model: "gpt-image-1",
    prompt,
    size: size || '1024x1024',
    n: n || 1,
    response_format: "b64_json" // Request base64 encoded images
  };
  
  // If image is provided and it's a valid base64 string
  if (imageBase64 && typeof imageBase64 === 'string') {
    // Extract the MIME type and base64 data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (matches && matches.length === 3) {
      // Add the reference image to the request
      requestBody.reference_image = imageBase64;
    }
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
      throw new Error(errorData.error?.message || 'Failed to generate images with GPT-image-1');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating images with GPT-image-1:', error);
    throw error;
  }
}