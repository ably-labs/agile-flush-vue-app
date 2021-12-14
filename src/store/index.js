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
    participantsVotedDict: {},
    nrOfParticipantsVoted: 0,
    channelNames: {
      voting: "voting",
    },
    channelInstances: {
      voting: null,
    },
    showResults: false,
    isAnyCardSelected: false,
    cards: [
      {
        number: "0",
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
        count: [],
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
    getNrOfParticipantsJoined: (state) => state.participantsJoinedArr.length,
    getHaveParticipantsJoined: (state) => state.participantsJoinedArr.length > 1,
    getNrOfParticipantsVoted: (state) => state.nrOfParticipantsVoted,
    getShowResults: (state) => state.showResults,
    getCards: (state) => state.cards,
    getIsAnyCardSelected: (state) => state.isAnyCardSelected,
    getCardIndex: (state) => (cardNumber) => {
      return state.cards.findIndex(card => card.number === cardNumber);
    },
    getVoteCountForCard: (state) => (cardNumber) => {
      return state.cards.filter(card => card.number === cardNumber)[0].count.length;
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
    addParticipantJoined(state, clientId) {
      if (!state.participantsJoinedArr.includes(clientId)) {
        state.participantsJoinedArr.push(clientId);
      }
    },
    removeParticipantJoined(state, clientId) {
      state.participantsJoinedArr.splice(
        state.participantsJoinedArr.findIndex(
          (participant) => participant.id === clientId
        ),
        1
      );
    },
    addParticipantVoted(state, clientVote) {
      console.log("addParticipantVoted", clientVote);
      let index = this.getters.getCardIndex(clientVote.cardNumber);
      if (!state.cards[index].count.includes(clientVote.clientId)) {
        state.cards[index].count.push(clientVote.clientId);
      }
      state.participantsVotedDict[clientVote.clientId] = clientVote.cardNumber;
      state.nrOfParticipantsVoted++;
    },

    removeParticipantVoted(state, clientVote) {
      console.log("removeParticipantVoted", clientVote);
      let index = this.getters.getCardIndex(clientVote.cardNumber);
      if (state.cards[index].count.includes(clientVote.clientId)) {
        state.cards[index].count.splice(
          state.cards[index].count.findIndex(
            id => id === clientVote.clientId
          ),
          1
        );
      }

      delete state.participantsVotedDict[clientVote.clientId];
      if (state.nrOfParticipantsVoted > 0) {
        state.nrOfParticipantsVoted--;
      }
    },
    setNrOfParticipantsVoted(state, number) {
      state.nrOfParticipantsVoted = number;
    },
    setParticipantVotedDict(state, participantsVoted) {
      state.participantsVotedDict = participantsVoted;
    },
    toggleShowResults(state) {
      state.showResults = !state.showResults;
    },
    setShowResults(state, showResults) {
      state.showResults = showResults;
    },
    resetCards(state) {
      state.cards.forEach(card => {
        card.count = [];
        card.isSelected = false;
      });
      state.isAnyCardSelected = false;
    },
    checkClientVotes(state) {
      state.cards.forEach(card => {
        card.count = [];
        card.isSelected = false;
      });
    },
    setNrOfParticipantVoted(state, nrOfParticipantsVoted) {
      state.nrOfParticipantsVoted = nrOfParticipantsVoted;
    },
    selectCard(state, cardNumber) {
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].isSelected = true;
      state.isAnyCardSelected = true;
    },
    deselectCard(state, cardNumber) {
      let index = this.getters.getCardIndex(cardNumber);
      state.cards[index].isSelected = false;
      state.isAnyCardSelected = false;
    },
  },

  actions: {
    instantiateAblyConnection(vueContext, sessionId = null) {
      if (!this.getters.getIsAblyConnectedStatus) {
        const ablyInstance = new Ably.Realtime({
          authUrl: "/api/createTokenRequest",
          echoMessages: false,
        });
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
          vueContext.dispatch("getExistingAblyPresenceSet");
          vueContext.dispatch("subscribeToAblyPresence");
          vueContext.dispatch("enterClientInAblyPresenceSet");
        });
        ablyInstance.connection.once("disconnected", () => {
          vueContext.commit("setAblyConnectionStatus", false);
        });
      }
    },

    attachToAblyChannels(vueContext) {
      const channelName = `${this.state.channelNames.voting}-${this.state.sessionId}`;
      console.log("channelName", channelName);
      const votingChannel = this.state.ablyRealtimeInstance.channels.get(
        channelName,
        {
          params: { rewind: "2m" },
        }
      );
      vueContext.commit("setAblyChannelInstances", {
        voting: votingChannel,
      });
      vueContext.dispatch("subscribeToAblyVoting");
    },

    enterClientInAblyPresenceSet() {
      this.state.channelInstances.voting.presence.enter({
        id: this.state.ablyClientId,
      });
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

    handleNewParticipantEntered(vueContext, participant) {
      console.log("handleNewParticipantEntered", participant);
      vueContext.commit("addParticipantJoined", participant.clientId);
    },

    handleExistingParticipantLeft(vueContext, participant) {
      console.log("handleExistingParticipantLeft", participant);
      vueContext.commit("removeParticipantJoined", participant.clientId);
      if (this.state.participantsVotedDict[participant.clientId] !== undefined) {
        vueContext.commit("removeParticipantVoted", { "clientId": participant.clientId, "cardNumber": this.state.participantsVotedDict[participant.clientId] });
      }
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

    handleVoteReceived(vueContext, msg) {
      console.log("handleVoteReceived", msg);
      vueContext.commit("addParticipantVoted", { "clientId": msg.clientId, "cardNumber": msg.data.cardNumber} );
    },

    handleUndoVoteReceived(vueContext, msg) {
      console.log("handleUndoVoteReceived", msg);
      vueContext.commit("removeParticipantVoted", { "clientId": msg.clientId, "cardNumber": msg.data.cardNumber });
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

    publishResetVotingToAbly({ state }) {
      state.channelInstances.voting.publish("reset-voting", {});
    },

    commonResetVoting(vueContext) {
      let flush = new Audio("flush.mp3");
      flush.play();
      vueContext.commit("resetCards");
      vueContext.commit("setShowResults", false);
      vueContext.commit("setNrOfParticipantsVoted", 0);
      vueContext.commit("setParticipantVotedDict", {});
    },

    closeAblyConnection() {
      console.log("closeAblyConnection");
      this.state.ablyRealtimeInstance.connection.close();
    },

    toggleShowResults(vueContext) {
      vueContext.commit("toggleShowResults");
      vueContext.dispatch("publishShowResultsToAbly", this.getters.getShowResults);
    },

    publishShowResultsToAbly({ state }, showResults) {
      state.channelInstances.voting.publish("show-results", {
        showResults: showResults,
      });
    },

    doVote(vueContext, cardNumber) {
      console.log("doVote", cardNumber);
      vueContext.commit("selectCard", cardNumber);
      vueContext.commit("addParticipantVoted", { "clientId": this.state.ablyClientId, "cardNumber": cardNumber });
      vueContext.dispatch("publishVoteToAbly", cardNumber);
    },

    publishVoteToAbly({ state }, cardNumber) {
      console.log("publishVoteToAbly", cardNumber);
      state.channelInstances.voting.publish("vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber,
      });
    },

    undoVote(vueContext, cardNumber) {
      vueContext.commit("deselectCard", cardNumber);
      vueContext.commit("removeParticipantVoted", { "clientId": this.state.ablyClientId, "cardNumber": cardNumber } );
      vueContext.dispatch("publishUndoVoteToAbly", cardNumber);
    },

    publishUndoVoteToAbly({ state }, cardNumber) {
      state.channelInstances.voting.publish("undo-vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber,
      });
    },
  },
});
