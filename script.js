let canvas;
let canvasContext;

let circleX = 50;
let circleY = 50;

let circleSpeedX = 6;
let circleSpeedY = 3;

let paddleY = 250;
const PADDLE_HEIGHT = 100;

let paddleY2 = 250;
const PADDLE_HEIGHT2 = 100;

let humanScore = 0;
let aiScore = 0;

let startBtn = document.querySelector('#start');
startBtn.addEventListener('click', function(){
    startBtn.style.display = 'none';
    startGame();
    
});


let restartBtn = document.querySelector('#restart');
let pauseBtn = document.querySelector('#pause');

document.body.style.backgroundColor = "black";


/*------------------------------START Player----------------------------------*/
function calculateMousePos(evt){                            //en event starter hver gang musen er i bevægelse
    let rect = canvas.getBoundingClientRect();              //det er vores gameboard 
    let root = document.documentElement;                    //tager vores gameboard fra html
    let mouseX = evt.clientX - rect.left - root.scrollLeft; //den er ligeglad hvis jeg scroller, den følger altid med hvis musen er i websiden
    let mouseY = evt.clientY - rect.top - root.scrollTop;   //substracts the x and y coordinates within the playable space
    return{
        x:mouseX,
        y:mouseY
    };
}
/*------------------------------SLUT Player----------------------------------*/


/*-----------------START Ping pong header(Human vs 'AI')------------------*/
const newHeader = document.createElement('h1');
const content = document.createTextNode('Human vs "AI"');
newHeader.appendChild(content);
const currentHeader = document.getElementById('headerid');
document.body.insertBefore(newHeader, currentHeader);
newHeader.style.color = "white";
newHeader.style.fontFamily = "Arial";
/*-----------------SLUT Ping pong header(Human vs 'AI')------------------*/


window.onload = function(){                                     //Alt events starter når siden er loaded.
    canvas = document.getElementById('gamecanvasid');
    canvasContext = canvas.getContext('2d');
    
    hitSound = new hitSoundClass('http://commondatastorage.googleapis.com/codeskulptor-assets/Collision8-Bit.ogg')
    pointsSound = new pointsSoundClass('http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a')
    damageSound = new damageSoundClass('damage.wav')
    
    let framesPerSecond = 60;                                   //60 fps
    setInterval(startGame, 1000/framesPerSecond);               //God til et snake spil fordi setInterval er 1000 miliseconds
    
    canvas.addEventListener('mousemove', function(evt){         //en event starter hver gang musen bevæger sig
        let mousePos = calculateMousePos(evt);                  //evt = event
        paddleY = mousePos.y-(PADDLE_HEIGHT/2);                 //højde af musen
    });

    canvas.addEventListener('keydown', function(event){         
        let player2 = player2Input(event);
        paddleY2 = player2.y-(PADDLE_HEIGHT2/2);
    })
}

/*---------------------------------START LYD--------------------------------------*/
function damageSoundClass(src) {
    this.damageSoundClass = document.createElement("audio");
    this.damageSoundClass.src = src;
    this.damageSoundClass.setAttribute("preload", "auto");
    this.damageSoundClass.setAttribute("controls", "none");
    this.damageSoundClass.style.display = "none";
    document.body.appendChild(this.damageSoundClass);
    this.play = function(){
      this.damageSoundClass.play();
    }
  }

function pointsSoundClass(src) {
    this.pointsSoundClass = document.createElement("audio");
    this.pointsSoundClass.src = src;
    this.pointsSoundClass.setAttribute("preload", "auto");
    this.pointsSoundClass.setAttribute("controls", "none");
    this.pointsSoundClass.style.display = "none";
    document.body.appendChild(this.pointsSoundClass);
    this.play = function(){
      this.pointsSoundClass.play();
    }
  }

function hitSoundClass(src) {
    this.hitSoundClass = document.createElement("audio");
    this.hitSoundClass.src = src;
    this.hitSoundClass.setAttribute("preload", "auto");
    this.hitSoundClass.setAttribute("controls", "none");
    this.hitSoundClass.style.display = "none";
    document.body.appendChild(this.hitSoundClass);
    this.play = function(){
      this.hitSoundClass.play();
    }
  }
/*---------------------------------SLUT LYD--------------------------------------*/

