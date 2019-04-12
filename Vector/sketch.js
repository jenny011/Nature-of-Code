let colors = [0];
let range1 = 0.55;
let range2 = 0.65;
let click = [true,false,false];
let hover = [false,false,false];

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);
  for(let i=0;i<3;i++){
    colors.push(color(0));
  }
}

let particles = [];

function draw() {
  background(0);
  noStroke();
  fill(255,255,255,50);
  ellipse(mouseX,mouseY,20,20);
  fill(255,255,255,70);
  ellipse(mouseX,mouseY,10+1.5*sin(frameCount/2),10+1.5*sin(frameCount/2));
  fill(230);
  rect(0,height*0.9,width,height*0.1);

  for(let i=0; i<3; i++){
    if(click[i] == true){colors[i] = color(255,150,150);}
    else if(hover[i] == true){colors[i] = color(255,150,150);}
    else{colors[i] = color(0);}
  }

  if(mouseX > width/6 && mouseX<width/6+80 && mouseY>height*0.85 && mouseY<height){
    hover = [true,false,false];
  }else if(mouseX > 9*width/20 && mouseX<19*width/40+80 && mouseY>height*0.85 && mouseY<height){
    hover = [false,true,false];
  }else if(mouseX > 3*width/4 && mouseX<3*width/4+80 && mouseY>height*0.85 && mouseY<height){
    hover = [false,false,true];
  }else{
    hover = [false,false,false];
  }

  textSize(20);
  fill(colors[0]);
  text("elasticity1",width/6,height*0.96);
  fill(colors[1]);
  text("elasticity2",9*width/20,height*0.96);
  fill(colors[2]);
  text("elasticity3",3*width/4,height*0.96);

  if(mouseIsPressed == true){
    if(mouseX > width/5 && mouseX<width/5+50 && mouseY>height*0.85 && mouseY<height){
      range1 = 0.5;
      range2 = 0.6;
      click=[true,false,false];
    }else if(mouseX > 19*width/40 && mouseX<19*width/40+50 && mouseY>height*0.85 && mouseY<height){
      range1 = 0.7;
      range2 = 0.8;
      click=[false,true,false];
    }else if(mouseX > 3*width/4 && mouseX<3*width/4+50 && mouseY>height*0.85 && mouseY<height){
      range1 = 0.9;
      range2 = 0.98;
      click=[false,false,true];
    }else{
      if(mouseY<height*0.9-25){
        for(i=0; i<1; i++){
          let vx = random(-1,1);
          let ax;
          if(vx>0){
            ax = random(-3,-1);
          }else{
            ax = random(1,3);
          }
          particles.push(new Particle(mouseX,mouseY,vx,random(-6,-2),ax,0.162,random(130,255),random(130,255),random(130,255),random(range1,range2),false));
        }
      }
    }
  }

  for (let i=0;i<particles.length;i++){
    let p = particles[i];
    p.update();
    p.head();
    p.display();
    if(p.s2>p.s){
      p.shake();
    }
    if(p.bounce == false && p.pos.y >= height*0.9-p.s2/2){
      p.v.y = -(p.e*p.v.y);
      if(abs(p.v.y)<1/100000000){
        p.v.y = 0;
        p.a.y = 0;
      }
      p.bounce = true;
    }
    if(p.bounce == true){
      if(p.s2>p.s){
        p.s2 -= 5;
      }
      p.bounce = false;
    }
  }
}


//object
class Particle{
  constructor(x,y,vx,vy,ax,ay,r,g,b,e,bounce){
    this.pos = createVector(x,y);
    this.v = createVector(vx,vy);
    this.a = createVector(ax,ay);
    this.s = random(40,90);
    this.s2 = this.s*1.5;
    this.c = color(r,g,b);
    this.c2 = color(r,g,b,90);
    this.e = e;
    this.bounce = bounce;
    this.direction = createVector(0,0);
    this.angle = 0;
  }
  update(){
    this.pos.add(this.v);
    this.v.add(this.a);
    this.a.x *= 0;
  }
  shake(){
    this.s += sin(frameCount*0.5)*1.5;
  }
  head(){
    this.direction = createVector(mouseX-this.pos.x,mouseY-this.pos.y);
    this.direction.normalize();
    this.direction.mult(this.s/2,this.s/2);
    this.angle = this.direction.heading();
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(this.c);
    ellipse(0,0,this.s,this.s);
    fill(this.c2);
    ellipse(0,0,this.s2,this.s2);
    fill(255,255,255,180);
    ellipse(this.s2/4,0,6,6);
    // stroke(250);
    // line(0,0,this.s/2-1,0);
    pop();
  }
}
