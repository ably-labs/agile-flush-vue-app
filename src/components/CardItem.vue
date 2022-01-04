<template>
  <div :id="card.number">
    <button
      class="visual"
      :class="[card.style, { selected: isCardSelectedByClient(card.number) }]"
      @click="selectCard(card.number)"
    />
    <p v-if="showResults" class="votecount">
      {{ voteCountForCard(card.number) }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CardItem",
  props: {
    card: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      "showResults",
      "sessionId",
      "clientId",
      "isCardSelectedByClient",
      "isAnyCardSelectedByClient",
      "voteCountForCard"
    ]),
    routeSessionId() {
      return this.$route.query.sessionId;
    },
    routeClientId() {
      return this.$route.query.clientId;
    }
  },
  methods: {
    ...mapActions(["doVote", "undoVote"]),
    async selectCard(number) {
      if (this.isAnyCardSelectedByClient === false) {
        this.doVote(number);
      } else if (this.isAnyCardSelectedByClient && this.isCardSelectedByClient(this.card.number)) {
        this.undoVote(number);
      }
      if (this.routeSessionId === undefined || this.routeClientId === undefined) {
        await this.$router.replace({
          path: "/",
          query: { sessionId: this.sessionId, clientId: this.clientId }
        });
      }
    }
  }
};
</script>

<style scope>
button.visual {
  margin: 2px;
  padding: 2px;
  white-space: pre;
  border-radius: 15px;
  background-color: #f5f5f6;
  border: none;
}

button.selected {
  font-weight: bold;
  color: white;
  background-color: #e40000;
}

button.visual:hover {
  font-weight: bold;
}

.votecount {
  font-weight: bold;
  text-align: center;
  margin: 2px;
}
.card0::before {
  content: " .---------------.\A| .--------------. |\A| |     ____     | |\A| |   .\0027     \0027.   | |\A| |  |  .--.  |  | |\A| |  | |    | |  | |\A| |  |  \0027 --\0027   |  | |\A| |   \0027 .____.\0027    | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card05::before {
  content: " .----------------.\A| .--------------. |\A| | __           | |\A| |\002F   |   \002F  ___  | |\A| |\0060 | |  \002F  \002F  _ \0060 .| |\A| | | | \002F  |_\002F _\0029  || |\A| | |_|\002F    .\0027 __.\0027 | |\A| |   \002F    \002F  \002F ___ | |\A| |       |_____|| |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card1::before {
  content: " .----------------.\A| .--------------. |\A| |     __       | |\A| |    \002F   |      | |\A| |    \0027 | |      | |\A| |     | |      | |\A| |    _| |_     | |\A| |   |_____|    | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card2::before {
  content: " .----------------.\A| .--------------. |\A| |    _____     | |\A| |   \002F  ___ \0027 .   | |\A| |  |_/___\0029  |   | |\A| |   .\0027 ____.\0027    | |\A| |  \002F  \002F ____     | |\A| |  |_______|   | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card3::before {
  content: " .----------------.\A| .--------------. |\A| |    ______    | |\A| |   \002F  ____ \0027 .  | |\A| |   \0027 \0027   __\0029  |  | |\A| |   _  |__ \0027 .  | |\A| |  | |____\0029  |  | |\A| |   \005C ______.\0027   | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card5::before {
  content: " .----------------.\A| .--------------. |\A| |   _______    | |\A| |  |  _____|   | |\A| |  | |____     | |\A| |  \0027 _.____\0027 \0027 .  | |\A| |  | \005C ____\0029  |  | |\A| |   \005C ______.\0027   | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card8::before {
  content: " .----------------.\A| .--------------. |\A| |     ____     | |\A| |   .\0027  __ \0027 .   | |\A| |   | (__\0029  |   | |\A| |   .\0027 ____\0027 .   | |\A| |  | (____\0029  |  | |\A| |  \0027 .______.\0027   | |\A| |              | |\A| \0027 --------------\0027  |\A \0027 ----------------\0027 ";
}

.card13::before {
  content: " .-----------------------.\A| .---------------------. |\A| |   __      ______    | |\A| |  \002F   |    \002F  ____ \0027 .  | |\A| |  \0027 | |    \0027 \0027   __\0029  |  | |\A| |   | |    _  |__ \0027.  | |\A| |  _| |_  | |____\0029  |  | |\A| | |_____|  \005C ______.\0027   | |\A| |                     | |\A| \0027 ---------------------\0027  |\A \0027 ------------------------\0027";
}

.card21::before {
  content: " .-----------------------.\A| .---------------------. |\A| |    _____      __    | |\A| |   \002F  ___ \0027 .   \002F   |   | |\A| |  |_\002F ___\0029  |   \0027 | |   | |\A| |   .\0027 ____.\0027     | |   | |\A| |  \002F  \002F ____     _| |_  | |\A| |  |_______|  |_____| | |\A| |                     | |\A| \0027 ---------------------\0027  |\A \0027 -----------------------\0027 ";
}
</style>
