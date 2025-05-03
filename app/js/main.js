/**
 * Main Application Module
 * Handles the core functionality of the OpenAI Image Generator
 */

import { initializeClient, getAvailableModels, generateImages } from './apiClient.js';
import { 
  saveApiKey, getApiKey, clearApiKey, 
  saveSettings, getSettings, saveToHistory, 
  exportData, importData 
} from './storage.js';
import { fileToBase64, combineImages } from './imageProcessor.js';
import { initMaterialComponents, showSnackbar, createDialog } from './materialDesign.js';

// Application state
let appState = {
  apiKey: null,
  selectedModel: 'dall-e-3',
  selectedSize: '1024x1024',
  selectedQuality: 'standard',
  selectedStyle: 'vivid',
  imageCount: 1,
  uploadedImages: [],
  uploadedImageLabels: [],
  generatedImages: [],
  isGenerating: false
};

/**
 * Initialize the application
 * This function should be called after the DOM is loaded
 */
export function initApp() {
  // Initialize Material Design components
  initMaterialComponents();
  
  // Load API key from storage
  const storedApiKey = getApiKey();
  if (storedApiKey) {
    appState.apiKey = storedApiKey;
    document.getElementById('api-key-input').value = storedApiKey;
    try {
      initializeClient(storedApiKey);
      showApiKeyStatus(true);
    } catch (error) {
      console.error('Failed to initialize client with stored API key:', error);
      showApiKeyStatus(false);
    }
  }
  
  // Load settings from storage
  const storedSettings = getSettings();
  if (storedSettings) {
    appState = { ...appState, ...storedSettings };
    
    // Update UI with stored settings
    if (storedSettings.selectedModel) {
      document.getElementById('model-select').value = storedSettings.selectedModel;
      updateModelDependentControls(storedSettings.selectedModel);
    }
    
    if (storedSettings.selectedSize) {
      document.getElementById('size-select').value = storedSettings.selectedSize;
    }
    
    if (storedSettings.selectedQuality) {
      document.getElementById('quality-select').value = storedSettings.selectedQuality;
    }
    
    if (storedSettings.selectedStyle) {
      document.getElementById('style-select').value = storedSettings.selectedStyle;
    }
    
    if (storedSettings.imageCount) {
      document.getElementById('image-count').value = storedSettings.imageCount;
    }
    
    if (storedSettings.prompt) {
      document.getElementById('prompt-textarea').value = storedSettings.prompt;
    }
  }
  
  // Initialize event listeners
  initEventListeners();
  
  // Initialize models dropdown
  populateModelDropdown();
}

/**
 * Initialize event listeners for UI elements
 */
function initEventListeners() {
  // API Key form
  document.getElementById('api-key-form').addEventListener('submit', handleApiKeySubmit);
  document.getElementById('clear-api-key').addEventListener('click', handleClearApiKey);
  
  // Model selection
  document.getElementById('model-select').addEventListener('change', handleModelChange);
  
  // Size selection
  document.getElementById('size-select').addEventListener('change', handleSizeChange);
  
  // Quality selection (DALL-E 3 only)
  document.getElementById('quality-select').addEventListener('change', handleQualityChange);
  
  // Style selection (DALL-E 3 only)
  document.getElementById('style-select').addEventListener('change', handleStyleChange);
  
  // Image count (DALL-E 2 only)
  document.getElementById('image-count').addEventListener('change', handleImageCountChange);
  
  // Prompt textarea
  document.getElementById('prompt-textarea').addEventListener('input', handlePromptChange);
  
  // Image upload
  document.getElementById('image-upload').addEventListener('change', handleImageUpload);
  document.getElementById('clear-images').addEventListener('click', handleClearImages);
  
  // Generate button
  document.getElementById('generate-button').addEventListener('click', handleGenerateClick);
  
  // Export/Import settings
  document.getElementById('export-settings').addEventListener('click', handleExportSettings);
  document.getElementById('import-settings').addEventListener('click', handleImportSettings);
  document.getElementById('settings-file-input').addEventListener('change', handleSettingsFileSelect);
}

/**
 * Populate the model dropdown with available models
 */
