import { useEffect } from "react";

import { Container, Paper, Grid, makeStyles, Button } from '@material-ui/core';

import { SocketContext } from 'context/socket';
import { useContext } from "react";
import { useState } from "react";

import axios from 'axios';
import Stage from "components/Stage/Stage";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    alignItems: 'center',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
  },
  player: {
    padding: '10px',
    marginTop: theme.spacing(2),
  }
}))

function Room() {

  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);

  const [step, setStep] = useState(0);

  const socket = useContext(SocketContext);

  const classes = useStyles();

  useEffect(() => {
    socket.emit('GetPlayerList', '');

    socket.emit('Access', localStorage.getItem('username'));

    socket.on('PlayerList', data => {
      setPlayers(JSON.parse(data));
    })

    socket.on('NewPlayer', data => {
      socket.emit('GetPlayerList', '');
    })

    socket.on('NextQuestion', data => {
      setStep(step + 1);
    })

    socket.on('Start', data => {
      axios.get('https://opentdb.com/api.php?amount=10').then(res => {
        setQuestions(res.data.results);
        setStarted(true);
      }).catch(err => {
        console.log(err);
      })
    })
  }, [socket, step])

  const onStart = () => {
    axios.get('https://opentdb.com/api.php?amount=10').then(res => {
      setQuestions(res.data.results);
      setStarted(true);
    }).catch(err => {
      console.log(err);
    })
    socket.emit('StartGame', true);
  }

  return (
    <Container component='main' maxWidth='md'>
      <Paper elevation={3} className={classes.paper}>
        <Grid container justify='center' spacing={2}>
          <Grid item xs={3}>
            <h2 className={classes.title}>Players</h2>
            {players.map((player, index) => (
              <Paper key={index} elevation={2} className={classes.player}>
                {player}
              </Paper>
            ))}
          </Grid>
          <Grid item xs={9}>
            {started ? (
                <Stage stage={questions[step]} index={step} />
              ) : (
                <Button variant='contained' onClick={onStart}>Start</Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Room;