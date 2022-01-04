<template>
  <div>
    <h1><span class="red">♥</span>♣🚽 Agile Flush 🚽♠<span class="red">♦</span></h1>
    <p>The No. 1 and No. 2 place for online planning poker!</p>
    <ol>
      <li :class="{ strike: hasSessionStarted }">Start a new session.</li>
      <li :class="{ strike: haveParticipantsJoined }">Invite your team members by copying &amp; sharing the url.</li>
      <li :class="{ strike: isAnyCardSelectedByClient }">Start voting for the user stories!</li>
    </ol>
    <button v-if="!hasSessionStarted" @click="start">
      {{ hasSessionStarted ? "Start new session" : "Start session" }}
    </button>
    <SessionSection />
    <FooterSection />
  </div>
</template>

<script>
import SessionSection from "./SessionSection.vue";
import FooterSection from "./FooterSection.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    SessionSection,
    FooterSection
  },
  computed: {
    ...mapGetters(["sessionId", "hasSessionStarted", "haveParticipantsJoined", "isAnyCardSelectedByClient"])
  },
  methods: {
    ...mapActions(["instantiateAblyConnection", "startSession"]),
    async start() {
      this.startSession();
      this.instantiateAblyConnection({ sessionId: this.sessionId });
      document.title = `Agile Flush - ${this.sessionId}`;
      await this.$router.replace({ path: "/", query: { sessionId: this.sessionId } });
      navigator.clipboard.writeText(window.location.href);
    }
  }
};
</script>

<style>
.strike {
  text-decoration: line-through;
}

button {
  font-family: "Courier New", monospace;
  padding: 1em;
  margin-right: 1em;
}

a,
.red {
  color: #e40000;
}
</style>
