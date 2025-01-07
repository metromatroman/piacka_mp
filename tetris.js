function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

// získat další tetromino v sekvenci
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  // I a O začínají ve středu, ostatní začínají vlevo-střed
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I začíná na řádku 21 (-1), ostatní začínají na řádku 22 (-2)
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,      // název kusu (L, O, atd.)
    matrix: matrix,  // aktuální matice rotace
    row: row,        // aktuální řádek (začíná mimo obrazovku)
    col: col         // aktuální sloupec
  };
}

// otočit NxN matici o 90 stupňů
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

// zkontrolovat, zda je nová matice/řádek/sloupec platný
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // mimo hranice hry
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // koliduje s jiným kusem
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}

// umístit tetromino na hrací pole
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // konec hry, pokud je kus mimo obrazovku
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // zkontrolovat smazání řádků odspodu nahoru
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {

      // spustit všechny řádky nad tímto
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
    }
    else {
      row--;
    }
  }

  tetromino = getNextTetromino();
}

// zobrazit obrazovku konce hry
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;

  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('KONEC HRY!', canvas.width / 2, canvas.height / 2);
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];

// udržovat přehled o tom, co je v každé buňce hry pomocí 2D pole
// hrací pole tetris je 10x20, s několika řádky mimo obrazovku
const playfield = [];

// naplnit prázdný stav
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// jak nakreslit každé tetromino
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

// barva každého tetromina
const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;  // sledovat animační rámec, abychom ho mohli zrušit
let gameOver = false;

// herní smyčka
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // nakreslit hrací pole
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // kreslení o 1 px menší než mřížka vytváří efekt mřížky
        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }

  // nakreslit aktivní tetromino
  if (tetromino) {

    // tetromino padá každých 35 snímků
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // umístit kus, pokud narazí na cokoliv
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // kreslení o 1 px menší než mřížka vytváří efekt mřížky
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
}

// poslouchat události klávesnice k pohybu aktivního tetromina
document.addEventListener('keydown', function(e) {
  if (gameOver) return;

  // klávesy vlevo a vpravo (pohyb)
  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37
      ? tetromino.col - 1
      : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // klávesa šipka nahoru (otočit)
  if (e.which === 38) {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // klávesa šipka dolů (pád)
  if(e.which === 40) {
    const row = tetromino.row + 1;

    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;

      placeTetromino();
      return;
    }

    tetromino.row = row;
  }
});

// začít hru
rAF = requestAnimationFrame(loop);