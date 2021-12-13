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
  },
  methods: {
    ...mapActions([
      "instantiateAblyConnection",
      "closeAblyConnection",
      "startSession",
    ]),
  },
  created() {
    console.log("created", this.routeSessionId);
    if (this.routeSessionId != null && this.routeSessionId != undefined) {
      this.startSession(this.routeSessionId);
      let sessionId = this.getSessionId;
      this.instantiateAblyConnection(sessionId);
    }
  },
  destroyed() {
    this.closeAblyConnection();
  }
};
</script>
