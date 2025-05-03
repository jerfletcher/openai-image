'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Import and initialize the main application
    import('./js/main.js').then(module => {
      module.initApp();
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">OpenAI Image Generator</h1>
          <p className="app-description">Generate images using OpenAI's DALL-E and GPT-4o models</p>
        </div>
      </header>

      <div className="container">
        {/* API Key Section */}
        <section className="card api-key-section">
          <div className="card-header">
            <h2 className="card-title">API Key</h2>
          </div>
          <div className="card-content">
            <form id="api-key-form" className="api-key-form">
              <input
                type="password"
                id="api-key-input"
                className="form-control api-key-input"
                placeholder="Enter your OpenAI API key"
              />
              <button type="submit" className="mdc-button mdc-button--raised">
                <span className="mdc-button__label">Save Key</span>
              </button>
              <button type="button" id="clear-api-key" className="mdc-button mdc-button--outlined">
                <span className="mdc-button__label">Clear Key</span>
              </button>
            </form>
            <div id="api-key-status" className="api-key-status invalid">API Key: Not Set</div>
          </div>
        </section>

        {/* Parameters Section */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Generation Parameters</h2>
          </div>
          <div className="card-content">
            <div className="parameters-grid">
              {/* Model Selection */}
              <div className="form-group">
                <label htmlFor="model-select" className="form-label">Model</label>
                <select id="model-select" className="form-select">
                  <option value="gpt-image-1">GPT-image-1</option>
                  <option value="dall-e-3">DALL-E 3</option>
                  <option value="dall-e-2">DALL-E 2</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-vision">GPT-4 Vision</option>
                </select>
              </div>

              {/* Size Selection */}
              <div className="form-group">
                <label htmlFor="size-select" className="form-label">Size</label>
                <select id="size-select" className="form-select">
                  <option value="1024x1024">1024x1024</option>
                  <option value="1792x1024">1792x1024</option>
                  <option value="1024x1792">1024x1792</option>
                </select>
              </div>

              {/* Quality Selection (DALL-E 3 only) */}
              <div className="form-group" id="quality-container">
                <label htmlFor="quality-select" className="form-label">Quality</label>
                <select id="quality-select" className="form-select">
                  <option value="standard">Standard</option>
                  <option value="hd">HD</option>
                </select>
              </div>

              {/* Style Selection (DALL-E 3 only) */}
              <div className="form-group" id="style-container">
                <label htmlFor="style-select" className="form-label">Style</label>
                <select id="style-select" className="form-select">
                  <option value="vivid">Vivid</option>
                  <option value="natural">Natural</option>
                </select>
              </div>

              {/* Image Count (DALL-E 2 and GPT-image-1) */}
              <div className="form-group" id="image-count-container" style={{ display: 'none' }}>
                <label htmlFor="image-count" className="form-label">Number of Images</label>
                <select id="image-count" className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              
              {/* Detail Level (GPT-image-1 only) */}
              <div className="form-group" id="detail-container" style={{ display: 'none' }}>
                <label htmlFor="detail-select" className="form-label">Detail Level</label>
                <select id="detail-select" className="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="max">Maximum</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Prompt Section */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Text Prompt</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <textarea
                id="prompt-textarea"
                className="form-control form-textarea"
                placeholder="Enter a detailed description of the image you want to generate..."
              ></textarea>
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Reference Images</h2>
          </div>
          <div className="card-content">
            <p>Upload images to use as reference or style inspiration.</p>
            <div className="form-group">
              <input
                type="file"
                id="image-upload"
                className="form-control"
                accept="image/*"
                multiple
              />
            </div>
            <div className="image-upload-container">
              <div id="image-preview-container" className="image-preview-container"></div>
              <button
                type="button"
                id="clear-images"
                className="mdc-button mdc-button--outlined"
                style={{ display: 'none' }}
              >
                <span className="mdc-button__label">Clear Images</span>
              </button>
            </div>
          </div>
        </section>

        {/* Generate Button */}
        <div className="card-actions">
          <button type="button" id="generate-button" className="mdc-button mdc-button--raised">
            <span className="mdc-button__label">Generate Images</span>
          </button>
        </div>

        {/* Loading Indicator */}
        <div id="loading-indicator" className="loading-indicator">
          <div className="spinner"></div>
          <p>Generating images...</p>
        </div>

        {/* Results Section */}
        <section id="results-section" className="card" style={{ display: 'none' }}>
          <div className="card-header">
            <h2 className="card-title">Generated Images</h2>
          </div>
          <div className="card-content">
            <div id="results-container" className="results-container"></div>
          </div>
        </section>

        {/* Settings Section */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Settings</h2>
          </div>
          <div className="card-content">
            <div className="settings-actions">
              <button type="button" id="export-settings" className="mdc-button mdc-button--outlined">
                <span className="mdc-button__label">Export Settings</span>
              </button>
              <button type="button" id="import-settings" className="mdc-button mdc-button--outlined">
                <span className="mdc-button__label">Import Settings</span>
              </button>
              <input
                type="file"
                id="settings-file-input"
                className="settings-file-input"
                accept=".json"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="app-header" style={{ marginTop: '40px' }}>
        <div className="container">
          <p>Built with Next.js and vanilla JavaScript</p>
        </div>
      </footer>
    </div>
  );
}
