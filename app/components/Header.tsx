export default function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <h1 className="app-title">OpenAI Image Generator</h1>
        <p className="app-description">Generate images using OpenAI's DALL-E and GPT-4o models</p>
        <button type="button" id="settings-button" className="mdc-button mdc-button--outlined">
          <span className="mdc-button__label">Settings</span>
        </button>
      </div>
    </header>
  );
}
