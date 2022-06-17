var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var text_time = document.getElementById("text_time");
var text_life = document.getElementById("text_life");
var text_block_blue = document.getElementById("text_block_blue");
var text_block_red = document.getElementById("text_block_red");

function Draw(x,y,color){
  var size = 25;
  var padding = 5;
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.rect((size+padding)*x,(size+padding)*y,size,size);
  ctx.fill();
}
var tableSize=20;
var time = 0;

class User {
  constructor(x,y,color,direction,life){
    this.x=x;
    this.y=y;
    this.color=color;
    this.direction=direction;
    this.life=life;
  }
  movement(){
    if(this.direction==0){//left
        this.x-=1;
    }
    else if(this.direction==1){//up
        this.y-=1;
    }
    else if(this.direction==2){//right
        this.x+=1;
    }
    else if(this.direction==3){//down
        this.y+=1;
    }
    this.x=this.end_board(this.x);
    this.y=this.end_board(this.y);
  }
  end_board(value){
    if(value<0){
      value=tableSize-1;
    }
    else if(value>tableSize-1){
      value=0;
    }
    return value;
  }
}

class Enemy {
  constructor(x,y,color,speed){
    this.x=x;
    this.y=y;
    this.color=color;
    this.speed=speed;
  }
  boost(){
    this.color='yellow';
    this.speed=2;
  }
  stop(){
    var move = Math.floor(Math.random() * 4)+1;
    console.log(`move ${move}`);
    switch(move){
      case 1:this.x+=1; break;
      case 2:this.x-=1; break;
      case 3:this.y+=1; break;
      case 4:this.y-=1; break;
    }
    this.color='blue';
    this.speed=0;
  }
  movement(){
    var move = Math.floor(Math.random() * 2);
    if(move==0){
      if(user.x>this.x){
        this.x+=this.speed;
      }
      else if(user.x<this.x){
        this.x-=this.speed;
      }
      else if(user.y>this.y){
        this.y+=this.speed;
      }
      else if(user.y<this.y){
        this.y-=this.speed;
      }
    }
    else{
      if(user.y>this.y){
        this.y+=this.speed;
      }
      else if(user.y<this.y){
        this.y-=this.speed;
      }
      else if(user.x>this.x){
        this.x+=this.speed;
      }
      else if(user.x<this.x){
        this.x-=this.speed;
      }
    }
  }
}

class Block {
  constructor(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
  }
  update(){
    drawRect(this.x,this.y,this.color);
  }
}

var user = new User(0,0,'green',3,3);
spawnEnemy();
spawnBlock();

block=[];
function spawnBlock(){
  setInterval(() => {
    const x=parseInt(Math.random()*tableSize);
    const y=parseInt(Math.random()*tableSize);
    const color = 'blue';
    block.push(new Block(x,y,color));

    if(time>29){
      const x=parseInt(Math.random()*tableSize);
      const y=parseInt(Math.random()*tableSize);
      const color = 'blue';
      block.push(new Block(x,y,color));
    }

    time++;
  },1000)
}

enemy=[];
function spawnEnemy(){
  setInterval(() => {
    const x=parseInt(Math.random()*tableSize);
    const y=parseInt(Math.random()*tableSize);
    const color = 'red';
    enemy.push(new Enemy(x,y,color,1));

    if(time>59){
      const x=parseInt(Math.random()*tableSize);
      const y=parseInt(Math.random()*tableSize);
      const color = 'yellow';
      enemy.push(new Enemy(x,y,color,2));
    }

  },5000)
}

setInterval(function() {
  for(var x =0; x<tableSize; x++){
    for(var y=0; y<tableSize; y++){
      Draw(x,y,'lightgrey');
    }
  }

  user.movement();
  Draw(user.x,user.y,user.color);

  block.forEach((block) => {
    Draw(block.x,block.y,block.color);
    if(user.x==block.x && user.y==block.y){
      user.life--;
    }

    enemy.forEach((enemy,index) => {
      if(block.x==enemy.x && block.y==enemy.y){
        //enemy.boost(index,1)
        enemy.stop(index,1)
      }
    });
  });

  enemy.forEach((enemy) => {
    enemy.movement();
    Draw(enemy.x,enemy.y,enemy.color);
    if(user.x==enemy.x && user.y==enemy.y){
      user.life--;
      enemy.speed=0;
      enemy.color='blue'
    }
  });

  text_time.innerText = `Time : ${time}`;
  text_life.innerText = `Life : ${user.life}`;
  text_block_blue.innerText = `Blue : x${block.length}`;
  text_block_red.innerText = `Red : x${enemy.length}`;

  if(user.life<=0){
    window.location.reload(false);
  }
}, 150)

window.onkeydown = function(e){
  console.log(e.keyCode);
  if(e.keyCode >= 37 && e.keyCode <=40){
    user.direction = e.keyCode - 37;
  }
}
