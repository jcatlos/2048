let btn = document.getElementById("startButton");
let rng = document.getElementById("rng");
let output = document.getElementById("errors");
let score = document.getElementById("score");

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const gameFont = "30px Roboto";

let SCORE = 0;

//Rozmery hernej plochy
let WIDTH = 1; 
let HEIGHT = 1;

let SPAWNS = [2, 4];
                        
let ROW_WIDTH = 70; //Vyska riadku
let COL_WIDTH = 70; //Sirka stlpca
let SPACE = 10; //Priestor medzi polickami

//GAME obsahuje hernu plochu
let GAME = [];
for(var i=0; i<HEIGHT; i++){
  var rowGen = [];
  for(var j=0; j<WIDTH; j++){
    rowGen.push(0);
  }
  GAME.push(rowGen);
}

//Farebne kody k jednotlivym cislam
const COLOURS = new Map([[0, '#999999'], [2, '#b3b3b3'], [4, '#f80c12'], 
                        [8, '#ff3311'], [16, '#ff6644'], [32, '#ff9933'],
                        [64, '#feae2d'], [128, '#ff9933'], [256, '#feae2d'],
                        [512, '#ccbb33'], [1024, '#d0c310'], [2048, 'aacc22']]);

//Funkcia na vypisanie spravy na stranku (Nepodstatna pre beh hry)
function print(out){
  msg = document.createElement("p");
  msg.textContent = out.toString();
  output.appendChild(msg);
}

function random(num){
  return Math.floor(Math.random()*num);
}

function arrayComp2D(array1, array2){
  if(array1.length !== array2.length){
    return false;
  }
  else{
    for(var i=0; i<array1.length; i++){
      if(array1[i].length !== array2[i].length){
        return false;
      }
      else{
        for(var j=0; j<array1[i].length; j++){
          if(array1[i][j]!==array2[i][j]){
            return false;
          }
        }
      }
    }
    return true;
  }
}
 
//Zapnutie novej hry - Zmena rozmerov a resetovanie premennych
function newGame(){
  widthIn = document.getElementById("widthInput");
  heightIn = document.getElementById("heightInput");

  WIDTH = widthIn.value;
  HEIGHT = heightIn.value;

  canvas.height = (ROW_WIDTH + SPACE) * HEIGHT + SPACE;
  canvas.width = (COL_WIDTH + SPACE) * WIDTH + SPACE;

  SCORE = 0;
  
  GAME = [];
  for(var i=0; i<HEIGHT; i++){
    var rowGen = [];
    for(var j=0; j<WIDTH; j++){
      rowGen.push(0);
    }
    GAME.push(rowGen);
  }
  add();
  showGame();
}

//Pridanie nahodnej hodnoty z pola SPAWNS na hernu plochu

function add(){
  var free = [];
  for(var i=0; i<HEIGHT; i++){
    for(var j=0; j<WIDTH; j++){
      if(GAME[i][j] == 0){
        free.push([i, j]);
      }
    }
  }
  var fieldIndex = random(free.length);
  var added = SPAWNS[random(2)];
  GAME[free[fieldIndex][0]] [free[fieldIndex][1]] = added;
}

//Vykreslenie herneho pola na canvas

function showGame(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#d9d9d9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = gameFont;
  for(var i=0; i<HEIGHT; i++){
    for(var j=0; j<WIDTH; j++){
      var x = j * (COL_WIDTH+SPACE) + COL_WIDTH/2 + SPACE; 
      var y = i * (ROW_WIDTH+SPACE) + ROW_WIDTH/2 + SPACE;
      ctx.fillStyle = COLOURS.get(GAME[i][j]);
      ctx.fillRect(x-COL_WIDTH/2, y-ROW_WIDTH/2, COL_WIDTH, ROW_WIDTH);
      ctx.fillStyle = 'white';
      ctx.fillText(GAME[i][j].toString(), x, y);
    }
  }
}

//Spojenie riadku dolava

function joinRow(row){
  var len = row.length;
  var rowGen = [];
  for(var i=0; i<row.length; i++){
    if(row[i] != 0){
      rowGen.push(row[i]);
    }
  }
  row = [];
  rowGen.push(0);
  for(var i=0; i<rowGen.length; i++){
    if(rowGen[i]==rowGen[i+1]){
      SCORE += rowGen[i]*2;
      score.textContent = SCORE.toString();
      row.push(rowGen[i]*2);
      i++;
    }
    else{
      if(rowGen[i]!=0){
        row.push(rowGen[i]);
      }
    }
  }
  for(var i=len-row.length; i>0; i--){
    row.push(0);
  }
  return(row);
}

//Funkcia, ktora sa spusti, ked hrac stlaci klavesu
//Pretvori riadky/stlpce tak, aby sa spajali dolava
    //Spoji ich a ulozi do spravneho poradia

function move(event){
  var lastGame = [];
  for(var i=0; i<GAME.length; i++){
    lastGame.push(GAME[i].slice());
  }
  if(event.keyCode == 37){
    for(var i=0; i<GAME.length; i++){
      GAME[i] = joinRow(GAME[i]);
    }
  }
  else if(event.keyCode == 38){
    for(var i=0; i<GAME[0].length; i++){
      var column = [];
      for(var j=0; j<GAME.length; j++){
        column.push(GAME[j][i]);
      }
      column = joinRow(column);
      for(var j=0; j<column.length; j++){
        GAME[j][i] = column[j];
      }
    }
  }
  else if(event.keyCode == 39){
    for(var i=0; i<GAME.length; i++){
      var row = [];
      for(var j=GAME[i].length-1; j>=0; j--){
        row.push(GAME[i][j]);
      }
      row = joinRow(row);
      GAME[i] = [];
      for(var j=row.length-1; j>=0; j--){
        GAME[i].push(row[j]);
      }
    }
  }
  else if(event.keyCode == 40){
    for(var i=0; i<GAME[0].length; i++){
      var column = [];
      for(var j=GAME.length-1; j>=0; j--){
        column.push(GAME[j][i]);
      }
      column = joinRow(column);
      for(var j=column.length-1; j>=0; j--){
        GAME[j][i] = column[column.length-1-j];
      }
    }
  }
  if(!arrayComp2D(lastGame, GAME)){
    add();
    showGame();
  }
}

function randomMove(){
  var addition = random(4);
  var generateMove = new KeyboardEvent('keypress',{
    keyCode: 37+addition
  });
  document.dispatchEvent(generateMove);
}

rng.addEventListener('click', randomMove)
btn.addEventListener('click', newGame);
document.addEventListener('keypress', move);
