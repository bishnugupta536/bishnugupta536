// script.js
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const downloadBtn = document.querySelector('.download-btn');
const colorPicker = document.getElementById('colorPicker');

// Remove.bg API Key (Replace with your own API key)
const API_KEY = 'ZnQ2xQqCEVowyzBQ875JzPrm';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Display the uploaded image temporarily
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      removeBackground(file); // Call the API to remove the background
    };
    reader.readAsDataURL(file);
  }
});

async function removeBackground(file) {
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Display the background-removed image
    previewImage.src = url;
    previewImage.style.display = 'block';
    downloadBtn.disabled = false;

    // Set up download button
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'background-removed-image.png';
      link.href = url;
      link.click();
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to remove background. Please try again.');
  }
}

// Optional: Add background color to the image
colorPicker.addEventListener('input', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;

  // Draw the image
  ctx.drawImage(previewImage, 0, 0);

  // Add background color
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = colorPicker.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update preview image
  previewImage.src = canvas.toDataURL();
});