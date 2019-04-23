class Predator{
  constructor(x,y,hunger){
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 3;
    this.maxSteer = 0.08;
    this.eating = false;
    this.hunger = hunger;
    this.starve = 2;
    //
    this.prevAngle = 0;
    this.angle = 0;
    this.brakeRad = 30;
    this.detectArea = height;
    this.avoidArea = 20;
  }
  update() {
    if(keyIsPressed){
      this.vel.mult(0);
    }
    else{
      this.vel.add(this.acc);
    }
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  applyForce(f) {
    let force = f.copy();
    this.acc.add(force);
  }
  getHungry(){
    if(this.hunger > 0){
      this.hunger -= 0.002;
    }
    if(this.hunger>0 && this.hunger <= 0.3){
      this.starve = 2;
    }else if(this.hunger > 0.3 && this.hunger <= 0.7){
      this.starve = 1;
    }else if(this.hunger>0.7 && this.hunger <= 1){
      this.starve = 0;
    }
  }
  seek(targets){
    //nearest prey
    let distance = width;
    let direction;
    for(let i=0; i<targets.length; i++){
      let t = targets[i];
      if(this.starve == 1){
        if(!t.eaten){
          let desired = p5.Vector.sub(t.pos,this.pos);
          if(desired.mag() < distance){
            distance = desired.mag();
            direction = desired;
          }
        }
      } else{
        let desired = p5.Vector.sub(t.pos,this.pos);
        if(desired.mag() < distance){
          distance = desired.mag();
          direction = desired;
        }
      }
    }
    if(distance < this.detectArea){
      direction.normalize();
      if(distance < this.brakeRad){
        let mappedSpeed = map(distance,0,this.brakeRad,0,this.maxSpeed);
        direction.mult(mappedSpeed);
      }else{
        direction.mult(this.maxSpeed);
      }
      //steer
      let steer = p5.Vector.sub(direction,this.vel);
      steer.limit(this.maxSteer);
      //applyForce
      this.applyForce(steer);
    }
  }
  eat(prey){
    let distance = p5.Vector.sub(this.pos,prey.pos).mag();
    if(distance <= prey.originalRad+1){
      prey.eaten = true;
      this.eating = true;
      if(prey.dead){
        this.eating = false;
        this.hunger += map(prey.originalRad,3,12,0.3,1);
        this.hunger = constrain(this.hunger,0,1);
      }
    }
  }
  avoid(other) {
    // desired velocity
    let desired = p5.Vector.sub(other.pos, this.pos);
    let distance = desired.mag();
    if (distance < this.avoidArea+other.avoidArea) {
      desired.normalize();
      if (distance < this.brakeRad) {
        // decrease
        let mappedSpeed = map(distance, 0, this.brakeRad, 0, this.maxSpeed)
        desired.mult(-mappedSpeed);
      } else {
        desired.mult(-this.maxSpeed);
      }
      // steering force
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxSteer);
      // apply
      this.applyForce(steer);
    }
  }
  avoidObstacle(obstacle){
    let desired = p5.Vector.sub(obstacle.pos, this.pos);
    let distance = desired.mag();
    if (distance < this.avoidArea + obstacle.rad) {
      desired.normalize();
      if (distance < this.brakeRad) {
        desired.normalize();
        // decrease
        let mappedSpeed = map(distance, 0, obstacle.brakeRad, 0, this.maxSpeed)
        desired.mult(-mappedSpeed);
      } else {
        desired.mult(-this.maxSpeed);
      }
      // steering force
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.23);
      // apply
      this.applyForce(steer);
    }
  }
  reappear() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
      this.vel.mult(0,0);
    }
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    if(this.eating){
      rotate(this.prevAngle);
    }else{
      rotate(this.angle);
    }
    if(this.starve == 2){
      stroke(255,0,0,150);
    }else if(this.starve == 1){
      stroke(255,125,0,150);
    }else{
      stroke(255,255,0,150);
    }

    strokeWeight(2);
    noFill();
    triangle(0,0,-20,8,-20,-8);
    if(params.debugMode){
      strokeWeight(1);
      stroke(255,200,0,150);
      ellipse(0,0,this.avoidArea,this.avoidArea);
      rotate(PI/2);
      if(this.starve == 2){
        stroke(255,0,0,150);
        text("so hungry!",0,-10);
      }else if(this.starve == 1){
        stroke(255,125,0,150);
        text("hungry",0,-10);
      }else{
        stroke(255,255,0,150);
        text("full",0,-10);
      }
    }
    pop();
  }
}


class Prey{
  constructor(x,y,rad){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector(random(-1,1),random(-1,1));
    this.rad = rad;
    this.originalRad = this.rad;
    this.color = color(0,random(150,200),random(150,200));
    this.eaten = false;
    this.dead = false;
    //
    this.maxSpeed = 2;
    this.maxSteer = 0.05;
    //
    this.angle = 0;
    this.brakeRad = 40;
    this.escapeArea = 80;
    this.avoidArea = 30;
  }
  update(){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    this.acc.add(force);
  }
  die(){
    this.rad -= 0.1;
    if(this.rad <= 0){
      this.dead = true;
      this.color = color(255,0,0,150);
    }
  }
  escape(others) {
    let distance = width;
    let direction;
    for(let i=0; i<others.length; i++){
      let t = others[i];
      let desired = p5.Vector.sub(t.pos,this.pos);
      if(desired.mag() < distance){
        distance = desired.mag();
        direction = desired;
      }
    }
    if (distance < this.escapeArea) {
      direction.normalize();
      if (distance < this.brakeRad) {
        // decrease
        let mappedSpeed = map(distance, 0, this.brakeRad, 0, this.maxSpeed)
        direction.mult(-mappedSpeed);
      } else {
        direction.mult(-this.maxSpeed);
      }
      // steering force
      let steer = p5.Vector.sub(direction, this.vel);
      steer.limit(this.maxAvoid);
      // apply
      this.applyForce(steer);
    }
  }
  avoid(other) {
    // desired velocity
    let desired = p5.Vector.sub(other.pos, this.pos);
    let distance = desired.mag();
    if (distance < this.avoidArea) {
      desired.normalize();
      if (distance < this.brakeRad) {
        // decrease
        let mappedSpeed = map(distance, 0, this.brakeRad, 0, this.maxSpeed)
        desired.mult(-mappedSpeed);
      } else {
        desired.mult(-this.maxSpeed);
      }
      // steering force
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxSteer);
      // apply
      this.applyForce(steer);
    }
  }
  reappear() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.rad*2, this.rad*2);
    if(params.debugMode){
      noFill();
      stroke(0,255,100,150);
      ellipse(0,0,this.avoidArea*2,this.avoidArea*2);
    }
    pop();
  }
}


class Obstacle{
  constructor(x,y,size){
    this.pos = createVector(x,y);
    this.rad = params.obstacle_width;
    this.color = color(0,random(50,100),random(50,100));
    this.brakeRad = this.rad;
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    // noStroke();
    stroke(this.color);
    fill(red(this.color),green(this.color),blue(this.color),30);
    rectMode(CENTER);
    rect(0, 0, this.rad*2, this.rad*2);
    if(params.debugMode){
      noFill();
      stroke(255,150,0,150);
      ellipse(0,0,this.avoidArea*2,this.avoidArea*2);
      ellipse(0,0,this.brakeRad*2,this.brakeRad*2);
    }
    pop();
  }
}
