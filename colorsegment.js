// HSV range for different colors.
const colorRanges = {
  red: {
    lower: tf.tensor1d([0, 50, 50]), // Lower bound in HSV for red.
    upper: tf.tensor1d([360, 255, 255]), // Upper bound in HSV for red.
  },
  green: {
    lower: tf.tensor1d([75, 50, 50]), // Lower bound in HSV for green.
    upper: tf.tensor1d([360, 255, 255]), // Upper bound in HSV for green.
  },
  blue: {
    lower: tf.tensor1d([150, 50, 50]), // Lower bound in HSV for blue.
    upper: tf.tensor1d([360, 255, 255]), // Upper bound in HSV for blue.
  },
  yellow: {
    lower: tf.tensor1d([40, 50, 50]), // Lower bound in HSV for yellow.
    upper: tf.tensor1d([80, 255, 255]), // Upper bound in HSV for yellow.
  },
  orange: {
    lower: tf.tensor1d([20, 50, 50]), // Lower bound in HSV for orange.
    upper: tf.tensor1d([140, 255, 255]), // Upper bound in HSV for orange.
  },
};



let currentColor = 'blue'; // Default color.

async function setupWebcam() {
  const videoElement = document.getElementById('webcam');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
  await new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve();
    };
  });
  return videoElement;
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, v * 100];
}

function isColorPixel(hsv, color) {
  const lower = colorRanges[color].lower.arraySync();
  const upper = colorRanges[color].upper.arraySync();
  
  const h = hsv[0];
  const s = hsv[1];
  const v = hsv[2];
  
  return (h >= lower[0] && h <= upper[0]) &&
         (s >= lower[1] && s <= upper[1]) &&
         (v >= lower[2] && v <= upper[2]);
}

async function main() {
  const videoElement = await setupWebcam();
  const canvasElement = document.getElementById('output');
  const canvasContext = canvasElement.getContext('2d');

  canvasElement.width = videoElement.width;
  canvasElement.height = videoElement.height;

  document.getElementById('redButton').addEventListener('click', () => {
      currentColor = 'red';
    });

  document.getElementById('greenButton').addEventListener('click', () => {
      currentColor = 'green';
    });

  document.getElementById('blueButton').addEventListener('click', () => {
      currentColor = 'blue';
    });

  document.getElementById('yellowButton').addEventListener('click', () => {
      currentColor = 'yellow';
    });

  document.getElementById('orangeButton').addEventListener('click', () => {
      currentColor = 'orange';
    });


  function processFrame() {
    canvasContext.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    const imgData = canvasContext.getImageData(0, 0, videoElement.width, videoElement.height);

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];

      const hsv = rgbToHsv(r, g, b);

      if (isColorPixel(hsv, currentColor)) {
              // Highlight the chosen color channel, keep other channels as they are
              if (currentColor === 'red') {
                imgData.data[i] = 255; // Set red channel to 255 (red)
              } 
              else if (currentColor === 'green') {
                imgData.data[i + 1] = 255; // Set green channel to 255 (green)
              } 
              else if (currentColor === 'blue') {
                imgData.data[i + 2] = 255; // Set blue channel to 255 (blue)
                imgData.data[i] = 0;
                imgData.data[i + 1] = 0;
              }
              else if (currentColor === 'yellow') {
                imgData.data[i] = 255; // Set red channel to 255 (yellow)
                imgData.data[i + 1] = 255; // Set green channel to 255 (yellow)
              }
              else if (currentColor === 'orange') {
                imgData.data[i] = 255; // Set red channel to 255 (yellow)
                imgData.data[i + 2] = 0; // Set blue channel to 0 (yellow)
              }
        } 
          else {
              // Set all channels to 0 (black) for non-chosen color pixels
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            }
      }

    canvasContext.putImageData(imgData, 0, 0);
    requestAnimationFrame(processFrame);

  }

  processFrame();
}

main();
