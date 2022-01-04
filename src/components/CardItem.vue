<template>
  <div :id="card.number">
    <button class="visual" :class="[card.style, { selected: isCardSelectedByClient(card.number) }]" @click="selectCard(card.number)" />
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
  content: " .----------------.\A
| .--------------. |\A
| |     ____     | |\A
| |   .'    '.   | |\A
| |  |  .--.  |  | |\A
| |  | |    | |  | |\A
| |  |  '--'  |  | |\A
| |   '.____.'   | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card05::before {
  content: " .----------------.\A
| .--------------. |\A
| | __           | |\A
| |/  |   / ___  | |\A
| |`| |  / / _ `.| |\A
| | | | / |_/_) || |\A
| | |_|/   .'__.'| |\A
| |   /   / /___ | |\A
| |       |_____|| |\A
| '--------------' |\A
 '----------------'";
}

.card1::before {
  content: " .----------------.\A
| .--------------. |\A
| |     __       | |\A
| |    /  |      | |\A
| |    '| |      | |\A
| |     | |      | |\A
| |    _| |_     | |\A
| |   |_____|    | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card2::before {
  content: " .----------------.\A
| .--------------. |\A
| |    _____     | |\A
| |   / ___ '.   | |\A
| |  |_/___) |   | |\A
| |   .'____.'   | |\A
| |  / /____     | |\A
| |  |_______|   | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card3::before {
  content: " .----------------.\A
| .--------------. |\A
| |    ______    | |\A
| |   / ____ '.  | |\A
| |   ''  __) |  | |\A
| |   _  |__ '.  | |\A
| |  | |____) |  | |\A
| |   \\______.'  | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card5::before {
  content: " .----------------.\A
| .--------------. |\A
| |   _______    | |\A
| |  |  _____|   | |\A
| |  | |____     | |\A
| |  '_.____''.  | |\A
| |  | \\____) |  | |\A
| |   \\______.'  | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card8::before {
  content: " .----------------.\A
| .--------------. |\A
| |     ____     | |\A
| |   .' __ '.   | |\A
| |   | (__) |   | |\A
| |   .'____'.   | |\A
| |  | (____) |  | |\A
| |  '.______.'  | |\A
| |              | |\A
| '--------------' |\A
 '----------------'";
}

.card13::before {
  content: " .--------------------------.\A
| .------------------------. |\A
| |     __      ______     | |\A
| |    /  |    / ____ '.   | |\A
| |    '| |    ''  __) |   | |\A
| |     | |    _  |__ '.   | |\A
| |    _| |_  | |____) |   | |\A
| |   |_____|  \\______.'   | |\A
| |                        | |\A
| '------------------------' |\A
 '--------------------------'";
}

.card21::before {
  content: " .--------------------------.\A
| .------------------------. |\A
| |     _____      __      | |\A
| |    / ___ '.   /  |     | |\A
| |   |_/___) |   '| |     | |\A
| |    .'____.'    | |     | |\A
| |   / /____     _| |_    | |\A
| |   |_______|  |_____|   | |\A
| |                        | |\A
| '------------------------' |\A
 '--------------------------'";
}
</style>
