<template>
  <div :id="card.number" @click="selectCard(card.number)">
    <p :class="{ selected: selectedCard === card.number }">{{ card.visual }}</p>
    <p class="votecount" v-if="showResults">{{ card.count }}</p>
  </div>
</template>

<script>
export default {
  name: "CardDetails",
  props: {
    card: Object,
    isCardSelected: Boolean,
    showResults: Boolean,
  },
  data() {
    return { 
      selectedCard: null 
    }
  },
  methods: {
    selectCard(number) {
      if (this.isCardSelected === false) {
        this.selectedCard = number;
        this.$emit("selectCard", number);
      } else if (this.isCardSelected && this.selectedCard === number) {
        this.selectedCard = null;
        this.$emit("deselectCard", number);
      }
    },
    reset() {
      this.$data.selectedCard = null;
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
