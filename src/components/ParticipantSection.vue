<template>
  <p>Received {{ numberOfParticipantsVoted }} votes from {{ numberOfParticipantsJoined }} participants.</p>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ParticipantSection",
  computed: {
    ...mapGetters([
      "numberOfParticipantsVoted",
      "numberOfParticipantsJoined"]),
  }
};
</script>

<style scoped>
p {
  font-style: italic;
}
</style>
