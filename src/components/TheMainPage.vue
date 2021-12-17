<template>
  <div>
    <h1><span class="red">♥</span>♣🚽 Agile Flush 🚽♠<span class="red">♦</span></h1>
    <p>
      The Nr 1 and Nr 2 place for online planning poker!
    </p>
    <ol>
      <li :class="{ strike: getSessionStarted }">
        Start a new session.
      </li>
      <li :class="{ strike: getHaveParticipantsJoined }">
        Invite your team members by copying &amp; sharing the url.
      </li>
      <li :class="{ strike: getIsAnyCardSelectedByClient }">
        Start voting for the user stories! 🚀
      </li>
    </ol>
    <button
      v-if="!getSessionStarted"
      @click="start"
    >
      {{ getSessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="getSessionStarted">
      <h2>
        Session: {{ getSessionId }} <span
          class="status"
          :class="{ success: getIsAblyConnectedStatus, failed: !getIsAblyConnectedStatus}"
        />
      </h2>
      <JoinDetails />
      <p>
        Once everyone has submitted their vote, click the
        <i>Show votes</i> button to show the results. Click
        <i>Reset votes</i> to start planning a new story.
      </p>
      <button @click="toggleShowResults">
        {{ getShowResults ? "Hide votes" : "Show votes" }}
      </button>
      <button
        :disabled="!getShowResults"
        @click="reset"
      >
        Flush votes
      </button>
      <h3>Cards</h3>
      <p>Click on a card to vote. To undo your vote, click the card again.</p>
      <div class="card-list">
        <CardItem
          v-for="card in getCards"
          :key="card.number"
          class="card"
          :card="card"
          :is-any-card-selected="getIsAnyCardSelectedByClient"
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
  computed: {
    ...mapGetters([
      "getIsAblyConnectedStatus",
      "getShowResults",
      "getSessionId",
      "getSessionStarted",
      "getCards",
      "getHaveParticipantsJoined",
      "getIsAnyCardSelectedByClient"]),
    },
   methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "closeAblyConnection",
      "toggleShowResults",
      "startSession",
      "resetVoting"
    ]),
    async start() {
      this.startSession();
      this.instantiateAblyConnection( { "sessionId": this.getSessionId });
      document.title = `Agile Flush - ${this.getSessionId}`;
      await this.$router.replace({ path: '/', query: { sessionId: this.getSessionId } });
      navigator.clipboard.writeText(window.location.href);
    },
    reset() {
      this.resetVoting();
    },
  },
};
</script>

<style scope>
.status {
  font-size: smaller;
  font-weight: 400;
}

.success::after {
  content: '\2705';
}

.failed::after {
  content: '\274C';
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
