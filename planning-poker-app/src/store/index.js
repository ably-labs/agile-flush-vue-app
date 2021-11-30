import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nrOfParticipantsJoined: 0,
    nrOfParticipantsVoted: 0,
    showResults: false,
    cards: [
      {
        number: "0",
        count: 0,
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
        isSelected: false,
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
  },
  mutations: {
    toggleShowResults(state) {
      state.showResults = !state.showResults;
    },
    selectCard(state, cardNumber) {
      let index = state.cards.findIndex((card) => card.number === cardNumber);
      state.cards[index].isSelected = true;
      state.cards[index].count++;
      state.nrOfParticipantsVoted++;
    },
    deselectCard(state, cardNumber) {
      let index = state.cards.findIndex((card) => card.number === cardNumber);
      state.cards[index].isSelected = false;
      state.cards[index].count--;
      state.nrOfParticipantsVoted++;
    },
    reset(state) {
      state.cards.forEach((card) => {
        card.count = 0;
        card.isSelected = false;
      });
      state.showResults = false;
    }
  },
});
