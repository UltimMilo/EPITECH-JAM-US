import { useEffect, useState } from "react";

import { SocketContext } from 'context/socket';
import { useContext } from "react";
import { Container, Paper, makeStyles, Button} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
  }
}))

function End() {

  const [score, setScore] = useState(0);
  const [max, setMax] = useState(0);

  const socket = useContext(SocketContext);

  const classes = useStyles();

  useEffect(() => {
    socket.emit('Score', '');

    socket.on('Score', data => {
      const response = JSON.parse(data);
      setScore(response.score);
      setMax(response.max);
    })
  })

  return (
    <Container compoenent='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <h1 className={classes.title}>Don’t limit yourself. Many people limit themselves to what they think they can do. You can go as far as your mind lets you. What you believe, remember, you can achieve.</h1>
        {score === 0 ? (
          <Button variant='outlined' onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>Display score</Button>
        ) : (
          <h3>Un score de {score} / {max}</h3>
        )}
      </Paper>
    </Container>
  );
}

export default End;