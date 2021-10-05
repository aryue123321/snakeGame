import React from 'react';

import * as bg from '../BoardGen/BoardGenServie'
import './Board.scss'
import { useEffect, useState, useRef } from 'react';
import {AiOutlineArrowUp, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineArrowDown} from 'react-icons/ai'
const Board = () =>{
  const initBoardSize = 20
  const [board, setBoard] = useState(()=> bg.InitiBoard(initBoardSize))
  const [myInterval, setMyInterval] = useState<any>(null)
  const boardEl = useRef<HTMLDivElement>(null)
  const [running, setRunning] = useState(true)

  useEffect(()=>{
    if(running){
      console.log('load')
      const interval = setInterval(()=>{
        setBoard(board => bg.getNextBoard(board))
      }, 60)
      setMyInterval(interval);
      return (()=>clearInterval(interval))
    }
  }, [running])

 useEffect(()=>{
    if(!board.isValid){
      clearInterval(myInterval);
      setRunning(false);
      alert(`score : ${board.score}`)
    }
 }, [board, myInterval])

 useEffect(() => {
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
    else if (e.code === 'Space' && !running){
      reset();
    }
  }

  document.addEventListener('keydown', keyboardControlListener);
  return (()=> document.removeEventListener('keydown', keyboardControlListener));
// eslint-disable-next-line
}, [running])

  function update(direction: bg.Direction){
    if(running){
      console.log('update', running)
      setBoard(board => bg.updateDirection(board,direction ));
    }
  }
 
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

  function reset(){
    setBoard(bg.InitiBoard(initBoardSize))
    setRunning(true);

  }

  return <div className="game">
    <div>Score : {board.score}</div>
      <div>
        <button style={{width: 'calc(100% - 84px)',marginRight:0}} className="ui button" onClick={()=>update(bg.Direction.Up)}><AiOutlineArrowUp/></button>
      </div>
      <div style={{display:'flex', alignItems:'stretch'}}>
        <button style={{width:'38px', marginRight:0}} className="ui button" onClick={()=>update(bg.Direction.Left)}><AiOutlineArrowLeft/></button>
          <div className="game-board" ref={boardEl}>
            {board.cells.map((row, rowIndex)=>
            <div key={rowIndex} className="game-board-row">
              {row.map((col, colIndex) => <div key={colIndex} className={`game-board-cell ${getCellClass(col)}`} style={{opacity:getSnakeGradient(col, rowIndex, colIndex)}}></div>)}
            </div>
            )}
          </div>
        <button style={{width:'38px', marginRight:0}} className="ui button" onClick={()=>update(bg.Direction.Right)}><AiOutlineArrowRight/></button>
      </div>
      <div>
      <button style={{width:'calc(100% - 84px)',marginRight:0}} className="ui button" onClick={()=>update(bg.Direction.Down)}><AiOutlineArrowDown/></button>
      </div>
      


    
    {!running && <button className="ui button" onClick={()=> reset()} style={{marginTop:'10px'}}>Replay (Space)</button>}
  </div>
}

export default Board;