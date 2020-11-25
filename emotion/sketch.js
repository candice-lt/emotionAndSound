let notesPic =[];

let video;
let poseNet;
let poses = [];
let skeletons = [];

function setup() {
    loadCamera();
    loadTracker();
    loadCanvas(800,800);
    
    for(let i=0; i<10;i++){
    notesPic.push(new notesClass({x:50+i*70}));
  }
    
    video = createCapture(VIDEO);
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', function (results) {
    poses = results;
    });

  video.hide();

}
      
function draw() {
    getPositions();
    getEmotions();
    
    clear();
    
    noStroke();
    fill(0,150);
    rect(0,0,width,height);
    
    //image(video, 0, 0);
    drawKeypoints();//draw hands' position
    
    drawPoints();
    
    for(let i = 0;i<notesPic.length;i++){
        notesPic[i].view();
        //notesPic[i].move();
    }

    if (emotions) {
        // angry=0, sad=1, surprised=2, happy=3
        for (var i = 0;i < predictedEmotions.length;i++) {
            noStroke();
            fill(200,220,220);
            rect(i * 110+20, height-80, 30, -predictedEmotions[i].value * 30);
            //print(predictedEmotions[i].value *30);
        }
        
    }
    
    text("ANGRY", 20, height-40);
    text("DISGUST", 130, height-40);
    text("FEAR", 245, height-40);
    text("SAD", 355, height-40);
    text("SURPRISED", 450, height-40);
    text("HAPPY", 570, height-40);
}

function mousePressed(){
    for(let i = 0;i<notesPic.length;i++){
        let distSound = (mouseX, mouseY, notesPic[i].x, notesPic[i].y);
        if(distSound<20){
            notesPic[i].move();
            print(i+'sound');
        }
    }
}

function drawPoints() {
    fill(255);
    for (var i=0; i<positions.length -3; i++) {
        ellipse(positions[i][0], positions[i][1], 2, 2);
    }
}

class notesClass{
  constructor(args){
    this.x=args.x===undefined? ranom(height):args.x;
    this.y=50;
    this.s=10;
    
    this.osc = new p5.Oscillator();
    this.osc.setType('sine');
    this.osc.start();
    this.osc.amp(1);
    this.osc.freq(400);
  }
  view(){
    let floatY = this.y;
    fill(this.x, 220,220);
    noStroke();
    ellipse(this.x, floatY, 2*this.s);
    strokeWeight(2);
    stroke(this.y-50,20,20);
    line(this.x+this.s, floatY, this.x+this.s, floatY-20);
    curve(this.x, floatY, this.x+this.s, floatY-23, this.x+this.s+6, floatY-17,this.x+this.s+16, floatY-30);
  }
  move(){
    this.osc.freq(800-this.x);
      
    if(predictedEmotions[0].value * 30>10){
        this.osc.setType('triangle');
    }
    
//      for(let i=0; i<17;i++){
//          this.x = positions[i][0];
//          this.y = positions[i][1];
//  }
   

  }

}



function drawKeypoints() {
  for(let i = 0; i < poses.length; i++) {
    for(let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
function modelLoaded() {
  print('model loaded'); 
}

