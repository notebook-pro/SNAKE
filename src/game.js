const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
// Начальная змейка из 3 блоков, движется вправо
let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];
let direction = { x: 1, y: 0 }; // Start moving right
let food = { x: 100, y: 100 };
let gameOver = false;

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function draw() {
    ctx.fillStyle = '#013220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Еда — чуть светлее, но тоже тёмно-зелёная
    drawRect(food.x, food.y, '#0b3d18');

    snake.forEach((segment, i) => {
    if (i === 0) {
        // Голова
        drawRect(segment.x, segment.y, '#000000');

        // Рот (показывается только если еда в радиусе 2 блоков и в направлении движения)
        const dx = food.x - segment.x;
        const dy = food.y - segment.y;
        let mouthShown = false; // <-- переменная объявляется здесь!

        if (
            (direction.x === 1 && dx > 0 && dx <= 2 * gridSize && dy === 0)
        ) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(segment.x + gridSize, segment.y - gridSize, gridSize, gridSize); // сверху
            ctx.fillRect(segment.x + gridSize, segment.y + gridSize, gridSize, gridSize); // снизу
            mouthShown = true;
        } else if (
            (direction.x === -1 && dx < 0 && dx >= -2 * gridSize && dy === 0)
        ) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(segment.x - gridSize, segment.y - gridSize, gridSize, gridSize); // сверху
            ctx.fillRect(segment.x - gridSize, segment.y + gridSize, gridSize, gridSize); // снизу
            mouthShown = true;
        } else if (
            (direction.y === 1 && dy > 0 && dy <= 2 * gridSize && dx === 0)
        ) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(segment.x - gridSize, segment.y + gridSize, gridSize, gridSize); // слева
            ctx.fillRect(segment.x + gridSize, segment.y + gridSize, gridSize, gridSize); // справа
            mouthShown = true;
        } else if (
            (direction.y === -1 && dy < 0 && dy >= -2 * gridSize && dx === 0)
        ) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(segment.x - gridSize, segment.y - gridSize, gridSize, gridSize); // слева
            ctx.fillRect(segment.x + gridSize, segment.y - gridSize, gridSize, gridSize); // справа
            mouthShown = true;
        }

        // Глаза (тёмно-зелёные) — только если рот не показывается
        if (!mouthShown) {
            if (!gameOver) {
                ctx.fillStyle = '#145a32';
                if (direction.x === 1) { // вправо
                    ctx.fillRect(segment.x + gridSize - 6, segment.y + 4, 4, 4);
                    ctx.fillRect(segment.x + gridSize - 6, segment.y + gridSize - 8, 4, 4);
                } else if (direction.x === -1) { // влево
                    ctx.fillRect(segment.x + 2, segment.y + 4, 4, 4);
                    ctx.fillRect(segment.x + 2, segment.y + gridSize - 8, 4, 4);
                } else if (direction.y === 1) { // вниз
                    ctx.fillRect(segment.x + 4, segment.y + gridSize - 6, 4, 4);
                    ctx.fillRect(segment.x + gridSize - 8, segment.y + gridSize - 6, 4, 4);
                } else if (direction.y === -1) { // вверх
                    ctx.fillRect(segment.x + 4, segment.y + 2, 4, 4);
                    ctx.fillRect(segment.x + gridSize - 8, segment.y + 2, 4, 4);
                }
            } else {
                // Крестики вместо глаз
                ctx.strokeStyle = '#145a32';
                ctx.lineWidth = 2;
                // Левый крестик
                ctx.beginPath();
                ctx.moveTo(segment.x + 4, segment.y + 4);
                ctx.lineTo(segment.x + 8, segment.y + 8);
                ctx.moveTo(segment.x + 8, segment.y + 4);
                ctx.lineTo(segment.x + 4, segment.y + 8);
                ctx.stroke();
                // Правый крестик
                ctx.beginPath();
                ctx.moveTo(segment.x + gridSize - 8, segment.y + 4);
                ctx.lineTo(segment.x + gridSize - 4, segment.y + 8);
                ctx.moveTo(segment.x + gridSize - 4, segment.y + 4);
                ctx.lineTo(segment.x + gridSize - 8, segment.y + 8);
                ctx.stroke();
            }
        }
    } else {
        drawRect(segment.x, segment.y, '#000000');
    }
    // Показываем Game Over и очки, если игра окончена
    if (gameOver) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "bold 20px Arial";
        ctx.fillText("Score: " + (snake.length - 3), canvas.width / 2, canvas.height / 2 + 24);
    }
    });
}

function moveSnake() {
    let head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

    // Переход на другую сторону при выходе за границу
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver = true;
        // alert('Game Over!'); // Удалено
        // setTimeout(() => document.location.reload(), 2000); // Удалено
        return;
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    // Avoid placing food on the snake
    if (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
        placeFood();
    }
}

function setDir(dir) {
    if (gameOver) return;
    if (dir === 'up' && direction.y === 0) direction = { x: 0, y: -1 };
    if (dir === 'down' && direction.y === 0) direction = { x: 0, y: 1 };
    if (dir === 'left' && direction.x === 0) direction = { x: -1, y: 0 };
    if (dir === 'right' && direction.x === 0) direction = { x: 1, y: 0 };
}

document.addEventListener('keydown', e => {
    if (gameOver) {
        // Перезапуск игры при любом нажатии стрелки после Game Over
        if (
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight'
        ) {
            // Сброс состояния игры
            snake = [
                { x: 200, y: 200 },
                { x: 180, y: 200 },
                { x: 160, y: 200 }
            ];
            direction = { x: 1, y: 0 };
            food = { x: 100, y: 100 };
            gameOver = false;
            placeFood();
            gameLoop();
            return;
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

function gameLoop() {
    moveSnake();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 350);
    }
}

gameLoop();