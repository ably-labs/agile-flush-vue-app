<template>
  <div :id="card.number">
    <button
      @click="selectCard(card.number)"
      class="visual"
      :class="{ selected: this.getIsCardSelectedByClient(card.number) }"
    >
      {{ card.visual }}
    </button>
    <p class="votecount" v-if="getShowResults">
      {{ this.getVoteCountForCard(card.number) }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CardItem",
  props: {
    card: Object,
  },
  computed: {
    ...mapGetters([
      "getShowResults",
      "getSessionId",
      "getClientId",
      "getIsCardSelectedByClient",
      "getIsAnyCardSelectedByClient",
      "getVoteCountForCard",
    ]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
    routeClientId() {
      return this.$route.query.clientId;
    },
  },
  methods: {
    ...mapActions(["doVote", "undoVote"]),
    selectCard(number) {
      if (this.getIsAnyCardSelectedByClient === false) {
        this.doVote(number);
      } else if (
        this.getIsAnyCardSelectedByClient &&
        this.getIsCardSelectedByClient(this.card.number)
      ) {
        this.undoVote(number);
      }
      if (
        this.routeSessionId === undefined ||
        this.routeClientId === undefined
      ) {
        this.$router.replace({
          path: `/`,
          query: { sessionId: this.getSessionId, clientId: this.getClientId },
        });
      }
    },
  },
};
</script>

<style scope>
button.visual {
  margin: 2px;
  padding: 2px;
  white-space: pre;
  border-radius: 15px;
  background-color: #f5f5f6;
  border: none;
}

button.selected {
  font-weight: bold;
  color: white;
  background-color: #e40000;
}

button.visual:hover {
  font-weight: bold;
}

.votecount {
  font-weight: bold;
  text-align: center;
  margin: 2px;
}

</style>
