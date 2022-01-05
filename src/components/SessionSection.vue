<template>
  <div v-if="hasSessionStarted">
    <h2>
      Session: {{ sessionId }} <span
        class="status"
        :class="{ success: isAblyConnected, failed: !isAblyConnected }"
      />
    </h2>
    <p>Received {{ numberOfParticipantsVoted }} votes from {{ numberOfParticipantsJoined }} participants.</p>
    <p>
      Once everyone has submitted their vote, click the
      <i>Show votes</i> button to show the results. Click <i>Reset votes</i> to start planning a new story.
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
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CardItem from './CardItem.vue';

export default {
  components: {
    CardItem,
  },
  computed: {
    ...mapGetters([
      'isAblyConnected',
      'showResults',
      'sessionId',
      'hasSessionStarted',
      'cards',
      'isAnyCardSelectedByClient',
      'numberOfParticipantsVoted',
      'numberOfParticipantsJoined',
    ]),
  },
  methods: {
    ...mapActions([
      'toggleShowResults',
      'resetVoting',
    ]),
  },
};
</script>

<style scoped>
.status {
  font-size: smaller;
  font-weight: 400;
}

.success::after {
  content: "\2705";
}

.failed::after {
  content: "\274C";
}

.card-list {
  flex-direction: row;
  flex-flow: row wrap;
  display: flex;
}
</style>
