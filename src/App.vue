<template>
  <div>
    <h1>Planning Poker</h1>
    <p>Invite your team members by copying the url and start voting 🚀!</p>
    <p>
      Once everyone has submitted their vote, click the button to show the
      results.
    </p>
    <button @click="toggleResults">
      {{ showResults ? "Hide votes" : "Show votes" }}
    </button>
    <h2>Cards</h2>
    <div class="cardlist">
      <div class="card" v-for="(card, index) in cards" :key="card.number" :id="card.number" @click="vote(index, card.number)">
        <p :class="{'selected' : selected === card.number}">{{ card.visual }}</p>
        <p class="votecount" v-if="showResults">{{ card.count }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      selected: null,
      showResults: false,
      cards: [
        {
          number: "0",
          count: 0,
          visual: ` .----------------. 
| .--------------. |
| |     ____     | |
| |   .'    '.   | |
| |  |  .--.  |  | |
| |  | |    | |  | |
| |  |  '--'  |  | |
| |   '.____.'   | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "1",
          count: 0,
          visual: ` .----------------.
| .--------------. |
| |     __       | |
| |    /  |      | |
| |    '| |      | |
| |     | |      | |
| |    _| |_     | |
| |   |_____|    | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "2",
          count: 0,
          visual: ` .----------------. 
| .--------------. |
| |    _____     | |
| |   / ___ '.   | |
| |  |_/___) |   | |
| |   .'____.'   | |
| |  / /____     | |
| |  |_______|   | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "3",
          count: 0,
          visual: ` .----------------. 
| .--------------. |
| |    ______    | |
| |   / ____ '.  | |
| |   ''  __) |  | |
| |   _  |__ '.  | |
| |  | |____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "5",
          count: 0,
          visual: ` .----------------. 
| .--------------. |
| |   _______    | |
| |  |  _____|   | |
| |  | |____     | |
| |  '_.____''.  | |
| |  | \\____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "8",
          count: 0,
          visual: ` .----------------. 
| .--------------. |
| |     ____     | |
| |   .' __ '.   | |
| |   | (__) |   | |
| |   .'____'.   | |
| |  | (____) |  | |
| |  '.______.'  | |
| |              | |
| '--------------' |
 '----------------'`,
        },
        {
          number: "13",
          count: 0,
          visual: ` .--------------------------.
| .------------------------. |
| |     __      ______     | |
| |    /  |    / ____ '.   | |
| |    '| |    ''  __) |   | |
| |     | |    _  |__ '.   | |
| |    _| |_  | |____) |   | |
| |   |_____|  \\______.'   | |
| |                        | |
| '------------------------' |
 '--------------------------'`,
        },
        {
          number: "21",
          count: 0,
          visual: ` .--------------------------.
| .------------------------. |
| |     _____      __      | |
| |    / ___ '.   /  |     | |
| |   |_/___) |   '| |     | |
| |    .'____.'    | |     | |
| |   / /____     _| |_    | |
| |   |_______|  |_____|   | |
| |                        | |
| '------------------------' |
 '--------------------------'`,
        },
      ],
    };
  },
  methods: {
    toggleResults() {
      this.showResults = !this.showResults;
    },
    vote(cardIndex, number) {
      this.selected = number;
      this.cards[cardIndex].count++;
    },
  },
};
</script>

<style>
body {
  font-family: "Courier New", monospace;
}

.cardlist {
  flex-direction: row;
  flex-flow: row wrap;
  display: flex;
}

.card > p {
  margin: 0px;
  white-space: pre;
}

.votecount {
  text-align: center;
}

.card:hover {
  font-weight: bold;
}

.selected {
  font-weight: bold;
  color: red;
}

button {
  font-family: "Courier New", monospace;
}
</style>
