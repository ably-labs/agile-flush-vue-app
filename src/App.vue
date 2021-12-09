<template>
  <div>
    <h1><span class="red">♥</span>♣🚽 Agile Flush 🚽♠<span class="red">♦</span></h1>
    <p>
      The best place for online planning poker!
    </p>
    <ol>
      <li :class="{ strike: getSessionStarted }">Start a new session.</li>
      <li :class="{ strike: getHaveParticipantsJoined }">Invite your team members by copying &amp; sharing the url.</li>
      <li :class="{ strike: getIsAnyCardSelected }">Start voting for the user stories! 🚀</li>
    </ol>
    <button @click="start">
      {{ getSessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="getSessionStarted">
      <h2>Session: {{ getSessionId }}</h2>
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
        <CardDetails
          class="card"
          v-for="card in getCards"
          :key="card.number"
          :card="card"
          :isAnyCardSelected="isAnyCardSelected"
        />
      </div>
    </div>
   <FooterDetails />
  </div>
</template>

<script>
import CardDetails from "./components/CardDetails.vue";
import JoinDetails from "./components/JoinDetails.vue";
import FooterDetails from "./components/FooterDetails.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    CardDetails,
    JoinDetails,
    FooterDetails,
  },
  data() {
    return {
      isAnyCardSelected: false,
      selectedCard: null,
    };
  },
  computed: {
    ...mapGetters([
      "getShowResults",
      "getSessionId",
      "getSessionStarted",
      "getCards",
      "getHaveParticipantsJoined",
      "getIsAnyCardSelected"]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
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
  created() {
    console.log("created", this.routeSessionId);
    if (this.routeSessionId != null && this.routeSessionId != undefined)
    {
      this.startSession(this.routeSessionId);
      let sessionId = this.getSessionId;
      this.instantiateAblyConnection(sessionId);
    }
  },
  destroyed() {
    this.closeAblyConnection();
  }
};
</script>

<style>
body {
  font-family: "Courier New", monospace;
  background-color: white;
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
