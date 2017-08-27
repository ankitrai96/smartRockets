var rocket;
function setup() {

	createCanvas(600,400);
  rocket = new Rocket();
}

function draw() {
  background(55,55,45);
  rocket.show();
}

function Rocket(){
  this.vel = createVector();
  this.pos = createVector(width/2,height);
  this.acc = createVector();
  
  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.show = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0,0,5,50);
    pop();
  }
  this.update = function(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}