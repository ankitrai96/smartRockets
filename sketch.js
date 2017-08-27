var population,
  count=0,
  lifeSpan=200,
  life, target;
function setup() {

	createCanvas(600,400);
  population = new Population();
  life = createP();
  target = createVector(width/2, 50);
}

function draw() {
  background(0);
  population.run();
  life.html(count);
  count++;
  fill(0,255,13);
  ellipse(target.x, target.y, 25,25);
}

function DNA(){
  this.genes = [];
  for(var i = 0; i < lifeSpan; i++){
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(0.1);
  }
}

function Population(){
  this.rockets = [];
  this.popSize = 25;
  for(var i = 0; i<this.popSize; i++){
    this.rockets[i] = new Rocket();
  }
  this.run = function(){
    for(var i = 0; i<this.popSize; i++){
      this.rockets[i].update();
      this.rockets[i].show();
    }  
  }
}

function Rocket(){
  this.vel = createVector();
  this.pos = createVector(width/2,height);
  this.acc = createVector();
  this.dna = new DNA();
  
  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.show = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    fill(235,2,2);
    noStroke();
    rect(0,0,25,5);
    pop();
  }
  this.update = function(){
    this.applyForce(this.dna.genes[count]);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
  }
}