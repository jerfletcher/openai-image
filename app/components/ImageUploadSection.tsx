export default function ImageUploadSection() {
  return (
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
  );
}
