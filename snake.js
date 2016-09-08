/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
  backBuffer.width = frontBuffer.width;
  backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var updateGame = true;

//Score
var score = 0;
var cuts = true;

//Snake Array
var link = {x:(backBuffer.width/2), y:(backBuffer.height/2),w:15,h:15};
var snake = new Array(link);
var links = snake.length;
var currentDirection;
var previousX = 0;
var previousY = 0;



//Apple
var numApples = Math.random()*5+3;
var apples = [{x:0,y:0,w:15,h:15}];
var Apx = 0;
var Apy = 0;
for (y=0;y<numApples;y++)
{
  Apx = Math.random()*frontBuffer.width;
  Apy = Math.random()*frontBuffer.height;
  apples[y] = {x:Apx,y:Apy,w:15,h:15};
}
var apple = new Image();
apple.src = "pics/Apple3.png";

// Spawns a new apple
function newApples(deleteAp)
{
  console.log("NEW APPLE");
  Apx = Math.random()*frontBuffer.width;
  Apy = Math.random()*frontBuffer.height;
  apples[deleteAp] = {x:Apx,y:Apy,w:20,h:20};
  score++;
}

//Background
var bground = new Image();
bground.src = "pics/background.png";

//backCtx.drawImage(bground,0,0);

//new
var x = 0;
var y = 0;
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}


// This function updates the snake by adding on a new link as the head and removing the last link
function updateSnake(plusX,plusY,cut)
{
  previousX = plusX;
  previousY = plusY;
  //console.log("updating snake");
  var newX = snake[0].x + plusX;
  var newY = snake[0].y + plusY;
  var u = snake.unshift({x:newX,y:newY,w:15,h:15});
  if (cut == true)
  { snake = snake.slice(0,snake.length-1);}
  cuts = true;
}



// This function draws the snake back to front so that the head is correct.
function drawSnake()
{
  for (i=snake.length-1;i>=0;i--)
  {
    var temp = snake[i];
    frontCtx.fillStyle = "Black";
    frontCtx.fillRect(temp.x,temp.y,15,15);

    frontCtx.strokeStyle = "Gold";
    frontCtx.lineWidth = 2;
    frontCtx.strokeRect(temp.x,temp.y,15,15);
  }
}

// Identifies the directional key being pressed
window.onkeydown = function(event) {
  event.preventDefault();
  switch(event.keyCode){
    // up = 38 w = 87
    // left = 37 a = 65
    // right = 39 d = 68
    // down = 40 s = 83
    case 38:
    case 87:
      input.up = true;
      break;
    case 37:
    case 65:
      input.left = true;
      break;
    case 39:
    case 68:
      input.right = true;
      break;
    case 40:
    case 83:
      input.down = true;
      break;
  }
}


// Identifies key up
window.onkeyup = function(event) {
  event.preventDefault();
  switch(event.keyCode){
    // up = 38 w = 87
    // left = 37 a = 65
    // right = 39 d = 68
    // down = 40 s = 83
    case 38:
    case 87:
      input.up = false;
      break;
    case 37:
    case 65:
      input.left = false;
      break;
    case 39:
    case 68:
      input.right = false;
      break;
    case 40:
    case 83:
      input.down = false;
      break;
  }
}


/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;


  if (updateGame) update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  // In Render()

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  frontCtx.clearRect(0,0,frontBuffer.width,frontBuffer.height);
  // TODO: Spawn an apple periodically
  // Handled in render

  // TODO: Grow the snake periodically
      // I will do this when the snake eats an apple

  // TODO: Move the snake
  for (l=1;l<snake.length;l++)
  {
    if (snake[0].x == snake[l].x && snake[0].y == snake[l].y) {updateGame = false;}
  }

  if(input.up && currentDirection != "down")
  { currentDirection = "up";
    updateSnake(0,-5,cuts);}
  else if(input.down && currentDirection != "up")
  { currentDirection = "down";
    updateSnake(0,5,cuts);}
  else if(input.left && currentDirection != "right")
  { currentDirection = "left";
    updateSnake(-5,0,cuts);}
  else if(input.right && currentDirection != "left")
  { currentDirection = "right";
    updateSnake(5,0,cuts);}
  else {
    updateSnake(previousX,previousY,cuts);
  }
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  if ((snake[0].x < 0)||((snake[0].x)+(snake[0].w) > backBuffer.width)||(snake[0].y < 0)||((snake[0].y)+(snake[0].h) > backBuffer.height))
  {
    updateGame = false;
  }

  // TODO: Determine if the snake has eaten an apple
  // If() statement adopted and modified from  --  https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  // ^ This is because my brain was running slowly that day.. Logic was too hard.
  for (n=0;n<apples.length;n++)
  {
    if (snake[0].x < apples[n].x + apples[n].w &&
        snake[0].x + snake[0].w > apples[n].x &&
        snake[0].y < apples[n].y + apples[n].h &&
        snake[0].h + snake[0].y > apples[n].y)
    {
      newApples(n);
      cuts = false;

    }
  }

  // TODO: Determine if the snake has eaten its tail
  // Handled in movement

  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

  // Score


}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  frontCtx.drawImage(backBuffer, 0, 0);
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.drawImage(bground,0,0);

  // TODO: Draw the game objects into the backBuffer
  // background

  // apples
  for (p=0;p<apples.length;p++)
  {
    frontCtx.drawImage(apple,apples[p].x,apples[p].y);
  }
  // score
  backCtx.font = "20px Cambria";
  backCtx.fillStyle = "#66ff66";
  backCtx.fillText("SCORE = " + score, 10,20);
  // snake
  drawSnake();

  if (!updateGame)
  {
    frontCtx.font = "50px Cambria";
    frontCtx.fillStyle = "#ffffff";
    frontCtx.fillText("GAME OVER! Your score is " + score, 60,backBuffer.height/2);
  }


}

/* Launch the game */
window.requestAnimationFrame(loop);
