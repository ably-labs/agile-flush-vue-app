<template>
  <TheMainPage />
</template>

<script>
import TheMainPage from "./components/TheMainPage.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    TheMainPage,
  },
  computed: {
    ...mapGetters(["getSessionId"]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
    routeClientId() {
      return this.$route.query.clientId;
    },
  },
  beforeMount() {
    if (this.routeSessionId !== undefined) {
      this.startSession(this.routeSessionId);
      let sessionId = this.getSessionId;
      document.title = `Agile Flush - ${sessionId}`;
      this.instantiateAblyConnection( { "sessionId": sessionId, "clientId": this.routeClientId });
    }
  },
  unmounted() {
    this.closeAblyConnection();
  },
  methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "closeAblyConnection",
      "startSession",
    ]),
  },
};
</script>
<style>
body {
  font-family: "Courier New", monospace;
  color: black;
  background-color: white;
}
</style>
