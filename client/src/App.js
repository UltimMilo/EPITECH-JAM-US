import { BrowserRouter as Router, Route } from 'react-router-dom';
import {SocketContext, socket } from 'context/socket';

import Home from 'scenes/Home/Home';
import Quizz from 'scenes/Quizz/Quizz';
import Room from 'scenes/Room/Room';
import End from 'scenes/End/End';

function App() {
  return (
    <Router>
      <SocketContext.Provider value={socket}>
        <Route exact path='/' component={Home} />
        <Route path='/room' component={Room} />
        <Route path='/end' component={End} />
        <Route path='/quizz' component={Quizz} />
      </SocketContext.Provider>
    </Router>
  );
}

export default App;
