<template>
  <p>Received {{ getNrOfParticipantsVoted }} votes from {{ getNrOfParticipantsJoined }} participants.</p>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "getNrOfParticipantsVoted",
      "getNrOfParticipantsJoined"])
  },
};
</script>

<style scoped>
p {
  font-style: italic;
}
</style>
