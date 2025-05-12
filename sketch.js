let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady, modelError);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function modelError(err) {
  console.error("Facemesh model failed to load:", err);
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawFaceMesh();
}

function drawFaceMesh() {
  stroke(0, 0, 255); // 藍色線條
  strokeWeight(5); // 線條粗細為5
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    if (keypoints) { // 確保 keypoints 存在
      beginShape();
      for (let i = 0; i < points.length; i++) {
        const index = points[i];
        if (keypoints[index]) { // 確保點的索引有效
          const [x, y] = keypoints[index];
          vertex(x, y);
        }
      }
      endShape(CLOSE);
    }
  }
}
