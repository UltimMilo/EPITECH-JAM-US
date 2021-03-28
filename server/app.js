const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();

app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

var players = [];
var rules = {};
var roomCreated = false;
var started = false;

var answers = 0;
var good_answers = 0;

var global_score = 0;

var score = 0;
var steps = 0;

io.on("connection", (socket) => {

  console.log("New client connected");

  socket.on('Create', data => {
    console.log('Try to create a room');

    const infos = JSON.parse(data);

    // Add player to the list
    players.push(infos.player);
    console.log(`The player ${infos.player} was added to the list`);

    // Set the rules
    rules = infos.rules;
    console.log('The rules are set');

    //Change room Status
    roomCreated = true;
    console.log('Room status updated');

    socket.emit('CreateResponse', 'created');
  })

  socket.on('Join', data => {
    players.push(data);

    socket.emit('JoinResponse', 'joined');
  })

  socket.on('Access', data => {
    console.log('A new player want to access the room');

    // Put the player in the room
    socket.join('room');
    console.log(`The player ${data} was added to the room`);

    // Send the name of the player to other player
    socket.to('room').emit('NewPlayer', data);
  })

  socket.on('GetStatus', data => {
    //send the room status
    console.log('Room status requested : ' + roomCreated);
    socket.emit('Status', roomCreated);
  })

  socket.on('message', data => {
    socket.to('room').emit('message', data);
  })

  socket.on('GetPlayerList', data => {
    socket.emit('PlayerList', JSON.stringify(players));
  })

  socket.on('StartGame', data => {
    started = true;
    console.log('Game started');
    socket.to('room').emit('Start', true);
  })

  socket.on('Answer', data => {
    console.log('Get answer !');
    answers += 1;
    good_answers += data ? 1 : 0;

    if (answers === players.length) {
      steps += 1;
      if (answers === good_answers) {
        score += 1;
      }
      if (steps >= rules.stages_number) {
        socket.to('room').emit('End', score);
        socket.emit('End', score);
      } else {
        socket.to('room').emit('NextQuestion', answers === good_answers)
        socket.emit('NextQuestion', answers === good_answers)
      }
      answers = 0;
      good_answers = 0;
    }
  })

  socket.on('Score', data => {
    socket.emit('Score', JSON.stringify({
      score: score,
      max: rules.stages_number,
    }));
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));