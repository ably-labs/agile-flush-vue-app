<template>
  <div :id="card.number" @click="selectCard(card.number)">
    <p :class="{ selected: this.getIsCardSelectedByClient(card.number) }">{{ card.visual }}</p>
    <p class="votecount" v-if="getShowResults">{{ this.getVoteCountForCard(card.number) }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CardItem",
  props: {
    card: Object
  },
  computed: {
    ...mapGetters([
      "getShowResults",
      "getSessionId",
      "getClientId",
      "getIsCardSelectedByClient",
      "getIsAnyCardSelectedByClient",
      "getVoteCountForCard"]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
    routeClientId() {
      return this.$route.query.clientId;
    },
  },
  methods: {
    ...mapActions([
      "doVote",
      "undoVote"
    ]),
    selectCard(number) {
      if (this.getIsAnyCardSelectedByClient === false) {
        this.doVote(number);
      } else if (this.getIsAnyCardSelectedByClient && this.getIsCardSelectedByClient(this.card.number)) {
        this.undoVote(number);
      }
      console.log(this.routeSessionId, this.routeClientId)
      if (this.routeSessionId === undefined || this.routeClientId === undefined) {
        this.$router.replace({ path: `/`, query: { sessionId: this.getSessionId, clientId: this.getClientId } });
      }
    }
  }
};
</script>

<style scope>
.card > p {
  margin: 0px;
  white-space: pre;
  border-radius: 10px;
}

.votecount {
  text-align: center;
}

.card:hover {
  font-weight: bold;
}

.selected {
  font-weight: bold;
  color: white;
  background-color: #e40000;
}
</style>
