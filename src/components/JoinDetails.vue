<template>
    <p>Joined: {{ nrOfPeople }}</p>
</template> 

<script>
export default {
    name: "JoinDetails",
    props: {
        nrOfPeople: Number,
    }
}
</script>

<style scoped>
p {
    font-style: italic;
}
</style>
