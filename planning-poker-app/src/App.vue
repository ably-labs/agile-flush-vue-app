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
          v-for="card in this.$store.state.cards"
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
      this.$store.state.cards.forEach(card => {
        card.count = 0;
        card.isSelected = false;
      });
      this.showResults = false;
      this.$router.push({ path: "/", query: { sessionId: this.sessionId } });
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
