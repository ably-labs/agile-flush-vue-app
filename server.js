const { Worker, isMainThread, threadId } = require('worker_threads');

const express = require('express');
const Ably = require('ably');
const envConfig = require('dotenv').config();
const serveStatic = require('serve-static');
const path = require('path');

const app = express();
const ABLY_API_KEY = process.env.ABLY_API_KEY;
const mainChannelName = 'main-planning-poker';

let globalChannel;
const activeSessions = {};
let totalPeopleThroughout = 0;

const realtime = Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false
});

app.use('/', serveStatic(path.join(__dirname, 'planning-poker-app/dist')));

app.get('/auth', (request, response) => {
  const tokenParams = { clientId: uniqueId() };
  realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
    if (err) {
      response
        .status(500)
        .send('Error requesting token: ' + JSON.stringify(err));
    } else {
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.send(JSON.stringify(tokenRequest));
    }
  });
});

const uniqueId = function () {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'planning-poker-app/dist/index.html'));
});

app.get('/join', function (req, res) {
  let requestedSessionId = req.query.sessionId;
  if (activeSessions[requestedSessionId].didSessionStart === true) {
    res.sendFile(path.join(__dirname, 'planning-poker-app/dist/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'planning-poker-app/dist/index.html'));
  }
});

app.get('/checkSessionStatus', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let requestedSessionId = req.query.sessionId;
  res.send({
    isSessionClosed: activeSessions[requestedSessionId]
      ? activeSessions[requestedSessionId].didSessionStart
      : true
  });
});

const listener = app.listen(process.env.PORT || 8082, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

realtime.connection.once('connected', () => {
  globalChannel = realtime.channels.get(mainChannelName);
  globalChannel.presence.subscribe('enter', (participant) => {
    console.log('new quiz host', participant.clientId);
    generateNewSession(
      participant.data.sessionId,
      participant.clientId
    );
  });
});

function generateNewSession(hostSessionId, hostClientId) {
  if (isMainThread) {
    const worker = new Worker('./session-server.js', {
      workerData: {
        hostSessionId: hostSessionId,
        hostClientId: hostClientId
      }
    });
    console.log(`CREATING NEW THREAD WITH ID ${threadId}`);
    worker.on('error', (error) => {
      console.log(`WORKER EXITED DUE TO AN ERROR ${error}`);
    });
    worker.on('message', (msg) => {
      if (msg.sessionId && !msg.killWorker) {
        activeSessions[msg.sessionId] = {
          sessionId: msg.sessionId,
          totalParticipants: msg.totalParticipants,
          didSessionStart: msg.didSessionStart
        };
        totalPeopleThroughout += totalPeopleThroughout;
      } else if (msg.sessionId && msg.killWorker) {
        totalPeopleThroughout -= msg.totalParticipants;
        delete activeSessions[msg.sessionId];
      } else {
        activeSessions[msg.sessionId].didSessionStart = msg.didSessionStart;
        console.log('Main knows started');
      }
    });

    worker.on('exit', (code) => {
      console.log(`WORKER EXITED WITH THREAD ID ${threadId}`);
      if (code !== 0) {
        console.log(`WORKER EXITED DUE TO AN ERROR WITH CODE ${code}`);
      }
    });
  }
}
