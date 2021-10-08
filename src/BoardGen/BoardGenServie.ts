
export enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

export enum BoardCellType{
  Empty = 0,
  Snake,
  Food
}

type Cell = {
  x: number,
  y: number
}



export type GameBoard = {
  cells: BoardCellType[][],
  snake: Cell[],
  food: Cell|null,
  direction: Direction,
  isValid: boolean,
  score: number
}

function getEmptyCells(cells: BoardCellType[][]): number[][]{
  const res = []
  for(var i = 0; i < cells.length; i++){
    for(var j = 0; j < cells[0].length; j++){
      if(cells[i][j] === BoardCellType.Empty){
        res.push([i, j])
      }
    }
  }
  return res;
}
function genNextFoodCell(cells: BoardCellType[][]): Cell|null{
  const emptyCells = getEmptyCells(cells)
  if(!emptyCells.length){
    return null
  }
  const nextFoodCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  return {
    x: nextFoodCell[0],
    y: nextFoodCell[1]
  }
}

function getNextCell(gameBoard: GameBoard, direction:Direction|null = null): Cell{
  const head = gameBoard.snake[0]
  const boardSize= gameBoard.cells.length;
  direction = direction ? direction : gameBoard.direction;
  switch (direction){
    case Direction.Right:
      return {
        x: head.x, 
        y: (head.y + 1) % boardSize
      }
    case Direction.Left:
      return {
        x: head.x, 
        y:(head.y - 1 + boardSize) % boardSize
      }
    case Direction.Down:
      return {
        x: (head.x + 1) % boardSize, 
        y: head.y
      }
    case Direction.Up:
      return {
        x: (head.x - 1 + boardSize) % boardSize, 
        y: head.y
      }
  }
}

export const getNextBoard = (gameBoard: GameBoard) : GameBoard =>{

  const nextHead = getNextCell(gameBoard);
  const tail = gameBoard.snake[gameBoard.snake.length-1]
  const newBoard: GameBoard = JSON.parse(JSON.stringify(gameBoard))

  switch(gameBoard.cells[nextHead.x][nextHead.y]){
    case BoardCellType.Empty:
      newBoard.snake.unshift(nextHead)
      newBoard.snake.pop();
      newBoard.cells[nextHead.x][nextHead.y] = BoardCellType.Snake
      newBoard.cells[tail.x][tail.y] = BoardCellType.Empty
      break;
    case BoardCellType.Food:
      newBoard.snake.unshift(nextHead)
      newBoard.cells[nextHead.x][nextHead.y] = BoardCellType.Snake
      const nextFoodCell = genNextFoodCell(newBoard.cells)
      if(nextFoodCell){
        newBoard.cells[nextFoodCell.x][nextFoodCell.y] = BoardCellType.Food
        newBoard.score++;
      }else{
        newBoard.isValid = false;
      }
      break;
    case BoardCellType.Snake:
      if(nextHead.x === tail.x && nextHead.y === tail.y){
        newBoard.snake.unshift(nextHead)
        newBoard.snake.pop();
      }
      else{
        newBoard.isValid = false
      }
      break;
  }

  return newBoard;
}

export const InitiBoard = (boardSize: number): GameBoard => {
  const cells = new Array(boardSize).fill(0).map(a=>new Array(boardSize).fill(BoardCellType.Empty));
  const snakeLength = Math.ceil(boardSize/2);
  const snakeCells: number[][] = [];
  for(var i = Math.ceil(snakeLength/2); i < snakeLength + Math.floor(snakeLength/2); i++){
    snakeCells.push([snakeLength,i])
  }
  const snake = snakeCells.map(s=>{return {x: s[0], y: s[1]}})
  for(const s of snakeCells){
    cells[s[0]][s[1]] = BoardCellType.Snake
  }
  const food = genNextFoodCell(cells);
  if(food){
    cells[food.x][food.y] = BoardCellType.Food;
  }
  return {
    cells,
    snake,
    food,
    direction: Direction.Left,
    isValid: true,
    score : 0
  }
}

export const updateDirection = (gameBoard: GameBoard, direction: Direction): GameBoard => {
  const newBoard: GameBoard = JSON.parse(JSON.stringify(gameBoard))
  if( 
    ((gameBoard.direction === Direction.Up || gameBoard.direction === Direction.Down) && (direction === Direction.Left || direction === Direction.Right)) ||
    ((gameBoard.direction === Direction.Left || gameBoard.direction === Direction.Right) && (direction === Direction.Up || direction === Direction.Down))
  )
  {
    const nextCell = getNextCell(newBoard, direction)
    const snakeSecondCell = newBoard.snake[1];
    if(nextCell.x !== snakeSecondCell.x || nextCell.y !== snakeSecondCell.y){
      newBoard.direction = direction;
      // return getNextBoard(newBoard);
    }
  }
  return newBoard
}
