
import { useState, useEffect } from 'react';
import './SettingsSection.css';

export default function SettingsSection() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState('Not Set');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  useEffect(() => {
    // This will run on client-side only
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('openai_api_key') || '';
      setApiKey(storedApiKey);
      setIsApiKeyValid(!!storedApiKey);
      setApiKeyStatus(storedApiKey ? 'Valid' : 'Not Set');
    }
  }, []);

  const openModal = () => {
    // Refresh API key from localStorage before opening modal
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('openai_api_key') || '';
      setApiKey(storedApiKey);
      setIsApiKeyValid(!!storedApiKey);
      setApiKeyStatus(storedApiKey ? 'Valid' : 'Not Set');
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const newApiKey = document.getElementById('api-key-input').value.trim();
    
    if (newApiKey) {
      localStorage.setItem('openai_api_key', newApiKey);
      setApiKey(newApiKey);
      setIsApiKeyValid(true);
      setApiKeyStatus('Valid');
      // This would normally validate with the API, but we'll just assume it's valid for now
    } else {
      setIsApiKeyValid(false);
      setApiKeyStatus('Not Set');
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    document.getElementById('api-key-input').value = '';
    setApiKey('');
    setIsApiKeyValid(false);
    setApiKeyStatus('Not Set');
  };

  return (
    <>
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Settings</h2>
        </div>
        <div className="card-content">
          <div className="settings-actions">
            <button 
              type="button" 
              id="settings-button" 
              className="mdc-button mdc-button--outlined"
              onClick={openModal}
            >
              <span className="mdc-button__label">API Key & Settings</span>
            </button>
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

      {/* Modal for API Key and Settings */}
      <div id="settings-modal" className={`modal ${isModalOpen ? 'open' : ''}`}>
        <div className="modal-scrim" onClick={closeModal}></div>
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">API Key & Settings</h2>
            <button className="modal-close" onClick={closeModal}>X</button>
          </div>
          <div className="modal-content">
            {/* API Key Section */}
            <div className="modal-section">
              <h3>API Key</h3>
              <form id="api-key-form" className="api-key-form" onSubmit={handleApiKeySubmit}>
                <input
                  type="password"
                  id="api-key-input"
                  className="form-control api-key-input"
                  placeholder="Enter your OpenAI API key"
                  defaultValue={apiKey}
                />
                <button type="submit" className="mdc-button mdc-button--raised">
                  <span className="mdc-button__label">Save Key</span>
                </button>
                <button 
                  type="button" 
                  id="clear-api-key" 
                  className="mdc-button mdc-button--outlined"
                  onClick={handleClearApiKey}
                >
                  <span className="mdc-button__label">Clear Key</span>
                </button>
              </form>
              <div 
                id="api-key-status" 
                className={`api-key-status ${isApiKeyValid ? 'valid' : 'invalid'}`}
              >
                API Key: {apiKeyStatus}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={closeModal} className="mdc-button mdc-button--raised">
              <span className="mdc-button__label">Close</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
