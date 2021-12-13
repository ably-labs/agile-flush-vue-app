import Vue from "vue";
import Vuex from "vuex";
import * as Ably from "ably";
import { generateName } from "../util/nameGenerator.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ablyRealtimeInstance: null,
    isAblyConnected: false,
    ablyClientId: null,
    sessionId: null,
    participantsJoinedArr: [],
    participantsVotedArr: [],
    channelNames: {
      voting: "voting",
    },
    channelInstances: {
      voting: null,
    },
    channelMessages: {
      voting: null,
    },
    showResults: false,
    isAnyCardSelected: false,
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
        number: "0.5",
        count: 0,
        isSelected: false,
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
  getters: {
    getIsAblyConnectedStatus: (state) => state.isAblyConnected,
    getSessionId: (state) => state.sessionId,
    getSessionStarted: (state) =>
      state.sessionId !== null && state.sessionId !== undefined,
    getVotingChannel: (state) => state.channelInstances.voting,
    getVotingMessage: (state) => state.channelMessages.voting,
    getNrOfParticipantsJoined: (state) => state.participantsJoinedArr.length,
    getNrOfParticipantsVoted: (state) => state.participantsVotedArr.length,
    getHaveParticipantsJoined: (state) => state.participantsJoinedArr.length > 1,
    getShowResults: (state) => state.showResults,
    getCards: (state) => state.cards,
    getCardsSortedByCountDescending: (state) => {
      return state.cards
        .filter((card) => card.count > 0)
        .sort(function (a, b) {
          b.count - a.count;
        });
    },
    getIsAnyCardSelected: (state) => state.isAnyCardSelected,
    getCardIndex: (state) => (cardNumber) => {
      return state.cards.findIndex((card) => card.number === cardNumber);
    },
  },
  mutations: {
    setAblyRealtimeInstance(state, ablyRealtimeInstance) {
      state.ablyRealtimeInstance = ablyRealtimeInstance;
    },
    setAblyConnectionStatus(state, status) {
      state.isAblyConnected = status;
    },
    setAblyClientId(state, clientId) {
      state.ablyClientId = clientId;
    },
    setSessionId(state, sessionId) {
      state.sessionId = sessionId;
    },
    setAblyChannelInstances(state, { voting }) {
      state.channelInstances.voting = voting;
    },
    setParticipantsJoined(state, participantsJoined) {
      state.participantsJoinedArr = participantsJoined;
    },
    addParticipantJoined(state, clientId) {
      state.participantsJoinedArr.push(clientId);
    },
    removeParticipantJoined(state, clientId) {
      state.participantsJoinedArr.splice(
        state.participantsJoinedArr.findIndex(
          (participant) => participant.id === clientId
        ),
        1
      );
    },
    addParticipantsVoted(state, clientId) {
      console.log("addParticipantsVoted", clientId);
      state.participantsVotedArr.push(clientId);
    },
    removeParticipantsVoted(state, clientId) {
      state.participantsVotedArr.splice(
        state.participantsVotedArr.findIndex((id) => id === clientId),
        1
      );
    },
    setParticipantsVoted(state, participantsVoted) {
      state.participantsVotedArr = participantsVoted;
    },
    toggleShowResults(state) {
      state.showResults = !state.showResults;
    },
    setShowResults(state, showResults) {
      state.showResults = showResults;
    },
    resetCards(state) {
      state.cards.forEach((card) => {
        card.count = 0;
        card.isSelected = false;
      });
      state.isAnyCardSelected = false;
    },
    setNrOfParticipantVoted(state, nrOfParticipantsVoted) {
      state.nrOfParticipantsVoted = nrOfParticipantsVoted;
    },
    selectCard(state, cardNumber) {
      console.log("selectCard", cardNumber);
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].isSelected = true;
      state.isAnyCardSelected = true;
    },
    incrementCardCount(state, cardNumber) {
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].count++;
    },
    deselectCard(state, cardNumber) {
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].isSelected = false;
      state.isAnyCardSelected = false;
    },
    decrementCardCount(state, cardNumber) {
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].count--;
    },
  },

  actions: {
    instantiateAblyConnection(vueContext, sessionId = null) {
      console.log("instantiateAblyConnection-sessionId:", sessionId);
      const ablyInstance = new Ably.Realtime({
        authUrl: "/api/createTokenRequest",
        echoMessages: false,
      });
      console.log("auth: ", ablyInstance.auth);
      ablyInstance.connection.once("connected", () => {
        vueContext.commit("setAblyConnectionStatus", true);
        vueContext.commit("setAblyRealtimeInstance", ablyInstance);
        vueContext.commit(
          "setAblyClientId",
          this.state.ablyRealtimeInstance.auth.clientId
        );
        if (sessionId) {
          vueContext.commit("setSessionId", sessionId);
        }
        vueContext.dispatch("attachToAblyChannels");
        vueContext.dispatch("enterClientInAblyPresenceSet");
        vueContext.dispatch("getExistingAblyPresenceSet");
        vueContext.dispatch("subscribeToAblyPresence");
      });
    },

    startSession(vueContext, routeSessionId) {
      console.log("startSession - routeId", routeSessionId);
      let sessionId;
      if (routeSessionId == null) {
        sessionId = generateName();
      } else {
        sessionId = routeSessionId;
      }
      vueContext.commit("setSessionId", sessionId);
    },

    resetVoting(vueContext) {
      vueContext.dispatch("commonResetVoting");
      vueContext.dispatch("publishResetVotingToAbly");
    },

    commonResetVoting(vueContext) {
      let flush = new Audio("flush.mp3");
      flush.play();
      vueContext.commit("resetCards");
      vueContext.commit("setShowResults", false);
      vueContext.commit("setParticipantsVoted", []);
    },

    closeAblyConnection() {
      console.log("closeAblyConnection");
      this.state.ablyRealtimeInstance.connection.close();
    },

    attachToAblyChannels(vueContext) {
      const channelName = `${this.state.channelNames.voting}-${this.state.sessionId}`;
      console.log("channelName", channelName);
      const votingChannel = this.state.ablyRealtimeInstance.channels.get(
        channelName,
        {
          params: { rewind: "5m" },
        }
      );

      vueContext.commit("setAblyChannelInstances", {
        voting: votingChannel,
      });

      vueContext.dispatch("subscribeToAblyVoting");
    },

    getExistingAblyPresenceSet(vueContext) {
      this.state.channelInstances.voting.presence.get((err, participants) => {
        if (!err) {
          console.log("getExistingAblyPresenceSet", participants);
          for (let i = 0; i < participants.length; i++) {
            vueContext.commit("addParticipantJoined", participants[i].clientId);
          }
        } else {
          console.log(err);
        }
      });
    },

    subscribeToAblyPresence(vueContext) {
      this.state.channelInstances.voting.presence.subscribe("enter", (msg) => {
        vueContext.dispatch("handleNewParticipantEntered", msg);
      });
      this.state.channelInstances.voting.presence.subscribe("leave", (msg) => {
        vueContext.dispatch("handleExistingParticipantLeft", msg);
      });
    },

    subscribeToAblyVoting(vueContext) {
      console.log("subscribeToAblyVoting");
      this.state.channelInstances.voting.subscribe("vote", (msg) => {
        vueContext.dispatch("handleVoteReceived", msg);
      });
      this.state.channelInstances.voting.subscribe("undo-vote", (msg) => {
        vueContext.dispatch("handleUndoVoteReceived", msg);
      });
      this.state.channelInstances.voting.subscribe("show-results", (msg) => {
        vueContext.dispatch("handleShowResultsReceived", msg);
      });
      this.state.channelInstances.voting.subscribe("reset-voting", (msg) => {
        vueContext.dispatch("handleResetVotesReceived", msg);
      });
    },

    handleNewParticipantEntered(vueContext, participant) {
      console.log("handleNewParticipantEntered", participant);
      vueContext.commit("addParticipantJoined", participant.clientId);
    },

    handleExistingParticipantLeft(vueContext, participant) {
      console.log("handleExistingParticipantLeft", participant);
      vueContext.commit("removeParticipantJoined", participant.clientId);
    },

    handleVoteReceived(vueContext, msg) {
      console.log("handleVoteReceived", msg);
      vueContext.commit("incrementCardCount", msg.data.cardNumber);
      vueContext.commit("addParticipantsVoted", msg.data.id);
    },

    handleUndoVoteReceived(vueContext, msg) {
      console.log("handleUndoVoteReceived", msg);
      vueContext.commit("decrementCardCount", msg.data.cardNumber);
      vueContext.commit("removeParticipantsVoted", msg.data.id);
    },

    handleShowResultsReceived(vueContext, msg) {
      console.log("handleToggleVisibilityReceived", msg);
      if (msg.data.showResults) {
        vueContext.commit("setShowResults", true);
      } else {
        vueContext.commit("setShowResults", false);
      }
    },

    handleResetVotesReceived(vueContext, msg) {
      console.log("handleResetVotesReceived", msg);
      vueContext.dispatch("commonResetVoting");
    },

    enterClientInAblyPresenceSet() {
      this.state.channelInstances.voting.presence.enter({
        id: this.state.ablyClientId,
      });
    },

    toggleShowResults(vueContext) {
      vueContext.commit("toggleShowResults");
      vueContext.dispatch("publishShowResultsToAbly", this.getters.getShowResults);
    },

    doVote(vueContext, cardNumber) {
      console.log("doVote", cardNumber);
      vueContext.commit("selectCard", cardNumber);
      vueContext.commit("incrementCardCount", cardNumber);
      vueContext.commit("addParticipantsVoted", this.state.ablyClientId);
      vueContext.dispatch("publishVoteToAbly", cardNumber);
    },
    undoVote(vueContext, cardNumber) {
      vueContext.commit("deselectCard", cardNumber);
      vueContext.commit("decrementCardCount", cardNumber);
      vueContext.commit("removeParticipantsVoted", this.state.ablyClientId);
      vueContext.dispatch("publishUndoVoteToAbly", cardNumber);
    },

    publishVoteToAbly({ state }, cardNumber) {
      console.log("publishVoteToAbly", cardNumber);
      state.channelInstances.voting.publish("vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber,
      });
    },

    publishUndoVoteToAbly({ state }, cardNumber) {
      state.channelInstances.voting.publish("undo-vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber,
      });
    },

    publishShowResultsToAbly({ state }, showResults) {
      state.channelInstances.voting.publish("show-results", {
        showResults: showResults,
      });
    },

    publishResetVotingToAbly({ state }) {
      state.channelInstances.voting.publish("reset-voting", {});
    },
  },
});
