var population, mutationRate=0.01,
  count=0, maxForce = 0.1,
  lifeSpan=450, popSize = 25,
  target, generation=1;

function preload(){
  img = loadImage('resources/rocket.png');
}

function setup() {

	createCanvas(600,400);
  population = new Population();
  target = createVector(width/2, 50);
}

function draw() {
  background(0);
  population.run();
  count++;
  fill(count%255,225,count-255);
  ellipse(target.x, target.y, 25,25);
  textSize(32);
  textAlign(CENTER);
  fill(count%255,count-255,255);
  textFont("Comic Sans MS");
  text("Genetic Algorithm", width/2, 175);
  textSize(10);
  fill(255);
  textAlign(LEFT);  
  text("Generation: " + generation, 10, 360);  
  text("Fuel: " + (lifeSpan-count)+" units", 10, 372);    
  text("Population Size: "+popSize, 10, 383);  
  text("Mutation Rate: "+mutationRate*100+"%", 10, 394);  
  
  if(count > lifeSpan){
    population.evaluate();
    population.selection();
    count = 0;
    generation++;
  }
}

function DNA(genes){
  if(genes){
    this.genes = genes;
  } else {
      this.genes = [];
      for(var i = 0; i < lifeSpan; i++){
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(maxForce);
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
  this.mutation = function(){
    for(var i=0;i<this.genes.length; i++){
      if(random(1)< mutationRate){
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxForce);
      }
    }
  }
}

function Population(){
  this.rockets = [];
  for(var i = 0; i<popSize; i++){
    this.rockets[i] = new Rocket();
  }
  this.run = function(){
    for(var i = 0; i<popSize; i++){
      this.rockets[i].update();
      this.rockets[i].show();
    }  
  }
  this.evaluate = function(){
    var maxfit = 0;
    for(var i=0; i<popSize;i++){
      this.rockets[i].calculateFitness();
      if(this.rockets[i].fitness > maxfit){
        maxfit = this.rockets[i].fitness;
      }
    }

    //normalize
    for(var i=0; i<popSize;i++){
      this.rockets[i].fitness /= maxfit;
    }

    this.matingPool = [];
    for(var i=0; i<popSize;i++){
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
      child.mutation();
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
  this.crash = false;
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
    if(this.crash){
      this.fitness /= 10;
    }
    if(this.hit){
      this.fitness *= 10;
    }
  }

  this.show = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    imageMode(CENTER);
    image(img,0,0,42,32);
    pop();
  }
  this.update = function(){
    var d = dist(this.pos.x,this.pos.y,target.x,target.y);
    if(d < 10){
      this.hit = true;
    }
      this.applyForce(this.dna.genes[count]);  
      if(!this.hit && !this.crash){
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
      }
      if(this.pos.x>(width-270)/2 && this.pos.x<(width+270)/2 && this.pos.y>145 &&this.pos.y<190){
        this.crash = true;
      }
      if(this.pos.x<0 || this.pos.x>width || this.pos.y<0 || this.pos.y>height+25){
        this.crash = true;
      }
  }
}