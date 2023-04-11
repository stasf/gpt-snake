const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 16;
const numRows = canvas.height / tileSize;
const numCols = canvas.width / tileSize;

const defaultGameSpeed = 100;
let gameSpeed = defaultGameSpeed;
let powerUpDuration = 0;


let snake = [
    { x: numCols / 2 * tileSize, y: numRows / 2 * tileSize }
];

let food = {
    x: Math.floor(Math.random() * numCols) * tileSize,
    y: Math.floor(Math.random() * numRows) * tileSize
};

let dx = tileSize;
let dy = 0;
let snakeColor = 'white';
let powerUp = {
    x: Math.floor(Math.random() * numCols) * tileSize,
    y: Math.floor(Math.random() * numRows) * tileSize
};



document.addEventListener('keydown', changeDirection);

const setColorButton = document.getElementById('setColorButton');
const snakeColorInput = document.getElementById('snakeColor');

setColorButton.addEventListener('click', () => {
    snakeColor = snakeColorInput.value;
});


const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const currentScoreElement = document.getElementById('currentScore');
const topScoreElement = document.getElementById('topScore');
let gameStarted = false;
let currentScore = 0;
let topScore = 0;

startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startButton.disabled = true;
        main();
    }
});

resetButton.addEventListener('click', () => {
    resetGame();
});

function changeDirection(event) {
    const LEFT_KEY = 'ArrowLeft';
    const RIGHT_KEY = 'ArrowRight';
    const UP_KEY = 'ArrowUp';
    const DOWN_KEY = 'ArrowDown';

    if (!gameStarted) {
        gameStarted = true;
        startButton.disabled = true;
        main();
    }

    if (event.key === LEFT_KEY && dx !== tileSize) {
        dx = -tileSize;
        dy = 0;
    }

    if (event.key === RIGHT_KEY && dx !== -tileSize) {
        dx = tileSize;
        dy = 0;
    }

    if (event.key === UP_KEY && dy !== tileSize) {
        dx = 0;
        dy = -tileSize;
    }

    if (event.key === DOWN_KEY && dy !== -tileSize) {
        dx = 0;
        dy = tileSize;
    }
}

function main() {
    if (hasGameEnded()) {
        resetGame();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        drawPowerUp();
        moveSnake();
        drawSnake();

        if (powerUpDuration > 0) {
            powerUpDuration--;
            if (powerUpDuration === 0) {
                gameSpeed = defaultGameSpeed;
            }
        }

        main();
    }, gameSpeed);
}


function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPowerUp() {
    //ctx.fillStyle = 'blue';
    //ctx.fillRect(powerUp.x, powerUp.y, tileSize, tileSize);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

function drawSnake() {
    ctx.fillStyle = snakeColor;

    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tileSize, tileSize);
    }
}


function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        // Handle food
        currentScore++;
        currentScoreElement.textContent = currentScore;
        if (currentScore > topScore) {
            topScore = currentScore;
            topScoreElement.textContent = topScore;
        }
        food.x = Math.floor(Math.random() * numCols) * tileSize;
        food.y = Math.floor(Math.random() * numRows) * tileSize;
    } else if (head.x === powerUp.x && head.y === powerUp.y) {
        // Handle power-up
        gameSpeed = defaultGameSpeed * 2;
        powerUpDuration = 50;
        powerUp.x = Math.floor(Math.random() * numCols) * tileSize;
        powerUp.y = Math.floor(Math.random() * numRows) * tileSize;
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function resetGame() {
    gameStarted = false;
    startButton.disabled = false;
    snake = [
        { x: numCols / 2 * tileSize, y: numRows / 2 * tileSize }
    ];
    food = {
        x: Math.floor(Math.random() * numCols) * tileSize,
        y: Math.floor(Math.random() * numRows) * tileSize
    };
    dx = tileSize;
    dy = 0;
    currentScore = 0;
    currentScoreElement.textContent = currentScore;
    clearCanvas();
    drawSnake();
    drawFood();
}
