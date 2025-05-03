'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import ApiKeySection from './components/ApiKeySection';
import ParametersSection from './components/ParametersSection';
import PromptSection from './components/PromptSection';
import ImageUploadSection from './components/ImageUploadSection';
import SettingsSection from './components/SettingsSection';
import Footer from './components/Footer';

export default function Home() {
  useEffect(() => {
    // Import and initialize the main application
    import('./js/main.js').then(module => {
      module.initApp();
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <ApiKeySection />
        <ParametersSection />
        <PromptSection />
        <ImageUploadSection />
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

        <SettingsSection />
      </div>

      <Footer />
    </div>
  );
}
