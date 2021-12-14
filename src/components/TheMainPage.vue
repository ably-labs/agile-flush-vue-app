<template>
  <div>
    <h1><span class="red">♥</span>♣🚽 Agile Flush 🚽♠<span class="red">♦</span></h1>
    <p>
      The Nr 1 and Nr 2 place for online planning poker!
    </p>
    <ol>
      <li :class="{ strike: getSessionStarted }">Start a new session.</li>
      <li :class="{ strike: getHaveParticipantsJoined }">Invite your team members by copying &amp; sharing the url.</li>
      <li :class="{ strike: getIsAnyCardSelected }">Start voting for the user stories! 🚀</li>
    </ol>
    <button @click="start" v-if="!getSessionStarted">
      {{ getSessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="getSessionStarted">
      <h2 :class="{ success: getIsAblyConnectedStatus, failed: !getIsAblyConnectedStatus}">Session: {{ getSessionId }}</h2>
      <JoinDetails />
      <p>
        Once everyone has submitted their vote, click the
        <i>Show votes</i> button to show the results. Click
        <i>Reset votes</i> to start planning a new story.
      </p>
      <button @click="toggleShowResults">
        {{ getShowResults ? "Hide votes" : "Show votes" }}
      </button>
      <button @click="reset">Reset votes</button>
      <h3>Cards</h3>
      <p>Click on a card to vote. To undo your vote, click the card again.</p>
      <div class="card-list">
        <CardItem
          class="card"
          v-for="card in getCards"
          :key="card.number"
          :card="card"
          :isAnyCardSelected="isAnyCardSelected"
        />
      </div>
    </div>
   <TheFooter />
  </div>
</template>

<script>
import CardItem from "./CardItem.vue";
import JoinDetails from "./JoinDetails.vue";
import TheFooter from "./TheFooter.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CardItem,
    JoinDetails,
    TheFooter,
  },
  data() {
    return {
      isAnyCardSelected: false,
      selectedCard: null,
    };
  },
  computed: {
    ...mapGetters([
      "getIsAblyConnectedStatus",
      "getShowResults",
      "getSessionId",
      "getSessionStarted",
      "getCards",
      "getHaveParticipantsJoined",
      "getIsAnyCardSelected"]),
    },
   methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "closeAblyConnection",
      "toggleShowResults",
      "startSession",
      "resetVoting"
    ]),
    start() {
      this.startSession();
      let sessionId = this.getSessionId;
      console.log("created sessionId", sessionId);
      this.instantiateAblyConnection(sessionId);
      this.$router.replace({ path: `/`, query: { sessionId: sessionId } });
    },
    reset() {
      this.resetVoting();
    },
  },
};
</script>

<style>
body {
  font-family: "Courier New", monospace;
  background-color: white;
}

.success::after {
  content: '✔️';
  padding-left: 10px;
}

.failed::after {
  content: '❌';
  padding-left: 10px;
}

.card-list {
  flex-direction: row;
  flex-flow: row wrap;
  display: flex;
}

.strike {
  text-decoration: line-through;
}

button {
  font-family: "Courier New", monospace;
  padding: 1em;
  margin-right: 1em;
}

  a, .red {
    color: #e40000;
  }
</style>
