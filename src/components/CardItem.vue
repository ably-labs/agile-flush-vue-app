<template>
  <div :id="card.number">
    <button class="visual" :class="{ selected: isCardSelectedByClient(card.number) }" @click="selectCard(card.number)">
      {{ card.visual }}
    </button>
    <p v-if="showResults" class="votecount">
      {{ voteCountForCard(card.number) }}
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
      "showResults",
      "sessionId",
      "clientId",
      "isCardSelectedByClient",
      "isAnyCardSelectedByClient",
      "voteCountForCard"
    ]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
    routeClientId() {
      return this.$route.query.clientId;
    }
  },
  methods: {
    ...mapActions(["doVote", "undoVote"]),
    async selectCard(number) {
      if (this.isAnyCardSelectedByClient === false) {
        this.doVote(number);
      } else if (this.isAnyCardSelectedByClient && this.isCardSelectedByClient(this.card.number)) {
        this.undoVote(number);
      }
      if (this.routeSessionId === undefined || this.routeClientId === undefined) {
        await this.$router.replace({
          path: "/",
          query: { sessionId: this.sessionId, clientId: this.clientId }
        });
      }
    }
  }
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
