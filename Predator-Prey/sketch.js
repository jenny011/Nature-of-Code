let predators=[], obstacles = [], preys=[];

let params = {
  debugMode: false,
  obstacle_width: 30
};

let gui = new dat.GUI();
gui.add(params, "debugMode");
gui.add(params, "obstacle_width",20,60).step(5);

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);
  for(let i=0; i<3; i++){
    predators.push(new Predator(random(width),random(height),random(0,1)));
  }
}

function draw() {
  background(0,100);
  if(preys.length<20){
    preys.push(new Prey(random(width),random(height),random(3,12)));
  }

  let mouse = createVector(mouseX,mouseY);
  for(let i=0; i<obstacles.length; i++){
    obstacles[i].display();
  }

  // prey
  for(let i=preys.length-1; i>=0; i--){
    pr = preys[i];
    if(pr.eaten){
      pr.die();
      pr.vel.mult(0);
    }else{
      for(let j=preys.length-1; j>=0; j--){
        if(j != i){
          pr.avoid(preys[j]);
        }
      }
      pr.escape(predators);
    }
    pr.update();
    pr.reappear();
    pr.display();
  }

  //predator
  for(let i=0; i<predators.length; i++){
    let pt = predators[i];
    pt.getHungry();

    for(let k=0; k<obstacles.length; k++){
      pt.avoidObstacle(obstacles[k]);
    }
    for(let i=0; i<preys.length; i++){
      pt.eat(preys[i]);
    }

    if(pt.eating){
      pt.vel.mult(0);
    }else{
      if(pt.starve > 0){
        pt.seek(preys);
      }
      for(let j=0; j<predators.length; j++){
        if(i != j){
          pt.avoid(predators[j]);
        }
      }
      pt.prevAngle = pt.angle;
    }
    pt.update();
    pt.reappear();
    pt.display();
  }

  //prey die
  for(let i=preys.length-1; i>=0; i--){
    if(preys[i].dead){
      preys.splice(i,1);
    }
  }
}

function mousePressed(){
  if(!(mouseX>width-300 && mouseY<100)){
      obstacles.push(new Obstacle(mouseX,mouseY));
  }
}
