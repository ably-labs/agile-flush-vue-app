const randomQuestions = require('./quiz-default-questions');
const { parentPort, workerData } = require('worker_threads');
const Ably = require('ably/promises');
const START_TIMER_SEC = 5;
const QUESTION_TIMER_SEC = 30;

const ABLY_API_KEY = process.env.ABLY_API_KEY;
const globalParticipantState = {};
const participantChannels = {};
let didSessionStart = false;
let totalParticipants = 0;
const sessionChannelName = `${workerData.sessionId}:primary`;
const adminChannelName = `${workerData.sessionId}:host`;
let adminChannel;
const sessionId = workerData.sessionId;
const hostClientId = workerData.hostClientId;
let sessionChannel;
let numParticipantsVoted = 0;
let customQuestions = [];
let skipTimer = false;

console.log('this is the worker thread');
console.log('sessionId is' + workerData.sessionId);

let questions = [];

const realtime = Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false
});

realtime.connection.once('connected', () => {
  adminChannel = realtime.channels.get(adminChannelName);
  sessionChannel = realtime.channels.get(sessionChannelName);

  subscribeToHostEvents();

  sessionChannel.presence.subscribe('enter', handleNewPlayerEntered);
  sessionChannel.presence.subscribe('leave', handleExistingPlayerLeft);
  sessionChannel.publish('thread-ready', { start: true });
});

function handleNewPlayerEntered(player) {
  console.log(player.clientId + 'player entered quiz room');
  const newPlayerId = player.clientId;
  totalParticipants++;
  parentPort.postMessage({
    roomCode: sessionId,
    totalPlayers: totalParticipants,
    didQuizStart: didSessionStart
  });

  let newPlayerState = {
    id: newPlayerId,
    nickname: player.data.nickname,
    avatarColor: player.data.avatarColor,
    isHost: player.data.isHost,
    score: 0
  };

  if (player.data.isHost) {
    let quizType = player.data.quizType;
    quizType === 'CustomQuiz'
      ? (questions = customQuestions)
      : (questions = randomQuestions);
  } else {
    participantChannels[newPlayerId] = realtime.channels.get(
      `${sessionId}:player-ch-${player.clientId}`
    );

    subscribeToPlayerChannel(participantChannels[newPlayerId], newPlayerId);
  }

  globalParticipantState[newPlayerId] = newPlayerState;
  sessionChannel.publish('new-player', {
    newPlayerState
  });
}

function handleExistingPlayerLeft(player) {
  console.log('leaving player', player.clientId);
  const leavingPlayerId = player.clientId;
  totalParticipants--;
  parentPort.postMessage({
    roomCode: sessionId,
    totalPlayers: totalParticipants
  });
  delete globalParticipantState[leavingPlayerId];
  if (leavingPlayerId === hostClientId) {
    sessionChannel.publish('host-left', {
      endQuiz: true
    });
    forceQuizEnd();
  }
}

async function publishTimer(event, countDownSec) {
  while (countDownSec > 0) {
    sessionChannel.publish(event, {
      countDownSec: countDownSec
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    countDownSec -= 1;
    if (event === 'question-timer' && skipTimer) break;
  }
}

function subscribeToHostEvents() {
  adminChannel.subscribe('start-quiz', async () => {
    didSessionStart = true;
    parentPort.postMessage({
      roomCode: sessionId,
      didQuizStart: didSessionStart
    });
    await publishTimer('start-quiz-timer', START_TIMER_SEC);
    publishQuestion(0, false);
  });

  adminChannel.subscribe('quiz-questions', (msg) => {
    for (let i = 0; i < msg.data.questions.length; i++) {
      let item = msg.data.questions[i];
      let newQuestionObject = {
        questionNumber: parseInt(item['question number']),
        showImg: item['image link'].substr(0, 4) === 'http' ? true : false,
        question: item.question,
        choices: [
          item['option 1'],
          item['option 2'],
          item['option 3'],
          item['option 4']
        ],
        correct: parseInt(item['correct answer option number']) - 1,
        pic: item['image link']
      };
      customQuestions.push(newQuestionObject);
    }
  });

  adminChannel.subscribe('next-question', (msg) => {
    let prevQIndex = msg.data.prevQIndex;
    let newQIndex = prevQIndex + 1;
    let lastQIndex = questions.length - 1;
    if (newQIndex < lastQIndex) {
      publishQuestion(newQIndex, false);
    } else if (newQIndex === lastQIndex) {
      publishQuestion(newQIndex, true);
    }
  });

  adminChannel.subscribe('end-quiz-now', () => {
    forceQuizEnd();
  });
}

function forceQuizEnd() {
  sessionChannel.publish('quiz-ending', {
    quizEnding: true
  });
  killWorkerThread();
}

async function publishQuestion(qIndex, isLast) {
  numParticipantsVoted = 0;
  await sessionChannel.publish('new-question', {
    numAnswered: 0,
    numPlaying: totalParticipants - 1,
    questionNumber: qIndex + 1,
    question: questions[qIndex].question,
    choices: questions[qIndex].choices,
    isLastQuestion: isLast,
    showImg: questions[qIndex].showImg,
    imgLink: questions[qIndex].pic
  });
  skipTimer = false;
  await publishTimer('question-timer', QUESTION_TIMER_SEC);
  await sessionChannel.publish('correct-answer', {
    questionNumber: qIndex + 1,
    correctAnswerIndex: questions[qIndex].correct
  });
  computeTopScorers();

  if (isLast) {
    killWorkerThread();
  }
}

function computeTopScorers() {
  let leaderboard = new Array();
  for (let item in globalParticipantState) {
    if (item != hostClientId) {
      leaderboard.push({
        nickname: globalParticipantState[item].nickname,
        score: globalParticipantState[item].score
      });
    }
  }
  leaderboard.sort((a, b) => b.score - a.score);
  sessionChannel.publish('full-leaderboard', {
    leaderboard: leaderboard
  });
}

function subscribeToPlayerChannel(playerChannel, playerId) {
  playerChannel.subscribe('player-answer', (msg) => {
    numParticipantsVoted++;
    if (
      questions[msg.data.questionIndex].correct === msg.data.playerAnswerIndex
    ) {
      globalParticipantState[playerId].score += 5;
    }
    updateLiveStatsForHost(numParticipantsVoted, totalParticipants - 1);
  });
  updateLiveStatsForHost(numParticipantsVoted, totalParticipants - 1);
}

function updateLiveStatsForHost(numAnswered, numPlaying) {
  sessionChannel.publish('live-stats-update', {
    numAnswered: numAnswered,
    numPlaying: numPlaying
  });
  if (numAnswered === numPlaying) {
    skipTimer = true;
  }
}

function killWorkerThread() {
  console.log('killing thread');
  for (const item in participantChannels) {
    if (participantChannels[item]) {
      participantChannels[item].detach();
    }
  }
  adminChannel.detach();
  sessionChannel.detach();
  parentPort.postMessage({
    killWorker: true,
    roomCode: sessionId,
    totalPlayers: totalParticipants
  });
  process.exit(0);
}
