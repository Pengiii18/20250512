let facemesh;
let video;
let predictions = [];
// 嘴巴的點索引
const mouthPoints = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61];

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
  drawMouth();
}

function drawMouth() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    if (keypoints && keypoints.length > 0) {
      stroke(0, 0, 255); // 藍色線條
      strokeWeight(15); // 線條粗細為15
      noFill();

      beginShape();
      for (let i = 0; i < mouthPoints.length; i++) {
        const [x, y] = keypoints[mouthPoints[i]];
        if (x !== undefined && y !== undefined) {
          vertex(x, y); // 繪製嘴巴的點
        }
      }
      endShape(CLOSE); // 閉合嘴巴的路徑
    }
  }
}
