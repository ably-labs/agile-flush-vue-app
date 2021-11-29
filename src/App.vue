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
          :isCardSelected="isCardSelected"
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

export default {
  name: "App",
  components: {
    CardDetails,
  },
  data() {
    return {
      sessionId: this.$route.query.sessionId,
      sessionStarted: this.sessionId !== null && this.sessionId !== undefined,
      isCardSelected: false,
      selectedCard: null,
      showResults: false,
      cards: [
        {
          number: "0",
          count: 0,
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
      this.cards.forEach(card => {
        card.count = 0;
      });
      this.showResults = false;
      this.$children.forEach(child => {
        child.reset();
      });
      this.$router.push({ path: "/", query: { sessionId: this.sessionId } });
    },
    vote(number) {
      if (this.isCardSelected === false) {
        this.isCardSelected = true;
        this.selectedCard = number;
        let index = this.cards.findIndex(card => card.number === number)
        this.cards[index].count++;
      } else {
        this.isCardSelected = false;
        this.selectedCard = null;
        let index = this.cards.findIndex(card => card.number === number)
        this.cards[index].count--;
      }
    },
  },
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
