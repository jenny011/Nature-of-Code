class Agent{
  constructor(x,y){
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 3;
    this.maxSteer = 0.03;
    this.maxAvoid = 0.08;
    //
    this.angle = 0;
    this.brakeRad = 40;
    this.detectArea = height*0.8;
    this.stopArea = 2;
  }
  // update(){
  //   this.vel.add(this.acc);
  //   this.pos.add(this.vel);
  //   this.acc.mult(0);
  //   //angle
  //   this.angle = this.vel.heading();
  //   // //restitution
  //   // this.vel.mult(0.99);
  // }
  // applyForce(f){
  //   let force = f.copy();
  //   this.acc.add(force);
  // }
  // seek(target){
  //   //direction
  //   let desire = p5.Vector.sub(target.pos,this.pos);
  //   let distance = desire.mag();
  //   if(distance < this.detectArea){
  //     desire.normalize();
  //     if(distance < this.brakeRad){
  //       let mappedSpeed = map(distance,0,this.brakeRad,0,this.maxSpeed);
  //       desire.mult(mappedSpeed);
  //     }else{
  //       desire.mult(this.maxSpeed);
  //     }
  //     //steer
  //     let steer = p5.Vector.sub(desire,this.vel);
  //     steer.limit(this.maxSteer);
  //     //applyForce
  //     this.applyForce(steer);
  //   }
  // }
  // avoid(other){
  //   //direction
  //   let desire = p5.Vector.sub(other.pos,this.pos);
  //   let distance = desire.mag();
  //   if(distance < this.avoidArea){
  //     desire.normalize();
  //     if(distance < this.brakeRad){
  //       let mappedSpeed = map(distance,0,this.brakeRad,0,this.maxSpeed);
  //       desire.mult(-mappedSpeed);
  //     }else{
  //       desire.mult(-this.maxSpeed);
  //     }
  //     //steer
  //     let steer = p5.Vector.sub(desire,this.vel);
  //     steer.limit(this.maxSteer);
  //     //applyForce
  //     this.applyForce(steer);
  //   }
  // }
  // reappear(){
  //   if(this.pos.x < 0){
  //     this.pos.x = width;
  //   }else if(this.pos.x > width){
  //     this.pos.x = 0;
  //   }
  //   // if(this.pos.y < 0){
  //   //   this.pos.y = 0;
  //   // }
  //   if(this.pos.y > height){
  //     this.pos.y = 0;
  //   }
  // }
  update() {
    if(keyIsPressed){
      this.vel.mult(0);
    }
    else{
      this.vel.add(this.acc);
    }
    this.pos.add(this.vel);
    this.acc.mult(0);
    // this.acc = createVector(0,0.1);
    //
    this.angle = this.vel.heading();
  }
  applyForce(f) {
    let force = f.copy();
    this.acc.add(force);
  }
  seek(target){
    //direction
    let desire = p5.Vector.sub(target,this.pos);
    let distance = desire.mag();
    if(distance < this.detectArea && distance > this.stopArea){
      desire.normalize();
      if(distance < this.brakeRad){
        let mappedSpeed = map(distance,0,this.brakeRad,0,this.maxSpeed);
        desire.mult(mappedSpeed);
      }else{
        desire.mult(this.maxSpeed);
      }
      //steer
      let steer = p5.Vector.sub(desire,this.vel);
      steer.limit(this.maxSteer);
      //applyForce
      this.applyForce(steer);
    }
  }
  avoid(obstacle) {
    // desired velocity
    let desired = p5.Vector.sub(obstacle.pos, this.pos);
    let distance = desired.mag();
    if (distance < obstacle.avoidArea) {
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
      steer.limit(this.maxAvoid);
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
    rotate(this.angle);
    stroke(0,220,255,50);
    point(0,0);
    if(params.debugMode){
      stroke(220,0,255,50);
    }
    pop();
  }
}

class Obstacle{
  constructor(x,y){
    this.pos = createVector(x,y);
    this.rad = 10;
    this.color = color(0,random(150,200),random(150,200),10);
    this.avoidArea = random(50,100)+this.rad;
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}
