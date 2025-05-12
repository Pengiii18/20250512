let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

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

      for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = keypoints[points[i]];
        const [x2, y2] = keypoints[points[i + 1]];
        if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
          line(x1, y1, x2, y2); // 畫出兩點之間的線
        }
      }

      // 將最後一點與第一點連接，形成閉合路徑
      const [xStart, yStart] = keypoints[points[0]];
      const [xEnd, yEnd] = keypoints[points[points.length - 1]];
      if (xStart !== undefined && yStart !== undefined && xEnd !== undefined && yEnd !== undefined) {
        line(xEnd, yEnd, xStart, yStart);
      }
    }
  }
}
