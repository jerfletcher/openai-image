export default function PromptSection() {
  return (
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
  );
}
