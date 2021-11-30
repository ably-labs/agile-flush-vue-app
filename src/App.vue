<template>
  <div>
    <h1>Planning Poker</h1>
    <ol>
      <li>Start a new session.</li>
      <li>Invite your team members by copying &amp; sharing the url.</li>
      <li>Start voting 🚀!</li>
    </ol>
    <button @click="startSession">
      {{ sessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="sessionStarted">
      <h2>Session: {{ sessionId }}</h2>
      <JoinDetails :nrOfPeople="nrOfPeopleJoined" />
      <p>
        Once everyone has submitted their vote, click the button to show the
        results.
      </p>
      <button @click="toggleResults">
        {{ showResults ? "Hide votes" : "Show votes" }}
      </button>
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
import * as Ably from 'ably';
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
      showResults: false,
      nrOfPeopleJoined: 0,
      nrOfPeopleVoted: 0,
      cards: [
        {
          number: "0",
          count: 0,
          isSelected: false,
          visual: ` .----------------. 
| .--------------. |
| |     ____     | |
| |   .'    '.   | |
| |  |  .--.  |  | |
| |  | |    | |  | |
| |  |  '--'  |  | |
| |   '.____.'   | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "1",
          count: 0,
          isSelected: false,
          visual: ` .----------------.
| .--------------. |
| |     __       | |
| |    /  |      | |
| |    '| |      | |
| |     | |      | |
| |    _| |_     | |
| |   |_____|    | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "2",
          count: 0,
          isSelected: false,
          visual: ` .----------------. 
| .--------------. |
| |    _____     | |
| |   / ___ '.   | |
| |  |_/___) |   | |
| |   .'____.'   | |
| |  / /____     | |
| |  |_______|   | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "3",
          count: 0,
          isSelected: false,
          visual: ` .----------------. 
| .--------------. |
| |    ______    | |
| |   / ____ '.  | |
| |   ''  __) |  | |
| |   _  |__ '.  | |
| |  | |____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "5",
          count: 0,
          isSelected: false,
          visual: ` .----------------. 
| .--------------. |
| |   _______    | |
| |  |  _____|   | |
| |  | |____     | |
| |  '_.____''.  | |
| |  | \\____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "8",
          count: 0,
          isSelected: false,
          visual: ` .----------------. 
| .--------------. |
| |     ____     | |
| |   .' __ '.   | |
| |   | (__) |   | |
| |   .'____'.   | |
| |  | (____) |  | |
| |  '.______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "13",
          count: 0,
          isSelected: false,
          visual: ` .--------------------------.
| .------------------------. |
| |     __      ______     | |
| |    /  |    / ____ '.   | |
| |    '| |    ''  __) |   | |
| |     | |    _  |__ '.   | |
| |    _| |_  | |____) |   | |
| |   |_____|  \\______.'   | |
| |                        | |
| '------------------------' |
 '--------------------------'`,
        },
        {
          number: "21",
          count: 0,
          isSelected: false,
          visual: ` .--------------------------.
| .------------------------. |
| |     _____      __      | |
| |    / ___ '.   /  |     | |
| |   |_/___) |   '| |     | |
| |    .'____.'    | |     | |
| |   / /____     _| |_    | |
| |   |_______|  |_____|   | |
| |                        | |
| '------------------------' |
 '--------------------------'`,
        },
      ],
    };
  },
  methods: {
    toggleResults() {
      this.showResults = !this.showResults;
    },
    startSession() {
      this.sessionId = generateName();
      this.sessionStarted = true;
      this.selectedCard = null;
      this.isAnyCardSelected = false;
      this.nrOfPeopleVoted = 0;
      this.cards.forEach(card => {
        card.count = 0;
        card.isSelected = false;
      });
      this.showResults = false;
      this.$router.push({ path: "/", query: { sessionId: this.sessionId } });
    },
    vote(number) {
      let index = this.cards.findIndex(card => card.number === number)
      if (this.isAnyCardSelected === false) {
        this.isAnyCardSelected = true;
        this.selectedCard = number;
        this.cards[index].count++;
        this.cards[index].isSelected=true;
      } else {
        this.isAnyCardSelected = false;
        this.selectedCard = null;
        this.cards[index].count--;
        this.cards[index].isSelected=false;
      }
    },
  },
  created() {
    this.realtime = new Ably.Realtime({
      authUrl: '/auth'
    });
  },
  destroyed() {
    this.realtime.connection.close();
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
