<template>
  <div>
    <h1>Planning Poker</h1>
    <ol>
      <li>Start a new session.</li>
      <li>Invite your team members by copying &amp; sharing the url.</li>
      <li>Start voting for the user stories! 🚀</li>
    </ol>
    <button @click="startSession">
      {{ sessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="sessionStarted">
      <h2>Session: {{ sessionId }}</h2>
      <JoinDetails />
      <p>
        Once everyone has submitted their vote, click the <i>Show votes</i> button to show the
        results. Click <i>Reset votes</i> to start planning a new story.
      </p>
      <button @click="toggleResults">
        {{ showResults ? "Hide votes" : "Show votes" }}
      </button>
      <button @click="resetVoting">Reset votes</button>
      <h3>Cards</h3>
      <p>Click on a card to vote. To undo your vote, click the card again.</p>
      <div class="cardlist">
        <CardDetails
          class="card"
          v-for="card in cards"
          :key="card.number"
          :card="card"
          :isAnyCardSelected="isAnyCardSelected"
          :showResults="showResults"
          @selectCard="vote"
          @deselectCard="vote"
        />
      </div>
    </div>
    <p>
      Powered by <a href="https://www.ably.com" target="_blank">ably.com</a>.
    </p>
  </div>
</template>

<script>
import { generateName } from "./util/nameGenerator.js";
import CardDetails from "./components/CardDetails.vue";
import JoinDetails from "./components/JoinDetails.vue";

export default {
  name: "App",
  components: {
    CardDetails,
    JoinDetails,
  },
  data() {
    return {
      realtime: null, 
      sessionId: this.$route.query.sessionId,
      sessionStarted: this.sessionId !== null && this.sessionId !== undefined,
      isAnyCardSelected: false,
      selectedCard: null,
    };
  },
  computed: {
    cards() {
      return this.$store.state.cards;
    },
    showResults() {
      return this.$store.state.showResults;
    }
  },
  methods: {
    toggleResults() {
      this.$store.commit("toggleShowResults");
    },
    startSession() {
      this.sessionId = generateName();
      this.sessionStarted = true;
      this.resetVoting();
      this.$router.push({ path: "/", query: { sessionId: this.sessionId } });
    },
    resetVoting() {
      this.selectedCard = null;
      this.isAnyCardSelected = false;
      this.nrOfPeopleVoted = 0;
      this.$store.commit('reset');
    },
    vote(number) {
      if (this.isAnyCardSelected === false) {
        this.isAnyCardSelected = true;
        this.selectedCard = number;
        this.$store.commit('selectCard', number);
      } else {
        this.isAnyCardSelected = false;
        this.selectedCard = null;
        this.$store.commit('deselectCard', number);
      }
    },
    createQuizRoom() {
      this.createBtnClicked = true;
      this.waitForGameRoom();
      this.enterMainThread();
    },
    waitForGameRoom() {
      this.myQuizRoomCh = this.realtime.channels.get(
        `${this.myQuizRoomCode}:primary`
      );
      this.hostAdminCh = this.realtime.channels.get(
        `${this.myQuizRoomCode}:host`
      );
      this.myQuizRoomCh.subscribe('thread-ready', () => {
        this.handleQuizRoomReady();
      });
    },
    handleQuizRoomReady() {
      this.isRoomReady = true;
      this.globalQuizCh.detach();
      this.enterGameRoomAndSubscribeToEvents();
      this.playerLink = `${this.playerLinkBase}?quizCode=${this.myQuizRoomCode}`;
      if (this.quizType == 'CustomQuiz') {
        let questions = this.customQuizQuestions;
        this.hostAdminCh.publish('quiz-questions', {
          questions
        });
      }
    },
    enterGameRoomAndSubscribeToEvents() {
      this.myQuizRoomCh.presence.enter({
        nickname: this.hostNickname,
        avatarColor: this.myAvatarColor,
        isHost: true,
        quizType: this.quizType
      });
      this.subscribeToRoomChEvents();
    },
    enterMainThread() {
      this.globalQuizCh = this.realtime.channels.get(this.globalQuizChName);
      this.globalQuizCh.presence.enter({
        nickname: this.hostNickname,
        roomCode: this.myQuizRoomCode
      });
    },
    getRandomRoomId() {
      return (
        'room-' +
        Math.random()
          .toString(36)
          .substr(2, 8)
      );
    },
    subscribeToRoomChEvents() {
      this.myQuizRoomCh.subscribe('new-player', msg => {
        this.handleNewPlayerEntered(msg);
      });
      this.myQuizRoomCh.subscribe('start-quiz-timer', msg => {
        this.didHostStartGame = true;
        this.timer = msg.data.countDownSec;
      });
      this.myQuizRoomCh.subscribe('new-question', msg => {
        this.handleNewQuestionReceived(msg);
      });
      this.myQuizRoomCh.subscribe('question-timer', msg => {
        this.questionTimer = msg.data.countDownSec;
        if (this.questionTimer < 0) {
          this.questionTimer = 30;
        }
      });
      this.myQuizRoomCh.subscribe('correct-answer', msg => {
        this.handleCorrectAnswerReceived(msg);
      });
      this.myQuizRoomCh.subscribe('live-stats-update', msg => {
        this.numAnswered = msg.data.numAnswered;
        this.numPlaying = msg.data.numPlaying;
      });
      this.myQuizRoomCh.subscribe('full-leaderboard', msg => {
        this.leaderboard = msg.data.leaderboard;
      });
    },
    handleNewPlayerEntered(msg) {
      let { clientId, nickname, avatarColor, isHost } = msg.data.newPlayerState;
      if (!isHost) {
        this.onlinePlayersArr.push({
          clientId,
          nickname,
          avatarColor,
          isHost
        });
      } else {
        return;
      }
    },
    handleNewQuestionReceived(msg) {
      this.showAnswer = false;
      this.showQuestions = true;
      this.newQuestionNumber = msg.data.questionNumber;
      this.newQuestion = msg.data.question;
      this.newChoices = msg.data.choices;
      this.isLastQuestion = msg.data.isLastQuestion;
      this.numAnswered = msg.data.numAnswered;
      this.numPlaying = msg.data.numPlaying;
      this.showImg = msg.data.showImg;
      this.questionImgLink = msg.data.imgLink;
    },
    handleCorrectAnswerReceived(msg) {
      this.showAnswer = true;
      if (this.newQuestionNumber == msg.data.questionNumber) {
        this.correctAnswerIndex = msg.data.correctAnswerIndex;
      }
      if (this.isLastQuestion) {
        this.showFinalScreen = true;
      }
    },
    copyPlayerInviteLink() {
      this.copyClicked = true;
      this.copyBtnText = 'Copied!';
      setTimeout(() => {
        this.copyClicked = false;
        this.copyBtnText = 'Copy shareable link';
      }, 2000);
      navigator.clipboard.writeText(this.playerLink);
    },
    startQuiz() {
      this.hostAdminCh.publish('start-quiz', {
        start: true
      });
    },
    endQuizNow() {
      this.showFinalScreen = true;
    }
  },
  beforeDestroy() {
    if (this.myQuizRoomCh) {
      this.myQuizRoomCh.presence.leave();
    }
    this.questionTimer = 30;
  },
  created() {

    this.$store.commit('setRealTime');
  },
  destroyed() {
    this.$store.state.realtime.connection.close();
  }
};
</script>

<style>
body {
  font-family: "Courier New", monospace;
}

.cardlist {
  flex-direction: row;
  flex-flow: row wrap;
  display: flex;
}

a {
  color: #e40000;
}

button {
  font-family: "Courier New", monospace;
}
</style>
