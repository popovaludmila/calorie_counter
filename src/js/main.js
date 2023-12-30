import { Tetris } from "./tetris.js";
import { COLUMNS, ROWS, convertPositionToIndex } from "./utils.js";

let requestId;
let timeoutId;
const tetris = new Tetris();

const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');

const showCells = document.querySelectorAll('.show div');

initKeyDown();

moveDown();

function initKeyDown() {
    document.addEventListener('keydown', onKeyDown);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case ' ':
            dropDown();
            break;
        default:
            return;
    }
};

function moveDown() {
    tetris.moveDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver) {
        gameOver();
    }
};

function moveLeft() {
    tetris.moveLeft();
    draw();
};

function moveRight() {
    tetris.moveRight();
    draw();
}

function rotate() {
    tetris.rotate();
    draw();
}

function dropDown() {
    tetris.dropFigureDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver) {
        gameOver();
    }
};

function startLoop() {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

// В этой функции на каждом кадре заново рисуется поле с фигурками
function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayfield();
    drawFigure();
    drawHelpFigure();
}

function drawPlayfield() {
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (!tetris.field[row][column]) continue;
            const name = tetris.field[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}


// Функция отрисовки фигуры
function drawFigure() {

    const name = tetris.figure.figureName;
    // Размер фигурки матрицыf
    const figureSizeMatrix = tetris.figure.matrix.length;

    for (let row = 0; row < figureSizeMatrix; row++) {
        for (let col = 0; col < figureSizeMatrix; col++) {
            // Если проверямый элемент матрицы не равен 1, то проверяем дальше
            if (!tetris.figure.matrix[row][col]) continue;

            // Рассчитываем строку, на котором нужно нарисовать элемент фигуры
            // если элемент за пределами поля, то этот элемент не нужно рисовать
            if ((tetris.figure.startRow + row) < 0) continue;

            const cellIndex = convertPositionToIndex(tetris.figure.startRow + row, tetris.figure.startCol + col);
            cells[cellIndex].classList.add(name);
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
    showStatusOfGameOver();
}

function showStatusOfGameOver() {
    status.classList.remove('hidden');
}

function drawHelpFigure() {
    const figureSizeMatrix = tetris.figure.matrix.length;
    for (let row = 0; row < figureSizeMatrix; row++) {
        for (let column = 0; column < figureSizeMatrix; column++) {
            if (!tetris.figure.matrix[row][column]) continue;

            if ((tetris.figure.helpRow + row) < 0) continue;

            const cellIndex = convertPositionToIndex(tetris.figure.helpRow + row, tetris.figure.helpColumn + column);
            cells[cellIndex].classList.add('help');
        }
    }
}