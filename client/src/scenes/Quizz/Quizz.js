import { useState, useEffect } from 'react';

import axios from 'axios';
import Stage from 'components/Stage/Stage';

function Quizz() {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10').then(res => {
      setQuestions(res.data.results);
    }).catch(err => {
      console.log(err);
    })
  }, [])

  return(
    <div>
      <h1>Quizz</h1>
      {questions.map((item, index) => (
        <Stage key={index} stage={item} index={index} />
      ))}
    </div>
  );
}

export default Quizz;