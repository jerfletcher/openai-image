# OpenHands Project Prompts

This document provides guidance for future modifications and understanding of the OpenAI Image Generator application.

## Project Structure

The OpenAI Image Generator is organized as follows:

- `/app`: Next.js application directory
  - `/js`: Contains all vanilla JavaScript modules
    - `apiClient.js`: Handles API calls to OpenAI, including model information and image generation
    - `storage.js`: Manages localStorage operations for API key, settings, and history
    - `imageProcessor.js`: Processes and combines images using Canvas API
    - `materialDesign.js`: Implements Material Design components and UI utilities
    - `main.js`: Core application logic that ties everything together
  - `page.tsx`: Main React component that renders the UI
  - `layout.tsx`: Next.js layout component
  - `globals.css`: Global CSS styles
  - `styles.css`: Application-specific CSS styles

The project follows a modular structure where each JavaScript file has a specific responsibility. This separation of concerns makes the codebase easier to maintain and extend.

## Application Design

### Architecture Overview

The application follows a modular architecture where vanilla JavaScript is integrated within the Next.js framework:

1. **UI Layer**: The React component in `page.tsx` provides the static HTML structure
2. **JavaScript Modules**: Vanilla JS modules in the `/js` directory handle all dynamic functionality
3. **Integration**: The main React component uses `useEffect` to initialize the vanilla JS application

### Data Flow

1. **User Input**: User interacts with the UI (enters API key, selects parameters, uploads images)
2. **State Management**: The `main.js` module maintains application state and updates the UI accordingly
3. **API Interaction**: When the user clicks "Generate", the application:
   - Collects all parameters and the API key
   - Processes any uploaded images using `imageProcessor.js`
   - Makes an API call to OpenAI using `apiClient.js`
   - Displays the results and saves them to history

### Model-Specific Handling

The application supports multiple OpenAI models with different capabilities:

1. **DALL-E 2 & DALL-E 3**: Uses the standard `/images/generations` endpoint
   - DALL-E 2 supports generating multiple images at once
   - DALL-E 3 supports quality and style parameters

2. **GPT-4o**: Uses the `/chat/completions` endpoint with image_url response format
   - Supports including reference images directly in the message content
   - Formats the response to match the structure of DALL-E responses for consistent handling

### Local Storage Usage

The application uses localStorage for three main purposes:

1. **API Key Storage**: Securely stores the user's OpenAI API key
2. **Settings Persistence**: Saves user preferences (selected model, parameters, etc.)
3. **History Tracking**: Maintains a record of generated images and their parameters

The `storage.js` module provides a clean interface for these operations, handling serialization/deserialization and error handling.

## Testing Strategy

### Unit Testing

For unit testing the vanilla JavaScript modules:

1. **API Client Testing**:
   - Mock fetch requests to test API interactions
   - Verify proper parameter handling for different models
   - Test error handling for API failures

2. **Storage Module Testing**:
   - Mock localStorage to test save/load operations
   - Verify data persistence across page reloads
   - Test import/export functionality

3. **Image Processor Testing**:
   - Test image conversion to Base64
   - Verify image combination logic with different numbers of images
   - Test canvas operations for proper scaling and layout

### Integration Testing

For testing how components work together:

1. **End-to-End Flow**:
   - Test the complete flow from API key entry to image generation
   - Verify that UI updates correctly based on selected model
   - Test that generated images are displayed and can be downloaded

2. **Error Handling**:
   - Test application behavior with invalid API keys
   - Verify proper error messages for API failures
   - Test application resilience with network issues

### UI Testing

For testing the user interface:

1. **Responsive Design**:
   - Test the application on different screen sizes
   - Verify that UI elements adapt appropriately

2. **Accessibility**:
   - Test keyboard navigation
   - Verify proper ARIA attributes
   - Check color contrast for readability

## Modification Guidelines

When modifying the application, consider the following:

### Adding New Features

1. **New API Parameters**:
   - Update `apiClient.js` to include new parameters
   - Add corresponding UI controls in `page.tsx`
   - Update the state management in `main.js`

2. **Supporting New Models**:
   - Add new model information to `getAvailableModels()` in `apiClient.js`
   - Update UI logic to show/hide relevant controls based on model
   - For models that use different API endpoints (like GPT-4o), implement separate handler functions

3. **Enhanced Image Processing**:
   - Extend `imageProcessor.js` with new image manipulation functions
   - Update the image combination logic as needed

### Performance Improvements

1. **Image Handling**:
   - Consider implementing image compression before upload
   - Optimize canvas operations for large images

2. **API Calls**:
   - Implement request debouncing for rapid user interactions
   - Add caching for frequently used settings

3. **UI Responsiveness**:
   - Use web workers for heavy computations
   - Implement progressive loading for large image sets

### Security Considerations

1. **API Key Handling**:
   - Never transmit the API key to any server other than OpenAI
   - Consider adding encryption for localStorage data

2. **Content Validation**:
   - Implement client-side validation for prompts
   - Add content filtering options

By following these guidelines, you can maintain and extend the application while preserving its architecture and design principles.