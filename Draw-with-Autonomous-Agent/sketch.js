let agents=[], obstacles = [];

let params = {
  debugMode: false,
};

let gui = new dat.GUI();
gui.add(params, "debugMode");

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);
  for(let i=0; i<300; i++){
    agents.push(new Agent(random(width),random(height)));
  }
}

function draw() {
  let mouse = createVector(mouseX,mouseY);
  for(let i=0; i<obstacles.length; i++){
    obstacles[i].display();
  }
  for(let i=0; i<agents.length; i++){
    let a = agents[i];
    a.seek(mouse);
    for(let i=0; i<obstacles.length; i++){
      a.avoid(obstacles[i]);
    }
    a.reappear();
    a.update();
    a.display();
  }
}

function mousePressed(){
  obstacles.push(new Obstacle(mouseX,mouseY));
}