function startGame(){
    move();
    drawEverything();   
}

function move(){
      computerAI();                           
    circleX = circleX + circleSpeedX;
    circleY = circleY + circleSpeedY;
    
    if(circleX < 0){                                    //hvis cirkel er større end 800, vender cirklen tilbage                 
        if(circleY > paddleY && circleY < paddleY + PADDLE_HEIGHT){
            circleSpeedX = -circleSpeedX
            circleSpeedY = circleSpeedY + (circleY - (paddleY + PADDLE_HEIGHT/2))/15;
            circleSpeedX++;
            hitSound.play();
        } else {
            reset();
            aiScore++; 
            //damageSound.play();  
            
        }
    } if(circleX > canvas.width){                       //hvis cirkel er mindre end 0, vender cirklen tilbage
        if(circleY > paddleY2 && circleY < paddleY2 + PADDLE_HEIGHT2){
            circleSpeedX = -circleSpeedX
            circleSpeedY = circleSpeedY + (circleY - (paddleY2 + PADDLE_HEIGHT2/2))/15;
            circleSpeedX--;
            hitSound.play();
        } else {
            reset();
            humanScore++;
            pointsSound.play();
        }
    } if(circleY < 0){                                  //hvis cirkel er større end 600, vender cirklen tilbage
        circleSpeedY = -circleSpeedY;
        
    } if(circleY > canvas.height){                      //hvis cirkel er mindre end 0, vender cirklen tilbage
        circleSpeedY = -circleSpeedY;
        
    }
}

function computerAI(){                              //computer AI 
    let paddleY2Center = paddleY2 + (PADDLE_HEIGHT2/2);
    if(paddleY2Center < circleY - 35){              //hvis paddleY2Center er mindre end cirkelY - 35, så bevæger den sig nedad
        paddleY2 +=5;                               //hastighed af Y-aksen. lavere er langsommere
    } else if(paddleY2Center > circleY + 35){       //hvis paddleY2Center er større end cirkelY + 35, så bevæger den sig opad
        paddleY2 -=5;                               //hastighed af Y-aksen. lavere er langsommere
    }
}

               
function reset(){                        //hvis cirklen rammer sidene, resetter cirklen
    if(circleX > 800){                   //hvis bolden er mere eller lige med 800(canvas.width)
        circleX = 800/2;                 //placer bolden i midten
        circleY = 600/2;                 //placer bolden i midten
        circleSpeedY = -3                //hvis jeg vinder, så går bolden til højre, når den starter igen                
        circleSpeedX = 5;                //resetter boldens speed
        
        
    } if(circleX < 0){                   //hvis bolden er mindre eller lige med 0(canvas.width)
        circleX = 800/2;                 //placer bolden i midten
        circleY = 600/2;                 //placer bolden i midten
        circleSpeedY = 3;                //hvis jeg taber, så går bolden til venstre, når den starter igen
        circleSpeedX = -5;               //resetter boldens speed
    }
}

function drawEverything(){
    coloring(0,0,canvas.width, canvas.height, 'black');                 //baggrund farve
    canvasContext.fillStyle = 'red';                                    //hvid linje(player1 - venstre)
    canvasContext.fillRect(canvas.width-800,paddleY,10,PADDLE_HEIGHT);  //(stillingX, stillingY, bredde, højde)
    canvasContext.fillStyle = 'dodgerblue';                             //hvid linje(player2 - højre)
    canvasContext.fillRect(canvas.width-10,paddleY2,10,PADDLE_HEIGHT2); //(stillingX, stillingY, bredde, højde)
    canvasContext.fillStyle = 'white';                                  //hvid linje(I midten)                          
    canvasContext.fillRect(375,0,10,canvas.height);                     //(stillingX, stillingY, bredde, højde)
    circlefunc(circleX, circleY, 10, 'lime');                           //cirkel farve(bold)                
    canvasContext.fillText(humanScore, 175, 100);                       //human score
    canvasContext.fillText(aiScore, 575, 100);                          //ai score
}

function coloring(leftX, topY, width, height, drawColor){               //baggrund farve
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(0,0,canvas.width,canvas.height);

}

function circlefunc(centerX, centerY, radius, drawColor){               //cirkel farve(bold)
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}