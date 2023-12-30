import { COLUMNS, FIGURES, FIGURE_NAMES_ARRAY, ROWS, getRandomEl, rotateFigureMatrix } from "./utils.js";

export class Tetris {
    constructor() {
        this.field; // пустое игровок поле
        this.figure;
        this.isGameOver = false;
        this.score = 0;
        this.init();
    }

    init() {
        this.generatePlayfield(); // вызываем генерацию игрового поля
        this.generateFigure();
    }

    // генерируем пустое поле размером 20*10 и заполняем его 0
    generatePlayfield() {
        this.field = new Array(ROWS).fill().map(() => new Array(COLUMNS).fill(0));
    }

    generateFigure() {
        // достаем случайный элемент из массива названия фигурок
        const figureName = getRandomEl(FIGURE_NAMES_ARRAY);
        const matrix = FIGURES[figureName];
        // Номер колонки начала рисовки фигуры
        const startCol = COLUMNS / 2 - Math.floor(matrix.length / 2);
        // Номер строки начала рисовки фигуры
        const startRow = -2;

        this.figure = {
            figureName,
            matrix,
            startCol,
            startRow,
            helpColumn: startCol,
            helpRow: startRow
        }

        this.calculateHelpPosition();
    }

    moveDown() {
        this.figure.startRow += 1;
        if (!this.isValid()) {
            this.figure.startRow -= 1;
            this.placeFigure(); // место фигуры при достижении низа поля
        }
    }

    moveLeft() {
        this.figure.startCol -= 1;
        if (!this.isValid()) {
            this.figure.startCol += 1;
        } else {
            this.calculateHelpPosition()
        }
    }

    moveRight() {
        this.figure.startCol += 1;
        if (!this.isValid()) {
            this.figure.startCol -= 1;
        } else {
            this.calculateHelpPosition()
        }
    }

    rotate() {
        const lastMatrix = this.figure.matrix;
        const rotateMatrix = rotateFigureMatrix(this.figure.matrix);
        this.figure.matrix = rotateMatrix;
        if (!this.isValid()) {
            this.figure.matrix = lastMatrix;
        } else {
            this.calculateHelpPosition()
        }
    }

    dropFigureDown() {
        this.figure.startRow = this.figure.helpRow;
        this.placeFigure()
    }

    isValid() {
        const matrixSize = this.figure.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (!this.figure.matrix[row][column]) continue;
                if (this.isOutsideOfGameBoard(row, column)) return false;
                if (this.isTouch(row, column)) return false;
            }
        }
        return true;
    }

    isTouch(row, column) {
        return this.field[this.figure.startRow + row]?.[this.figure.startCol + column];
    }

    isOutsideOfGameBoard(row, column) {
        return this.figure.startCol + column < 0 ||
            this.figure.startCol + column >= COLUMNS ||
            this.figure.startRow + row >= this.field.length;
    }

    placeFigure() {
        const matrixSize = this.figure.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (!this.figure.matrix[row][column]) continue;

                if (this.isOutsideOfTopGameBoard(row)) {
                    this.isGameOver = true;
                    return;
                }
                this.field[this.figure.startRow + row][this.figure.startCol + column] = this.figure.figureName;
            }
        }

        this.filledRows();
        this.score += 10;
        this.generateFigure();
    }

    calculateScore() {
        return this.score;
    }

    isOutsideOfTopGameBoard(row) {
        return this.figure.startRow + row < 0;
    }

    filledRows() {
        const filledLines = this.findFilledRows();
        if (filledLines.length > 0) {
            this.score += 100;
        }
        this.removeFilledRows(filledLines);    
    }

    removeFilledRows(filledRows) {
        filledRows.forEach(row => {
            this.dropRowsAbove(row);
        });
    }

    dropRowsAbove(rowToDelete) {
        for (let row = rowToDelete; row > 0; row--) {
            this.field[row] = this.field[row - 1];
        }
        this.field[0] = new Array(COLUMNS).fill(0);
    }

    // находим заполненные линии и возращаем массив номеров заполненных строк
    findFilledRows() {
        const filledRows = [];
        for (let row = 0; row < ROWS; row++) {
            if (this.field[row].every(cell => Boolean(cell))) {
                filledRows.push(row);
            }
        }

        return filledRows;
    }

    calculateHelpPosition() {
        const figureRow = this.figure.startRow;
        this.figure.startRow++;

        while (this.isValid()) {
            this.figure.startRow++;
        }
        this.figure.helpRow = this.figure.startRow - 1;
        this.figure.helpColumn = this.figure.startCol;
        this.figure.startRow = figureRow;
    }
}