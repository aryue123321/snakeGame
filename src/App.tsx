import React from 'react';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useState} from 'react'
import LeaderBoard from './components/Leaderboard';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'


function App() {


  const [name, setName] = useState('');
  const [score, setScore] = useState(0)

  return (
    <div>
      <CssBaseline>
        <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            sNAke
          </Typography>
        </Toolbar>
        </AppBar>
          <Container maxWidth="sm" sx={{textAlign:'center'}}>
            <div style={{marginTop:'30px'}}>
            
              <Router>
              <Switch>
                <Route path="/" exact >
                  <Game setScore={setScore} name={name} setName={setName}></Game>
                </Route>
                <Route path="/leaderBoard/:highlightId?/">
                  <LeaderBoard score={score}/>
                </Route>
                </Switch>
              </Router>
            
            </div>
          </Container>
      </CssBaseline>
    </div>
  );
}

export default App;
