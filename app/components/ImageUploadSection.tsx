import React, { useState } from 'react';

export default function ImageUploadSection() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const fileArray = Array.from(files);
      setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
      console.log('Uploaded images:', fileArray);
      // Proceed with further actions, e.g., displaying or processing the images
    }
  };

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
            onChange={handleFileUpload}
          />
        </div>
        <div className="image-upload-container">
          <div id="image-preview-container" className="image-preview-container">
            {uploadedImages.map((image, index) => (
              <p key={index}>{image.name}</p>
            ))}
          </div>
          <button
            type="button"
            id="clear-images"
            className="mdc-button mdc-button--outlined"
            onClick={() => setUploadedImages([])}
          >
            <span className="mdc-button__label">Clear Images</span>
          </button>
        </div>
      </div>
    </section>
  );
}