function populateModelDropdown() {
  const modelSelect = document.getElementById('model-select');
  const models = getAvailableModels();
  
  // Clear existing options
  modelSelect.innerHTML = '';
  
  // Add options for each model
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.name;
    modelSelect.appendChild(option);
  });
  
  // Set default model
  modelSelect.value = appState.selectedModel;
  
  // Update dependent controls
  updateModelDependentControls(appState.selectedModel);
}

/**
 * Update controls that depend on the selected model
 * @param {string} modelId - The selected model ID
 */
function updateModelDependentControls(modelId) {
  const sizeSelect = document.getElementById('size-select');
  const qualitySelect = document.getElementById('quality-select');
  const styleSelect = document.getElementById('style-select');
  const imageCountContainer = document.getElementById('image-count-container');
  
  // Clear existing options
  sizeSelect.innerHTML = '';
  
  // Get model details
  const models = getAvailableModels();
  const selectedModel = models.find(model => model.id === modelId);
  
  if (selectedModel) {
    // Populate size options
    selectedModel.sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
    
    // Set default size
    sizeSelect.value = appState.selectedSize;
    
    // Show/hide DALL-E 3 specific controls
    if (modelId === 'dall-e-3') {
      document.getElementById('quality-container').style.display = 'block';
      document.getElementById('style-container').style.display = 'block';
      imageCountContainer.style.display = 'none';
    } else {
      document.getElementById('quality-container').style.display = 'none';
      document.getElementById('style-container').style.display = 'none';
      imageCountContainer.style.display = 'block';
    }
  }
}

/**
 * Handle API key form submission
 * @param {Event} event - The form submit event
 */
function handleApiKeySubmit(event) {
  event.preventDefault();
  
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKey = apiKeyInput.value.trim();
  
  if (apiKey) {
    try {
      initializeClient(apiKey);
      saveApiKey(apiKey);
      appState.apiKey = apiKey;
      showApiKeyStatus(true);
      showSnackbar('API key saved successfully');
    } catch (error) {
      console.error('Failed to initialize client:', error);
      showApiKeyStatus(false);
      showSnackbar('Failed to initialize client with provided API key');
    }
  } else {
    showSnackbar('Please enter a valid API key');
  }
}

/**
 * Handle clearing the API key
 */
function handleClearApiKey() {
  clearApiKey();
  document.getElementById('api-key-input').value = '';
  appState.apiKey = null;
  showApiKeyStatus(false);
  showSnackbar('API key cleared');
}

/**
 * Show API key status
 * @param {boolean} isValid - Whether the API key is valid
 */
function showApiKeyStatus(isValid) {
  const statusElement = document.getElementById('api-key-status');
  
  if (isValid) {
    statusElement.textContent = 'API Key: Valid';
    statusElement.className = 'api-key-status valid';
  } else {
    statusElement.textContent = 'API Key: Not Set';
    statusElement.className = 'api-key-status invalid';
  }
}

/**
 * Handle model change
 * @param {Event} event - The change event
 */
function handleModelChange(event) {
  const modelId = event.target.value;
  appState.selectedModel = modelId;
  
  // Update dependent controls
  updateModelDependentControls(modelId);
  
  // Save settings
  saveSettings({
    ...appState,
    selectedModel: modelId
  });
}

/**
 * Handle size change
 * @param {Event} event - The change event
 */
function handleSizeChange(event) {
  const size = event.target.value;
  appState.selectedSize = size;
  
  // Save settings
  saveSettings({
    ...appState,
    selectedSize: size
  });
}

/**
 * Handle quality change
 * @param {Event} event - The change event
 */
function handleQualityChange(event) {
  const quality = event.target.value;
  appState.selectedQuality = quality;
  
  // Save settings
  saveSettings({
    ...appState,
    selectedQuality: quality
  });
}

/**
 * Handle style change
 * @param {Event} event - The change event
 */
function handleStyleChange(event) {
  const style = event.target.value;
  appState.selectedStyle = style;
  
  // Save settings
  saveSettings({
    ...appState,
    selectedStyle: style
  });
}

/**
 * Handle image count change
 * @param {Event} event - The change event
 */
function handleImageCountChange(event) {
  const count = parseInt(event.target.value, 10);
  appState.imageCount = count;
  
  // Save settings
  saveSettings({
    ...appState,
    imageCount: count
  });
}

/**
 * Handle prompt change
 * @param {Event} event - The input event
 */
