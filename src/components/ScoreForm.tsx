import { Box, Button, CssBaseline, FormGroup } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import React from "react";
import { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import { collection, addDoc } from "firebase/firestore"; 
import {db} from '../utils/firebase'

type ScoreFormProps={
  score:number,
}

const key = "playerName"

const ScoreForm =({score}:ScoreFormProps)=>{

  const history = useHistory();
  const [isError, setIsError] = useState(false)

  const [name, setName] = useState(()=>{
    const playerName = localStorage.getItem(key);
    return playerName ? playerName : "";
  })


  useEffect(()=>{
    function keyboardControlListener(e:KeyboardEvent){
      if (e.code === 'Escape'){
        gotoLeaderboard()
      }
    }

      document.addEventListener('keyup', keyboardControlListener);
      return (()=> document.removeEventListener('keyup', keyboardControlListener));
    
    //eslint-disable-next-line
  }, [])

  function handeSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(name.length === 0){
      setIsError(true)
    }else{
      localStorage.setItem(key, name);
      const addData = async() =>{
        try {
          const docRef = await addDoc(collection(db, "Leaderboard"), {
            name,
            score
          });
          console.log("Document written with ID: ", docRef.id);
          history.push(`/leaderboard/${docRef.id}`)
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      addData();
      
    }
  }

  function handleOnchange(inputName:string){
    if(inputName.length > 0 && isError){
      setIsError(false)
    }else if (inputName.length === 0){
      setIsError(true)
    }
    setName(inputName)
  }

  function gotoLeaderboard(){
    history.push('/leaderboard')
  }

  return <form onSubmit={(e)=>handeSubmit(e)}>
    <Box sx={{width:300}}>
      <CssBaseline></CssBaseline>
        <FormGroup>
          <h2>Submit your score?</h2>
          <p>Your Score is : {score}</p>
        </FormGroup>
        <FormGroup>
          <TextField
              required
              id="userName"
              label="Name"
              defaultValue={name}
              onChange={(e)=>handleOnchange(e.target.value.trim())}
              autoFocus={true}
              error={isError}
            />
        </FormGroup>
        <FormGroup>
          <Button type="submit">Submit</Button> <Button onClick={()=>gotoLeaderboard()} >Skip [Esc]</Button>
        </FormGroup>
      </Box>
    </form>
}

export default ScoreForm