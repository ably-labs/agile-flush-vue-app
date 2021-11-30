<template>
    <p>Number of received votes: {{ this.$store.state.nrOfParticipantsVoted }}</p>
</template> 

<script>
export default {
}
</script>

<style scoped>
p {
    font-style: italic;
}
</style>