function handlePromptChange(event) {
  const prompt = event.target.value;
  
  // Save settings
  saveSettings({
    ...appState,
    prompt
  });
}

/**
 * Handle image upload
 * @param {Event} event - The change event
 */
async function handleImageUpload(event) {
  const files = event.target.files;
  
  if (files && files.length > 0) {
    try {
      // Convert files to base64
      const imagePromises = Array.from(files).map(file => fileToBase64(file));
      const imageDataUrls = await Promise.all(imagePromises);
      
      // Store uploaded images
      appState.uploadedImages = imageDataUrls;
      
      // Create default labels
      appState.uploadedImageLabels = Array.from(files).map((file, index) => `Image ${index + 1}`);
      
      // Display uploaded images
      displayUploadedImages(imageDataUrls);
      
      // Save settings
      saveSettings({
        ...appState,
        uploadedImages: imageDataUrls,
        uploadedImageLabels: appState.uploadedImageLabels
      });
      
      showSnackbar(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to process uploaded images:', error);
      showSnackbar('Failed to process uploaded images');
    }
  }
}

/**
 * Display uploaded images
 * @param {Array<string>} imageDataUrls - Array of image data URLs
 */
function displayUploadedImages(imageDataUrls) {
  const previewContainer = document.getElementById('image-preview-container');
  
  // Clear existing previews
  previewContainer.innerHTML = '';
  
  // Create preview for each image
  imageDataUrls.forEach((dataUrl, index) => {
    const previewWrapper = document.createElement('div');
    previewWrapper.className = 'image-preview-wrapper';
    
    // Create image element
    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'image-preview';
    img.alt = `Uploaded image ${index + 1}`;
    
    // Create label input
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'image-label-input';
    labelInput.value = appState.uploadedImageLabels[index] || `Image ${index + 1}`;
    labelInput.dataset.index = index;
    
    // Update label when input changes
    labelInput.addEventListener('input', (event) => {
      const index = parseInt(event.target.dataset.index, 10);
      appState.uploadedImageLabels[index] = event.target.value;
      
      // Save settings
      saveSettings({
        ...appState,
        uploadedImageLabels: appState.uploadedImageLabels
      });
    });
    
    // Add elements to wrapper
    previewWrapper.appendChild(img);
    previewWrapper.appendChild(labelInput);
    
    // Add wrapper to container
    previewContainer.appendChild(previewWrapper);
  });
  
  // Show clear button if images are uploaded
  document.getElementById('clear-images').style.display = imageDataUrls.length > 0 ? 'block' : 'none';
}

/**
 * Handle clearing uploaded images
 */
function handleClearImages() {
  appState.uploadedImages = [];
  appState.uploadedImageLabels = [];
  
  // Clear image preview
  document.getElementById('image-preview-container').innerHTML = '';
  
  // Hide clear button
  document.getElementById('clear-images').style.display = 'none';
  
  // Reset file input
  document.getElementById('image-upload').value = '';
  
  // Save settings
  saveSettings({
    ...appState,
    uploadedImages: [],
    uploadedImageLabels: []
  });
  
  showSnackbar('Uploaded images cleared');
}

/**
 * Handle generate button click
 */
async function handleGenerateClick() {
  if (!appState.apiKey) {
    showSnackbar('Please set your OpenAI API key first');
    return;
  }
  
  const promptTextarea = document.getElementById('prompt-textarea');
  const prompt = promptTextarea.value.trim();
  
  if (!prompt) {
    showSnackbar('Please enter a prompt');
    return;
  }
  
  // Disable generate button
  const generateButton = document.getElementById('generate-button');
  generateButton.disabled = true;
  appState.isGenerating = true;
  
  // Show loading indicator
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = 'block';
  
  try {
    // Process uploaded images if any
    let combinedImageBase64 = null;
    
    if (appState.uploadedImages.length > 0) {
      try {
        // Combine images with labels
        combinedImageBase64 = await combineImages(
          appState.uploadedImages,
          appState.uploadedImageLabels
        );
      } catch (error) {
        console.error('Failed to combine images:', error);
        showSnackbar('Failed to process uploaded images');
      }
    }
    
    // Prepare parameters for API call
    const params = {
      prompt,
      model: appState.selectedModel,
      size: appState.selectedSize,
      n: appState.imageCount,
      quality: appState.selectedQuality,
      style: appState.selectedStyle,
      imageBase64: combinedImageBase64
    };
    
    // Generate images
    const result = await generateImages(params);
    
    // Store generated images
    appState.generatedImages = result.data;
    
    // Display generated images
    displayGeneratedImages(result.data);
    
    // Save to history
    saveToHistory({
      timestamp: new Date().toISOString(),
      prompt,
      model: appState.selectedModel,
      size: appState.selectedSize,
      images: result.data,
      combinedImage: combinedImageBase64
    });
    
    showSnackbar('Images generated successfully');
  } catch (error) {
    console.error('Failed to generate images:', error);
    showSnackbar(`Failed to generate images: ${error.message}`);
  } finally {
    // Enable generate button
    generateButton.disabled = false;
    appState.isGenerating = false;
    
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Display generated images
 * @param {Array<Object>} images - Array of generated image objects
 */
function displayGeneratedImages(images) {
  const resultsContainer = document.getElementById('results-container');
  
  // Clear existing results
  resultsContainer.innerHTML = '';
  
  // Create result for each image
  images.forEach((image, index) => {
    const resultWrapper = document.createElement('div');
    resultWrapper.className = 'result-wrapper';
    
    // Create image element
    const img = document.createElement('img');
    img.src = image.url;
    img.className = 'result-image';
    img.alt = `Generated image ${index + 1}`;
    
    // Create download button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'mdc-button mdc-button--raised';
    downloadButton.innerHTML = '<span class="mdc-button__label">Download</span>';
    downloadButton.addEventListener('click', () => {
      downloadImage(image.url, `generated-image-${index + 1}.png`);
    });
    
    // Add elements to wrapper
    resultWrapper.appendChild(img);
    resultWrapper.appendChild(downloadButton);
    
    // Add wrapper to container
    resultsContainer.appendChild(resultWrapper);
  });
  
  // Show results section
  document.getElementById('results-section').style.display = 'block';
}

/**
 * Download an image
 * @param {string} url - The image URL
 * @param {string} filename - The filename to save as
 */
function downloadImage(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Handle export settings
 */
function handleExportSettings() {
  const data = exportData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileName = `openai-image-generator-settings-${new Date().toISOString().slice(0, 10)}.json`;
  
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = exportFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSnackbar('Settings exported successfully');
}

/**
 * Handle import settings button click
 */
function handleImportSettings() {
  document.getElementById('settings-file-input').click();
}

/**
 * Handle settings file selection
 * @param {Event} event - The change event
 */
function handleSettingsFileSelect(event) {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        importData(data);
        
        // Update UI with imported settings
        if (data.settings) {
          appState = { ...appState, ...data.settings };
          
          // Update model selection
          if (data.settings.selectedModel) {
            document.getElementById('model-select').value = data.settings.selectedModel;
            updateModelDependentControls(data.settings.selectedModel);
          }
          
          // Update size selection
          if (data.settings.selectedSize) {
            document.getElementById('size-select').value = data.settings.selectedSize;
          }
          
          // Update quality selection
          if (data.settings.selectedQuality) {
            document.getElementById('quality-select').value = data.settings.selectedQuality;
          }
          
          // Update style selection
          if (data.settings.selectedStyle) {
            document.getElementById('style-select').value = data.settings.selectedStyle;
          }
          
          // Update image count
          if (data.settings.imageCount) {
            document.getElementById('image-count').value = data.settings.imageCount;
          }
          
          // Update prompt
          if (data.settings.prompt) {
            document.getElementById('prompt-textarea').value = data.settings.prompt;
          }
          
          // Update uploaded images
          if (data.settings.uploadedImages && data.settings.uploadedImages.length > 0) {
            appState.uploadedImages = data.settings.uploadedImages;
            appState.uploadedImageLabels = data.settings.uploadedImageLabels || 
              data.settings.uploadedImages.map((_, index) => `Image ${index + 1}`);
            
            displayUploadedImages(data.settings.uploadedImages);
          }
        }
        
        showSnackbar('Settings imported successfully');
      } catch (error) {
        console.error('Failed to import settings:', error);
        showSnackbar('Failed to import settings: Invalid file format');
      }
    };
    
    reader.readAsText(file);
  }
}