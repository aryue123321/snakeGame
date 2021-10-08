import { Box, Button, CssBaseline, FormGroup } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import React from "react";
import { useState } from "react";
import {useHistory} from 'react-router-dom'
import { collection, addDoc } from "firebase/firestore"; 
import {db} from '../utils/firebase'

type ScoreFormProps={
  score:number,
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>
}

const ScoreForm =({score, name, setName}:ScoreFormProps)=>{
  const history = useHistory();
  const [isError, setIsError] = useState(false)


  function handeSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    console.log(name.length === 0, name.length)
    if(name.length === 0){
      console.log(name) 
      setIsError(true)
    }else{
      console.log(2121)
      const addData = async() =>{
        try {
          const docRef = await addDoc(collection(db, "Leaderboard"), {
            name,
            score
          });
          console.log("Document written with ID: ", docRef.id);
          history.push(`/leaderboard?id=${docRef.id}`)
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

  return <form onSubmit={(e)=>handeSubmit(e)}>
    <Box sx={{width:300}}>
      <CssBaseline></CssBaseline>
        <FormGroup>
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
          <Button type="submit">Submit</Button>
        </FormGroup>
      </Box>
    </form>
}

export default ScoreForm