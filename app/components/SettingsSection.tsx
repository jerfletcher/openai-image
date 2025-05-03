import { useState } from 'react';

export default function SettingsSection() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const openModal = () => {
    setApiKey(localStorage.getItem('apiKey') || ''); // Fetch API key from localStorage
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
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

      <div id="settings-modal" className={`modal ${isModalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <h2>API Key</h2>
          <p>{apiKey || 'No API Key set'}</p>
          <button onClick={closeModal} className="mdc-button mdc-button--outlined">
            Close
          </button>
        </div>
      </div>
    </>
  );
}
