class Area{
  constructor(x,y,d,e){
    this.pos = createVector(x,y);
    this.d = d;
    this.e = e;
    this.vel = createVector(0,0);
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    noStroke();
    fill(0);
    ellipse(0,0,this.d,this.d);
    pop();
  }
}
