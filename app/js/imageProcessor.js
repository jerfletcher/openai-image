/**
 * Image Processor Module
 * Handles image processing operations for the application
 */

/**
 * Convert a File object to a Base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise resolving to Base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Combine multiple images into a single canvas
 * @param {Array<string>} imageDataUrls - Array of image data URLs
 * @param {Array<string>} labels - Optional array of labels for each image
 * @returns {Promise<string>} - Promise resolving to combined image as data URL
 */
export async function combineImages(imageDataUrls, labels = []) {
  return new Promise((resolve, reject) => {
    if (!imageDataUrls || imageDataUrls.length === 0) {
      reject(new Error('No images provided'));
      return;
    }

    // Load all images first
    const imagePromises = imageDataUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });
    });

    Promise.all(imagePromises)
      .then(images => {
        // Calculate canvas dimensions
        const maxImagesPerRow = Math.min(images.length, 2);
        const rows = Math.ceil(images.length / maxImagesPerRow);
        
        // Set maximum dimensions for each image
        const maxImageWidth = 512;
        const maxImageHeight = 512;
        
        // Calculate scaled dimensions for each image
        const scaledImages = images.map(img => {
          const scale = Math.min(
            maxImageWidth / img.width,
            maxImageHeight / img.height,
            1
          );
          
          return {
            img,
            width: img.width * scale,
            height: img.height * scale
          };
        });
        
        // Calculate canvas dimensions
        const canvasWidth = maxImagesPerRow * maxImageWidth;
        const canvasHeight = (rows * maxImageHeight) + (labels.length > 0 ? rows * 30 : 0); // Add space for labels
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw images and labels
        scaledImages.forEach((img, index) => {
          const row = Math.floor(index / maxImagesPerRow);
          const col = index % maxImagesPerRow;
          
          // Calculate position to center the image in its cell
          const x = col * maxImageWidth + (maxImageWidth - img.width) / 2;
          const y = row * (maxImageHeight + (labels.length > 0 ? 30 : 0)) + (maxImageHeight - img.height) / 2;
          
          // Draw image
          ctx.drawImage(img.img, x, y, img.width, img.height);
          
          // Draw label if provided
          if (labels && labels[index]) {
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
              labels[index],
              col * maxImageWidth + maxImageWidth / 2,
              row * (maxImageHeight + 30) + maxImageHeight + 20
            );
          }
        });
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * Resize an image to fit within maximum dimensions
 * @param {string} dataUrl - The image data URL
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<string>} - Promise resolving to resized image data URL
 */
export function resizeImage(dataUrl, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = dataUrl;
  });
}