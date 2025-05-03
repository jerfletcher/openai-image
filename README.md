# OpenAI Image Generator

A client-side web application using Next.js and vanilla JavaScript that allows users to generate images via the OpenAI API, with options for various parameters, image inputs for reference/style, local storage persistence, and settings export.

## Features

- **API Key Management**: Securely store your OpenAI API key in browser's localStorage
- **Model Selection**: Choose between DALL-E 2, DALL-E 3, and GPT-4o models
- **Parameter Controls**: Adjust size, quality, style, and number of images based on the selected model
- **Text Prompt Input**: Enter detailed descriptions for image generation
- **Reference Images**: Upload images to use as reference or style inspiration
- **Image Combination**: Automatically combines multiple reference images with labels
- **Local Storage**: Saves settings and history for future sessions
- **Settings Import/Export**: Export and import your settings as JSON files
- **Material Design UI**: Clean and intuitive user interface following Google Material Design principles

## Technology Stack

- **Framework**: Next.js
- **Core Logic & UI**: Vanilla JavaScript (DOM manipulation, Fetch API)
- **Styling**: Google Material Design principles
- **API Client**: OpenAI API
- **Local Storage**: Browser's localStorage API
- **Image Handling**: HTML5 File API, Canvas API, Base64 encoding

## Project Structure

- `/app`: Next.js application directory
  - `/js`: Vanilla JavaScript modules
    - `apiClient.js`: Handles API calls to OpenAI
    - `storage.js`: Manages localStorage operations
    - `imageProcessor.js`: Processes and combines images
    - `materialDesign.js`: Implements Material Design components
    - `main.js`: Core application logic
  - `page.tsx`: Main application page
  - `layout.tsx`: Application layout
  - `globals.css`: Global styles
  - `styles.css`: Application-specific styles

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Enter your OpenAI API key to start generating images

## Usage

1. Enter your OpenAI API key
2. Select the desired model and parameters
3. Enter a detailed text prompt
4. Optionally upload reference images
5. Click "Generate Images" to create images
6. Download generated images or adjust settings and try again

## Notes

- This is a client-side application, which means your API key is stored in your browser's localStorage and sent directly from your browser to OpenAI. Never share your API key with others.
- The application respects OpenAI's API limitations and parameters for each model.
- Image combination is implemented to work around the limitation that OpenAI's API doesn't directly support multiple distinct image inputs.
- GPT-4o model support allows for image generation using the chat completions API with image_url response format.
- When using GPT-4o, you can include reference images which will be sent as part of the message content.

## License

MIT
