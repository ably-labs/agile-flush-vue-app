<template>
  <div :id="card.number">
    <button
      class="visual"
      :class="{ selected: getIsCardSelectedByClient(card.number) }"
      @click="selectCard(card.number)"
    >
      {{ card.visual }}
    </button>
    <p
      v-if="getShowResults"
      class="votecount"
    >
      {{ getVoteCountForCard(card.number) }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CardItem",
  props: {
    card: {
      type: Object,
      default: null
    }
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
    async selectCard(number) {
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
        await this.$router.replace({
          path: '/',
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
