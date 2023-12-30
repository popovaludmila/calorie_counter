export const ROWS = 20;
export const COLUMNS = 10;

export const FIGURE_NAMES_ARRAY = ['I', 'O', 'L', 'J', 'S', 'Z', 'T'];
export const FIGURES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    'J': [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

export const getRandomEl = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

export const convertPositionToIndex = (row, col) => {
    return row * COLUMNS + col;
};

export const rotateFigureMatrix = (matrix) => {
    const sizeMatrix = matrix.length;
    const rotatedMatrix = [];
    for(let i = 0; i< sizeMatrix; i++) {
        rotatedMatrix[i] = [];
        for(let j = 0; j< sizeMatrix; j++) {
            rotatedMatrix[i][j] = matrix[sizeMatrix - j - 1][i];
        }
    }
    return rotatedMatrix;
};