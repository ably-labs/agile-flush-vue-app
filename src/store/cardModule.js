export const cardModule = {
  state: () => ({
    cards: [
      {
        number: "0",
        count: [],
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
        number: "0.5",
        count: [],
        visual: ` .----------------.
| .--------------. |
| | __           | |
| |/  |   / ___  | |
| |\`| |  / / _ \`.| |
| | | | / |_/_) || |
| | |_|/   .'__.'| |
| |   /   / /___ | |
| |       |_____|| |
| '--------------' |
 '----------------'`,
      },
      {
        number: "1",
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
    ]
  }),
  getters: {
    cards: (state) => state.cards,
    cardIndex: (state) => (cardNumber) => {
      return state.cards.findIndex((card) => card.number === cardNumber);
    },
    voteCountForCard: (state) => (cardNumber) => {
      return state.cards.filter((card) => card.number === cardNumber)[0].count
        .length;
    },
    isCardSelectedByClient: (state, getters) => (cardNumber) => {
      let clientIds = state.cards.filter(card => card.number === cardNumber)[0].count;
      if (clientIds.length > 0) {
        return clientIds.includes(getters.clientId);
      } else {
        return false;
      }
    },
    isAnyCardSelectedByClient: (state, getters) => {
      let cardCount = state.cards.filter(
        card => card.count.length > 0 && card.count.includes(getters.clientId)
      ).length;
      return cardCount > 0;
    },
    selectedCardForClient: (state) => (clientId) => {
      let selectedByClient = state.cards.filter(card =>
        card.count.length > 0 &&
        card.count.includes(clientId))[0];
      if (selectedByClient !== undefined) {
        return selectedByClient.number;
      }
      return null;
    },
    numberOfParticipantsVoted: (state) => {
      let concatenatedCount = [];
      state.cards.forEach(card => {
        concatenatedCount.push(...card.count);
      });
      return concatenatedCount.length;
    }
  },
  mutations: {
    addParticipantVoted(state, clientVote) {
      let index = this.getters.cardIndex(clientVote.cardNumber);
      if (!state.cards[index].count.includes(clientVote.clientId)) {
        state.cards[index].count.push(clientVote.clientId);
      }
    },
    removeParticipantVoted(state, clientVote) {
      let index = this.getters.cardIndex(clientVote.cardNumber);
      if (state.cards[index].count.includes(clientVote.clientId)) {
        state.cards[index].count.splice(
          state.cards[index].count.findIndex(
            id => id === clientVote.clientId
          ),
          1
        );
      }
    },
    resetCards(state) {
      state.cards.forEach(card => {
        card.count = [];
      });
    },
  },
  actions: {
    doVote({ dispatch, commit, getters }, cardNumber) {
      let clientVote = {
        clientId: getters.clientId,
        cardNumber: cardNumber,
      };
      commit("addParticipantVoted", clientVote);
      dispatch("publishVoteToAbly", clientVote);
    },
    undoVote({ dispatch, commit, getters }, cardNumber) {
      let clientVote = {
        clientId: getters.clientId,
        cardNumber: cardNumber,
      };
      commit("removeParticipantVoted",  clientVote);
      dispatch("publishUndoVoteToAbly", clientVote);
    },
  }
}
