# Update image generation to use base64 encoding and add GPT-image-1 model

This PR updates the OpenAI image generator app to:

1. Use base64 encoding for image responses instead of URLs
2. Add GPT-image-1 as the default model with detail level settings
3. Update the UI to show/hide model-specific controls
4. Handle both URL and base64 encoded image responses
5. Update README.md with development guidelines

## Changes

### API Client Updates
- Modified `apiClient.js` to request base64 encoded images by adding `response_format: "b64_json"` parameter
- Added support for the GPT-image-1 model with detail level parameter
- Updated image generation functions to handle both URL and base64 responses

### UI Updates
- Added detail level selector for GPT-image-1 with options: low, medium, high, max
- Updated model dropdown to prioritize GPT-image-1 and include all available models
- Added event listener for detail level changes
- Updated the UI to show/hide model-specific controls based on selected model

### Image Handling
- Modified `displayGeneratedImages` function to handle both URL and base64 encoded images
- Added `downloadBase64Image` function to handle downloading base64 encoded images

### Documentation
- Added development guidelines to README.md
- Updated model list in README.md to include GPT-image-1

These changes align with the most recent OpenAI API documentation for image generation.