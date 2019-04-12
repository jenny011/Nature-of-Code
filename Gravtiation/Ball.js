class Ball{
  constructor(x,y,m,r,g,b){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector(random(-0.1,0.1),random(-0.1,0.1));
    this.initpos = createVector(x,y);
    this.mass = m;
    this.rad = this.mass * 5;
    this.r = r;
    this.g = g;
    this.b = b;
    this.t1 = 240;
    this.decay = 0.1;
  }

  disappear(){
    this.t1 -= this.decay;
  }

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  applyAttraction(other,c){ //attract
    let force = p5.Vector.sub(other, this.pos);
    force.mult(c);
    this.applyForce(force);
  }

  applyRepel(other){
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    let magnitude = (GRAVITY * this.mass * other.mass) / (distance * distance);
    force.normalize();
    force.mult(magnitude);
    force.mult(-1.5);
    force.limit(10);
    this.applyForce(force);
  }

  checkArea(area,v){
    var inside = false;
    let vector = p5.Vector.sub(area.pos,v);
    let distance = vector.mag();
    if(distance<area.d/2-this.rad){
      inside = true;
    }
    return inside;
  }

  checkCollision(other){
    let vector = p5.Vector.sub(other.pos,this.pos);
    let distance = vector.mag();
    let r = this.r;
    let g = this.g;
    let b = this.b;
    if(distance<=this.rad+other.rad){
      vector.normalize();
      let magnitude;
      let c = 0.2;
      magnitude = this.vel.mag()*c;
      vector.mult(magnitude);
      other.applyForce(vector);
      magnitude = other.vel.mag()*c;
      vector.normalize();
      vector.mult(-1);
      vector.mult(magnitude);
      this.applyForce(vector);
      this.r = other.r;
      this.g = other.g;
      this.b = other.b;
      other.r = r;
      other.g = g;
      other.b = b;
    }
  }

  // checkBounce(area){
  //   let vector = p5.Vector.sub(area.pos,this.pos);
  //   let distance = vector.mag();
  //   if(this.checkArea(area,this.initpos)){
  //     if(distance>=area.d/2-this.d/2){
  //       let magnitude;
  //       let c = 0.2;
  //       magnitude = area.vel.mag()*c;
  //       vector.normalize();
  //       vector.mult(-1);
  //       vector.mult(magnitude);
  //       this.applyForce(vector);
  //     }
  //   }else{
  //     if(distance<=this.d/2+area.d/2){
  //       let magnitude;
  //       let c = 0.2;
  //       magnitude = area.vel.mag()*c;
  //       vector.normalize();
  //       vector.mult(-1);
  //       vector.mult(magnitude);
  //       this.applyForce(vector);
  //     }
  //   }
  // }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    noStroke();
    fill(this.r,this.g,this.b,this.t1);
    ellipse(0,0,this.rad*2,this.rad*2);
    pop();
  }
}
