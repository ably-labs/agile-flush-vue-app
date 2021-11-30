<template>
  <div :id="card.number" @click="selectCard(card.number)">
    <p :class="{ selected: card.isSelected }">{{ card.visual }}</p>
    <p class="votecount" v-if="showResults">{{ card.count }}</p>
  </div>
</template>

<script>
export default {
  name: "CardDetails",
  props: {
    card: Object,
    isAnyCardSelected: Boolean,
    showResults: Boolean,
  },
  data() {
    return { 
    }
  },
  methods: {
    selectCard(number) {
      if (this.isAnyCardSelected === false) {
        this.$emit("selectCard", number);
      } else if (this.isAnyCardSelected && this.card.isSelected) {
        this.$emit("deselectCard", number);
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
