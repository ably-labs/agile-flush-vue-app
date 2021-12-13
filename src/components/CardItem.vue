<template>
  <div :id="card.number" @click="selectCard(card.number)">
    <p :class="{ selected: card.isSelected }">{{ card.visual }}</p>
    <p class="votecount" v-if="getShowResults">{{ card.count }}</p>
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
      "getIsAnyCardSelected"])
  },
  methods: {
    ...mapActions([
      "doVote",
      "undoVote"
    ]),
    selectCard(number) {
      if (this.getIsAnyCardSelected === false) {
        this.doVote(number);
      } else if (this.getIsAnyCardSelected && this.card.isSelected) {
        this.undoVote(number);
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
