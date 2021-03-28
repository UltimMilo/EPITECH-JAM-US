import { useEffect, useState } from "react";
import { Button, Container, makeStyles, MenuItem, Paper, TextField } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router";

import { SocketContext } from 'context/socket';
import { useContext } from "react";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
  },
  inputs: {
    marginTop: theme.spacing(4),
  },
  title: {
    textAlign: 'center',
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}))

function Home() {

  const [categories, setCategories] = useState([]);

  const [username, setUsername] = useState('');
  const [stages, setStages] = useState(3);
  const [category, setCategory] = useState(0);
  const [roomCreated, setRoomCreated] = useState(false);

  const classes = useStyles();

  const history = useHistory();

  const socket = useContext(SocketContext);

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then(res => {
      setCategories(res.data.trivia_categories);
    }).catch(err => {
      console.log(err);
    });

    socket.emit('GetStatus', '');

    socket.on('Status', data => {
      setRoomCreated(data);
    });

    socket.on('CreateResponse', data => {
      if (data === 'created') {
        localStorage.setItem('username', username)
        history.push('/room');
      }
    })

    socket.on('JoinResponse', data => {
      if (data === 'joined') {
        localStorage.setItem('username', username)
        history.push('/room');
      }
    })

  }, [socket, history, username])

  const handleRoomConnection = (event) => {
    event.preventDefault();

    console.log(`Try to join room !`)
    socket.emit('Join', username);
  }

  const handleRoomCreation = (event) => {
    event.preventDefault();

    socket.emit('Create', JSON.stringify({
      player: username,
      rules: {
        stages_number: stages,
        category_id: category,
      },
    }));
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper elevation={3} className={classes.paper}>
        <h2 className={classes.title}>Welcome to Tower Quizz</h2>
        {roomCreated ? (
          <form onSubmit={handleRoomConnection} className={classes.form}>
            <TextField
              id='username'
              variant='outlined'
              label='Username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              autoFocus
            />
            <Button
              type='submit'
              variant='contained'
            >
              Join
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRoomCreation} className={classes.form}>
            <TextField
              id='username'
              variant='outlined'
              label='Username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              id='stages'
              variant='outlined'
              label='Number of stages'
              type='number'
              value={stages}
              onChange={(e) => setStages(e.target.value)}
              className={classes.inputs}
              fullWidth
            />
            <TextField
              id='category'
              variant='outlined'
              label='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              className={classes.inputs}
              select
            >
              <MenuItem value={0}>Any category</MenuItem>
              {categories.map((c, index) => (
                <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              className={classes.inputs}
            >
              Create
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}

export default Home;