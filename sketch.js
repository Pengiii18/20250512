let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const leftEyePoints = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
const rightEyePoints = [359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawFaceMesh();
}

function drawFaceMesh() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    if (keypoints && keypoints.length > 0) {
      stroke(0, 0, 255); // 藍色線條
      strokeWeight(15); // 線條粗細為15
      noFill();

      // 繪製主要輪廓
      for (let i = 0; i < points.length - 1; i++) {
        const idx1 = points[i];
        const idx2 = points[i + 1];
        if (keypoints[idx1] && keypoints[idx2]) {
          const [x1, y1] = keypoints[idx1];
          const [x2, y2] = keypoints[idx2];
          if (isFinite(x1) && isFinite(y1) && isFinite(x2) && isFinite(y2)) {
            line(x1, y1, x2, y2);
          }
        }
      }

      // 將最後一點與第一點連接，形成閉合路徑
      const idxStart = points[0];
      const idxEnd = points[points.length - 1];
      if (keypoints[idxStart] && keypoints[idxEnd]) {
        const [xStart, yStart] = keypoints[idxStart];
        const [xEnd, yEnd] = keypoints[idxEnd];
        if (isFinite(xStart) && isFinite(yStart) && isFinite(xEnd) && isFinite(yEnd)) {
          line(xEnd, yEnd, xStart, yStart);
        }
      }

      // 繪製左眼輪廓
      drawEyeOutline(keypoints, leftEyePoints);

      // 繪製右眼輪廓
      drawEyeOutline(keypoints, rightEyePoints);
    }
  }
}

function drawEyeOutline(keypoints, eyePoints) {
  for (let i = 0; i < eyePoints.length - 1; i++) {
    const idx1 = eyePoints[i];
    const idx2 = eyePoints[i + 1];
    if (keypoints[idx1] && keypoints[idx2]) {
      const [x1, y1] = keypoints[idx1];
      const [x2, y2] = keypoints[idx2];
      if (isFinite(x1) && isFinite(y1) && isFinite(x2) && isFinite(y2)) {
        line(x1, y1, x2, y2);
      }
    }
  }

  // 將最後一點與第一點連接，形成閉合路徑
  const idxStart = eyePoints[0];
  const idxEnd = eyePoints[eyePoints.length - 1];
  if (keypoints[idxStart] && keypoints[idxEnd]) {
    const [xStart, yStart] = keypoints[idxStart];
    const [xEnd, yEnd] = keypoints[idxEnd];
    if (isFinite(xStart) && isFinite(yStart) && isFinite(xEnd) && isFinite(yEnd)) {
      line(xEnd, yEnd, xStart, yStart);
    }
  }
}
