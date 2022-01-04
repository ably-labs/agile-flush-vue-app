<template>
  <div>
    <h1><span class="red">♥</span>♣🚽 Agile Flush 🚽♠<span class="red">♦</span></h1>
    <p>
      The No. 1 and No. 2 place for online planning poker!
    </p>
    <ol>
      <li :class="{ strike: hasSessionStarted }">
        Start a new session.
      </li>
      <li :class="{ strike: haveParticipantsJoined }">
        Invite your team members by copying &amp; sharing the url.
      </li>
      <li :class="{ strike: isAnyCardSelectedByClient }">
        Start voting for the user stories!
      </li>
    </ol>
    <button
      v-if="!hasSessionStarted"
      @click="start"
    >
      {{ hasSessionStarted ? "Start new session" : "Start session" }}
    </button>
    <div v-if="hasSessionStarted">
      <h2>
        Session: {{ sessionId }} <span
          class="status"
          :class="{ success: isAblyConnected, failed: !isAblyConnected}"
        />
      </h2>
      <ParticipantSection />
      <p>
        Once everyone has submitted their vote, click the
        <i>Show votes</i> button to show the results. Click
        <i>Reset votes</i> to start planning a new story.
      </p>
      <button @click="toggleShowResults">
        {{ showResults ? "Hide votes" : "Show votes" }}
      </button>
      <button
        :disabled="!showResults"
        @click="resetVoting"
      >
        Flush votes
      </button>
      <h3>Cards</h3>
      <p>Click on a card to vote. To undo your vote, click the card again.</p>
      <div class="card-list">
        <CardItem
          v-for="card in cards"
          :key="card.number"
          class="card"
          :card="card"
          :is-any-card-selected="isAnyCardSelectedByClient"
        />
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script>
import CardItem from "./CardItem.vue";
import ParticipantSection from "./ParticipantSection.vue";
import FooterSection from "./FooterSection.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CardItem,
    ParticipantSection,
    FooterSection,
  },
  computed: {
    ...mapGetters([
      "isAblyConnected",
      "showResults",
      "sessionId",
      "hasSessionStarted",
      "cards",
      "haveParticipantsJoined",
      "isAnyCardSelectedByClient"]),
    },
   methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "toggleShowResults",
      "startSession",
      "resetVoting"
    ]),
    async start() {
      this.startSession();
      this.instantiateAblyConnection( { "sessionId": this.sessionId });
      document.title = `Agile Flush - ${this.sessionId}`;
      await this.$router.replace({ path: '/', query: { sessionId: this.sessionId } });
      navigator.clipboard.writeText(window.location.href);
    }
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
