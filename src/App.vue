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
  methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "closeAblyConnection",
      "startSession",
    ]),
  },
  created() {
    console.log("created", this.routeSessionId, this.routeClientId);
    if (this.routeSessionId !== undefined) {
      this.startSession(this.routeSessionId);
      let sessionId = this.getSessionId;
      document.title = `Agile Flush - ${sessionId}`;
      this.instantiateAblyConnection( { "sessionId": sessionId, "clientId": this.routeClientId });
    }
  },
  destroyed() {
    this.closeAblyConnection();
  }
};
</script>
