<template>
  <div>
    <h1>Planning Poker</h1>
    <p>Invite your team members by copying the url and start voting 🚀!</p>
    <p>Once everyone has submitted their vote, click the button to show the results.</p>
        <button @click="toggleResults">{{showResults ? 'Hide votes' : 'Show votes'}}</button>
    <ul>
      <li class="cardlist" v-for="card in cards" :key="card.number">
        <code @click="vote(card.number)">{{ card.visual }}</code>
        <p v-if="showResults">{{card.count}}</p>
        </li>
    </ul>

  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      value: "World!!",
      showResults: false,
      cards: [
        {
          number: "0",
          count: 0,
          visual: `
 .----------------. 
| .--------------. |
| |     ____     | |
| |   .'    '.   | |
| |  |  .--.  |  | |
| |  | |    | |  | |
| |  |  '--'  |  | |
| |   '.____.'   | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "1",
          count: 0,
          visual: `
 .----------------.
| .--------------. |
| |     __       | |
| |    /  |      | |
| |    '| |      | |
| |     | |      | |
| |    _| |_     | |
| |   |_____|    | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "2",
          count: 0,
          visual: `
 .----------------. 
| .--------------. |
| |    _____     | |
| |   / ___ '.   | |
| |  |_/___) |   | |
| |   .'____.'   | |
| |  / /____     | |
| |  |_______|   | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "3",
          count: 0,
          visual: `
 .----------------. 
| .--------------. |
| |    ______    | |
| |   / ____ '.  | |
| |   ''  __) |  | |
| |   _  |__ '.  | |
| |  | |____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "5",
          count: 0,
          visual: `
 .----------------. 
| .--------------. |
| |   _______    | |
| |  |  _____|   | |
| |  | |____     | |
| |  '_.____''.  | |
| |  | \\____) |  | |
| |   \\______.'  | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "8",
          count: 0,
          visual: `
 .----------------. 
| .--------------. |
| |     ____     | |
| |   .' __ '.   | |
| |   | (__) |   | |
| |   .'____'.   | |
| |  | (____) |  | |
| |  '.______.'  | |
| |              | |
| '--------------' |
 '----------------'`
        },
        {
          number: "13",
          count: 0,
          visual: `
 .--------------------------.
| .------------------------. |
| |     __      ______     | |
| |    /  |    / ____ '.   | |
| |    '| |    ''  __) |   | |
| |     | |    _  |__ '.   | |
| |    _| |_  | |____) |   | |
| |   |_____|  \\______.'   | |
| |                        | |
| '------------------------' |
 '--------------------------'`
        },
        {
          number: "21",
          count: 0,
          visual: `
 .--------------------------.
| .------------------------. |
| |     _____      __      | |
| |    / ___ '.   /  |     | |
| |   |_/___) |   '| |     | |
| |    .'____.'    | |     | |
| |   / /____     _| |_    | |
| |   |_______|  |_____|   | |
| |                        | |
| '------------------------' |
 '--------------------------'`
        },
      ]
    };
  },
  methods: {
    toggleResults() {
      this.showResults = !this.showResults;
    },
    vote(cardNumber) {
      this.cards[cardNumber].count++;
    }
  }
};
</script>
<style>
  body {
    font-family: 'Courier New', monospace;
    white-space: pre;
  }

  .cardlist {
    list-style: none;
    display: inline-block;
    text-align: center;
  }

</style>