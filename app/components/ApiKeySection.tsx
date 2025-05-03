export default function ApiKeySection() {
  return (
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
  );
}
