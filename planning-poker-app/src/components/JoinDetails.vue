<template>
  <p>Number of received votes: {{ nrOfParticipantsVoted }}</p>
</template>

<script>
export default {
  data() {
    return;
  },
  computed: {
    nrOfParticipantsVoted() {
      return this.$store.state.nrOfParticipantsVoted;
    },
  },
};
</script>

<style scoped>
p {
  font-style: italic;
}
</style>
