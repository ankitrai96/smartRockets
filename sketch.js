var population,
  count=0,
  lifeSpan=350,
  life, target;

function preload(){
  img = loadImage('rocket.png');
}

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
  if(count > lifeSpan){
    population.evaluate();
    population.selection();
    count = 0;
  }
}

function DNA(genes){
  if(genes){
    this.genes = genes;
  } else {
      this.genes = [];
      for(var i = 0; i < lifeSpan; i++){
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(0.1);
    }
  }
  this.crossover = function(partner){
    var newgenes = [];
    var mid = floor(random(this.genes.length));
    for(var i=0;i<this.genes.length;i++){
      if(i<mid){
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = partner.genes[i];
      }
    }
    return new DNA(newgenes);
  }
}

function Population(){
  this.rockets = [];
  this.popSize = 30;
  for(var i = 0; i<this.popSize; i++){
    this.rockets[i] = new Rocket();
  }
  this.run = function(){
    for(var i = 0; i<this.popSize; i++){
      this.rockets[i].update();
      this.rockets[i].show();
    }  
  }
  this.evaluate = function(){
    var maxfit = 0;
    for(var i=0; i<this.popSize;i++){
      this.rockets[i].calculateFitness();
      if(this.rockets[i].fitness > maxfit){
        maxfit = this.rockets[i].fitness;
      }
    }

    //normalize
    for(var i=0; i<this.popSize;i++){
      this.rockets[i].fitness /= maxfit;
    }

    this.matingPool = [];
    for(var i=0; i<this.popSize;i++){
      var n = this.rockets[i].fitness * 100;
      for(var j =0; j<n;j++){
        this.matingPool.push(this.rockets[i]);
      }
    }
  }

  this.selection = function(){
    var newRockets = [];
    for(var i =0; i< this.rockets.length;i++){
      var parentA = random(this.matingPool).dna;
      var parentB = random(this.matingPool).dna;
      var child = parentA.crossover(parentB);
      newRockets[i] = new Rocket(child);    
    }
    this.rockets = newRockets;
  }
}

function Rocket(dna){
  this.vel = createVector();
  this.pos = createVector(width/2,height);
  this.acc = createVector();
  this.fitness = 0;
  this.hit = false;
  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  
  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.calculateFitness = function(){
    var d = dist(this.pos.x,this.pos.y,target.x,target.y);
    this.fitness = 1 / d ;
  }

  this.show = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    imageMode(CENTER);
    image(img,0,0,52,32);
    pop();
  }
  this.update = function(){
    var d = dist(this.pos.x,this.pos.y,target.x,target.y);
    if(d < 10){
      this.hit = true;
      this.pos = target.copy();
    }
    if(!this.hit){
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    this.applyForce(this.dna.genes[count]);
  }
}