export default function ParametersSection() {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Generation Parameters</h2>
      </div>
      <div className="card-content">
        <div className="parameters-grid">
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
          <div className="form-group">
            <label htmlFor="size-select" className="form-label">Size</label>
            <select id="size-select" className="form-select">
              <option value="1024x1024">1024x1024</option>
              <option value="1792x1024">1792x1024</option>
              <option value="1024x1792">1024x1792</option>
            </select>
          </div>
          <div className="form-group" id="quality-container">
            <label htmlFor="quality-select" className="form-label">Quality</label>
            <select id="quality-select" className="form-select">
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
          </div>
          <div className="form-group" id="style-container">
            <label htmlFor="style-select" className="form-label">Style</label>
            <select id="style-select" className="form-select">
              <option value="vivid">Vivid</option>
              <option value="natural">Natural</option>
            </select>
          </div>
          <div className="form-group" id="image-count-container" style={{ display: 'none' }}>
            <label htmlFor="image-count" className="form-label">Number of Images</label>
            <select id="image-count" className="form-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
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
  );
}
