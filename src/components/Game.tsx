import React from 'react';

import * as bg from '../BoardGen/BoardGenServie'
import './Game.scss'
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Zoom } from '@mui/material';

import ScoreForm from './ScoreForm';

export type GameProps = {
  setScore: React.Dispatch<React.SetStateAction<number>>
}

const Game = ({setScore}:GameProps ) =>{
  const initBoardSize = 20
  const [board, setBoard] = useState(()=> bg.InitiBoard(initBoardSize))
  const [myInterval, setMyInterval] = useState<any>(null)
  const scoreSpanEl = useRef<HTMLSpanElement>(null)

  const [gameOver, setGameOver] = useState(false);

  const [watchingDead, setwatchingDead] = useState(false);

  const gotoLeaderboard = useCallback(()=>{
    setScore(board.score)
    setwatchingDead(true);
  }, [setScore, board.score])

  // load interval 
  useEffect(()=>{
    if(!gameOver){
      const interval = setInterval(()=>{
        setBoard(board => bg.getNextBoard(board))
      }, 60)
      setMyInterval(interval);
      return (()=>clearInterval(interval))
    }
  }, [gameOver])

  // stop interval when gameover
 useEffect(()=>{
    if(!board.isValid){
      clearInterval(myInterval);
      setGameOver(true);
    }
 }, [board.isValid, myInterval])

 // game keyboard controls
 useEffect(() => {

  function update(direction: bg.Direction){
    if(!gameOver){
      setBoard(board => bg.updateDirection(board,direction ));
    }
  }

  function keyboardControlListener(e:KeyboardEvent){
    console.log(e.code)
    if(e.code === 'ArrowDown' || e.code === 'KeyS'){
      update(bg.Direction.Down)
    }
    else if(e.code === 'ArrowUp' || e.code === 'KeyW'){
      update(bg.Direction.Up)
    }
    else if(e.code === 'ArrowRight' || e.code === 'KeyD'){
      update(bg.Direction.Right)
    }
    else if(e.code === 'ArrowLeft' || e.code === 'KeyA'){
      update(bg.Direction.Left)
    }
  }

  if(!gameOver){ 
    document.addEventListener('keydown', keyboardControlListener);
    return (()=> document.removeEventListener('keydown', keyboardControlListener));
  }
 
}, [gameOver])

useEffect(()=>{
  function keyboardControlListener(e:KeyboardEvent){
    if (e.code === 'Enter' && gameOver){
      gotoLeaderboard()
    }
  }
  if(gameOver){ 
    document.addEventListener('keyup', keyboardControlListener);
    return (()=> document.removeEventListener('keyup', keyboardControlListener));
  }
   
}, [gameOver, gotoLeaderboard])

useEffect(()=>{
  if(board.score > 0){
    scoreSpanEl.current?.classList.add("number")
    const i = setTimeout(() => {
      scoreSpanEl.current?.classList.remove("number")
    }, 1000);

    return (()=> clearTimeout(i))
  }
}, [board.score])

  
 
  function getCellClass(cellType: bg.BoardCellType):string{
    switch(cellType){
      case bg.BoardCellType.Empty:
        return 'empty';
      case bg.BoardCellType.Food:
        return 'food';
      case bg.BoardCellType.Snake:
        return 'snake';
    }
  }
  function getSnakeGradient(cellType: bg.BoardCellType, x:number, y:number):number{
    if(cellType !== bg.BoardCellType.Snake)
      return 1;
    const index = board.snake.findIndex(c=>c.x === x && c.y === y)
    return Math.max( (board.snake.length - index + 3)/(board.snake.length+3), 0.5)
  }



  function renderGameBoard(){
    return (<>
    <div className="score"><span ref={scoreSpanEl}>{board.score}</span></div>
      <div className={gameOver ? "game-over game-board" : "game-board"}>
        {board.cells.map((row, rowIndex)=>
        <div key={rowIndex} className="game-board-row">
          {row.map((col, colIndex) => <div key={colIndex} className={`game-board-cell ${getCellClass(col)}`} style={{opacity:getSnakeGradient(col, rowIndex, colIndex)}}></div>)}
        </div>
        )}
      </div>
    <Zoom in={gameOver} timeout={{enter: 2000}}>
      <Button variant="contained" onClick={()=> gotoLeaderboard()}>Continue [Enter] </Button>
    </Zoom>
    </>)
  }

  return <div className="game">
    {watchingDead ? <ScoreForm score={board.score}></ScoreForm> : renderGameBoard()}
  </div>

}

export default Game;