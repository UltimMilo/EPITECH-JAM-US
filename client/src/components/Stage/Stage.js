import { useState } from "react";

import { TextField, MenuItem, Button } from '@material-ui/core';

import { SocketContext } from 'context/socket';
import { useContext } from "react";

import jackson from './jackson.jpg';

function Stage({ stage, index }) {

  const [answer, setAnswer] = useState('');

  const socket = useContext(SocketContext);

  const submitAnswer = (event) => {
    event.preventDefault();

    if (answer === stage.correct_answer) {
      socket.emit('Answer', true);
    } else {
      socket.emit('Answer', false);
    }
    alert('Answer send');
  }

  return (
    <div>
      <h3>Category : {stage.category}</h3>
      <img src={jackson} alt='jackson' />
      <h3>Question {index + 1} : {stage.question.replace(/&quot;/g,'"').replace(/&#039;/g,'\'').replace(/&amp;/, '&')}</h3>
      <form onSubmit={submitAnswer}>
        <TextField
          id='answer'
          variant='outlined'
          label='Answer'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          fullWidth
          select
        >
          <MenuItem value={stage.correct_answer}>{stage.correct_answer}</MenuItem>
          {stage.incorrect_answers.map((a, index) => (
            <MenuItem key={index} value={a}>{a}</MenuItem>
          ))}
        </TextField>
        <Button type='submit' variant='contained'>Send</Button>
      </form>
    </div>
  )
}

export default Stage;