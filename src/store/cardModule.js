export const cardModule = {
  state: () => ({
    cards: [
      {
        number: "0",
        count: [],
        style: "card0",
      },
      {
        number: "0.5",
        count: [],
        style: "card05",
      },
      {
        number: "1",
        count: [],
        style: "card1",
      },
      {
        number: "2",
        count: [],
        style: "card2",
      },
      {
        number: "3",
        count: [],
        style: "card3",
      },
      {
        number: "5",
        count: [],
        style: "card5",
      },
      {
        number: "8",
        count: [],
        style: "card8",
      },
      {
        number: "13",
        count: [],
        style: "card13",
      },
      {
        number: "21",
        count: [],
        style: "card21",
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
