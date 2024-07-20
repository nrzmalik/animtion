let currentXTranslation, currentYTranslation;
const stepSize = 5;
let EGGS = 0; // Counter for collected eggs
let GhostIntersect = 0;
let currentDirection = null;
let gameLoop = null;

function initializePacmanPosition() {
  var character = player.GetVar("character"); // Get the character type from Storyline
  let pacman;

  if (character === 'Boy') {
      pacman = document.querySelector('div[data-acc-text="boy"]');
  } else if (character === 'Girl') {
      pacman = document.querySelector('div[data-acc-text="Girl"]');
  } else {
      console.error(`Unknown character type: '${character}'`);
      return; // Exit if character type is unknown
  }
    const transform = window.getComputedStyle(pacman).transform;
    const matrix = new WebKitCSSMatrix(transform);
    currentXTranslation = matrix.m41;
    currentYTranslation = matrix.m42;
}

function movePacman() {
  var character = player.GetVar("character"); // Get the character type from Storyline
  let pacman;

  if (character === 'Boy') {
      pacman = document.querySelector('div[data-acc-text="boy"]');
  } else if (character === 'Girl') {
      pacman = document.querySelector('div[data-acc-text="Girl"]');
  } else {
      console.error(`Unknown character type: '${character}'`);
      return; // Exit if character type is unknown
  }
    const obstacles = document.querySelectorAll('div[data-acc-text="obstacle"]');
    const movementMap = {
        'left': [-stepSize, 0],
        'right': [stepSize, 0],
        'up': [0, -stepSize],
        'down': [0, stepSize]
    };

    if (currentDirection && movementMap.hasOwnProperty(currentDirection)) {
        const [xMovement, yMovement] = movementMap[currentDirection];
        let newXTranslation = currentXTranslation + xMovement;
        let newYTranslation = currentYTranslation + yMovement;

        const pacmanRect = new DOMRect(
            newXTranslation,
            newYTranslation,
            pacman.offsetWidth,
            pacman.offsetHeight
        );

        let collisionDetected = false;

        obstacles.forEach(obstacle => {
            const style = window.getComputedStyle(obstacle);
            const matrix = new WebKitCSSMatrix(style.transform);
            const obstacleRect = new DOMRect(
                matrix.m41, // x translation
                matrix.m42, // y translation
                obstacle.offsetWidth * matrix.a, // width * scale factor
                obstacle.offsetHeight * matrix.d  // height * scale factor
            );

            if (pacmanRect.intersects(obstacleRect)) {
                collisionDetected = true;
                return; // Break the loop if a collision is detected
            }
        });

        if (!collisionDetected) {
            currentXTranslation = newXTranslation;
            currentYTranslation = newYTranslation;
            pacman.style.transform = `translate(${currentXTranslation}px, ${currentYTranslation}px)`;
        } else {
            // Collision detected, handle it
            currentDirection = null;
            clearInterval(gameLoop);
            gameLoop = null;
        }
    }
    ghostIntersect(pacman);
}

function changeDirection(newDirection) {
    if (currentDirection !== newDirection) {
        currentDirection = newDirection;
        if (!gameLoop) {
            gameLoop = setInterval(movePacman, 50);
        }
    }
}

DOMRect.prototype.intersects = function(rect) {
    return !(rect.left > this.right || 
             rect.right < this.left || 
             rect.top > this.bottom ||
             rect.bottom < this.top);
};


//Ghost intersect Function
function ghostIntersect(pacman) {
    const eggs = document.querySelectorAll("[data-acc-text='Ghost']");
    const pacmanRect = new DOMRect(
        currentXTranslation,
        currentYTranslation,
        pacman.offsetWidth,
        pacman.offsetHeight
    );
  
    eggs.forEach(egg => {
        const style = window.getComputedStyle(egg);
        const matrix = new WebKitCSSMatrix(style.transform);
        const eggRect = new DOMRect(
            matrix.m41, // x translation from CSS transform
            matrix.m42, // y translation from CSS transform
            egg.offsetWidth * matrix.a, // width scaled by CSS transform
            egg.offsetHeight * matrix.d  // height scaled by CSS transform
        );
  
        if (pacmanRect.intersects(eggRect)) {
            egg.style.display = 'none';
            GhostIntersect += 1;
            setVar("GhostIntersect",GhostIntersect); 
        }
    });
  }