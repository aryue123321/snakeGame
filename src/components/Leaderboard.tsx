import React from "react";
import { Button, CircularProgress, Collapse, Fade } from "@mui/material";
import './Leaderboard.scss'
import {useHistory} from 'react-router-dom'

import { useState, useEffect, useRef } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Paper from '@mui/material/Paper';
import { useParams  } from 'react-router-dom'


type LeaderBoardProps = {
  // setIsRunning: React.Dispatch<React.SetStateAction<boolean>>,
  score:number
}

type ScoreType = {
  id: string,
  score: number,
  name: string
}

const collapseTimelapsed = 1500;

const LeaderBoard = ({score}: LeaderBoardProps) => {
  const history = useHistory()

  function playAgain(){
    history.push("/")
  }

  const [scores, setScores] = useState<ScoreType[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const highlightRow = useRef<HTMLTableRowElement>(null)

  const {highlightId} = useParams<any>()
  
  console.log(highlightId)
  
  useEffect(()=>{
    function keyboardControlListener(e:KeyboardEvent){
      if (e.code === 'Enter'){
        playAgain()
      }
    }

      document.addEventListener('keyup', keyboardControlListener);
      return (()=> document.removeEventListener('keyup', keyboardControlListener));
    
    //eslint-disable-next-line
  }, [])

  useEffect(()=>{
    if(highlightRow !== null && highlightRow.current !== null){

      highlightRow.current.scrollIntoView({block: "center", behavior: "smooth"});
    }
  }, [scores])

  useEffect(()=>{
    const scores:ScoreType[] = []
    const getData = async() => {
          const querySnapshot = await getDocs(collection(db, "Leaderboard"));
          querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          scores.push({
            id:doc.id, 
            ...doc.data()
          } as ScoreType)
          });

          scores.sort((a, b) => {
            if(a.score !== b.score)
              return b.score - a.score
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1
          })

          setScores(scores);
          setIsLoading(false);
          console.log(scores)
      }
    getData();
  }, [])

  function isHighlight(id: string){
    return highlightId === id ? {backgroundColor:'lightblue'} : {}
  }

  const renderTbody = ()=>{

    return  <TableContainer component={Paper} sx={{maxHeight: '600px', overflowY:'scroll'}}>
        <Table  aria-label="simple table">
          <TableHead sx={{position: 'sticky', top: 0, backgroundColor:"#1976d2"}}>
            <TableRow>
              <TableCell sx={{width:'10%',color:"white" }}>Rank</TableCell>
              <TableCell align="center" sx={{width:'10%',color:"white" }}>Name</TableCell>
              <TableCell  align="right" sx={{width:'10%',color:"white" }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0}, ...isHighlight(row.id) }}
                ref={highlightId === row.id ? highlightRow : null}
              >
                <TableCell component="th" scope="row">
                  {rowIndex+1}
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
  }

  return <div className="leader-board">
          <h2>LeaderBoard</h2>
          <Fade in={!isLoading} timeout={collapseTimelapsed}>
            <div>
              {renderTbody()}
              <Button variant="contained" sx={{marginTop:'5px'}}
                    onClick={()=> playAgain()} >
                    Play [Enter]
                </Button>
            </div>
          </Fade>
        {isLoading && <CircularProgress/>}
  </div>
}


export default LeaderBoard