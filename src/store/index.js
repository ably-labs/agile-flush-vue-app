import Vue from "vue";
import Vuex from "vuex";
import * as Ably from 'ably';

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
      voting: "voting"
    },
    channelInstances: {
      voting: null
    },
    channelMessages : {
      voting: null
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
    getIsAblyConnectedStatus: state => state.isAblyConnected,
    getSessionId: state => state.sessionId,
    getSessionStarted: state => state.sessionId !== null && state.sessionId !== undefined,
    getVotingChannel: state => state.channelInstances.voting,
    getVotingMessage: state => state.channelMessages.voting,
    getNrOfParticipantsJoined: state => state.participantsJoinedArr.length,
    getNrOfParticipantsVoted: state => state.participantsVotedArr.length,
    getShowResults: state => state.showResults,
    getCards: state => state.cards,
    getCardsSortedByCountDescending: state => {
      return state.cards
        .filter(card => card.count > 0)
        .sort(function(a, b) { b.count - a.count });
    },
    getIsAnyCardSelected: state => state.isAnyCardSelected
  },
  mutations: {
    setAblyRealtimeInstance(state, ablyRealtimeInstance) {
      state.ablyRealtimeInstance = ablyRealtimeInstance
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
          participant => participant.id === clientId
        ),
        1
      );
    },
    addParticipantsVoted(state, clientId) {
      state.participantsVotedArr.push(clientId);
    },
    removeParticipantsVoted(state, clientId) {
      state.participantsVotedArr.splice(
        state.participantsVotedArr.findIndex(
          id => id === clientId
        ),
        1
      );
    },
    setParticipantsVoted(state, participantsVoted) {
      state.participantsVotedArr = participantsVoted;
    },
    toggleShowResults(state) {
      state.showResults = !state.showResults;
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
    setShowResults(state, showResults) {
      state.showResults = showResults;
    },
    selectCard(state, cardNumber) {
      let index = state.cards.findIndex((card) => card.number === cardNumber);
      state.cards[index].isSelected = true;
      state.cards[index].count++;
      state.isAnyCardSelected = true;
    },
    deselectCard(state, cardNumber) {
      let index = state.cards.findIndex((card) => card.number === cardNumber);
      state.cards[index].isSelected = false;
      state.cards[index].count--;
      state.isAnyCardSelected = false;
    }
  },

  actions: {

    instantiateAblyConnection(vueContext, sessionId = null) {
      console.log('instantiateAblyConnection-sessionId:', sessionId);
      const ablyInstance = new Ably.Realtime({
        authUrl: '/api/createTokenRequest',
        echoMessages: false
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
    },

    startSession(vueContext, sessionId) {
      vueContext.commit("setSessionId", sessionId);
      vueContext.dispatch("resetVoting");
    },

    resetVoting(vueContext) {
      vueContext.commit("resetCards");
      vueContext.commit("setShowResults", false);
      vueContext.commit("setParticipantsVoted", []);
    },

    closeAblyConnection() {
      this.state.ablyRealtimeInstance.connection.close();
    },

    attachToAblyChannels(vueContext) {
      const votingChannel = this.state.ablyRealtimeInstance.channels.get(
        `${this.state.channelNames.voting}-{this.state.sessionId}`
      );

      vueContext.commit("setAblyChannelInstances", {
        voting: votingChannel
      });

      vueContext.dispatch("subscribeToChannels");
    },

    subscribeToChannels({ state }) {
      state.channelInstances.voting.subscribe(msg => {
        state.channelMessages.voteMessage = msg;
      });
    },

    getExistingAblyPresenceSet(vueContext) {
      this.state.channelInstances.voting.presence.get((err, participants) => {
        if (!err) {
          console.log(participants);
          for (let i = 0; i < participants.length; i++) {
            vueContext.commit("addParticipantJoined", participants[i].clientId);
          }
        } else {
          console.log(err);
        }
      });
    },

    subscribeToAblyPresence(vueContext) {
      this.state.channelInstances.voting.presence.subscribe(
        "enter",
        msg => {
          vueContext.dispatch("handleNewParticipantEntered", msg);
        }
      );
      this.state.channelInstances.voting.presence.subscribe(
        "leave",
        msg => {
          vueContext.dispatch("handleExistingParticipantLeft", msg);
        }
      );
    },

    handleNewParticipantEntered(vueContext, participant) {
      console.log("handleNewParticipantEntered", participant.id);
      vueContext.commit("addParticipantJoined", participant.id);
    },

    handleExistingParticipantLeft(vueContext, participant) {
      console.log("handleExistingParticipantLeft", participant.id);
      vueContext.commit("removeParticipant", participant.id);
    },

    enterClientInAblyPresenceSet() {
      this.state.channelInstances.voting.presence.enter({
        id: this.state.ablyClientId
      });
    },

    toggleShowResults(vueContext) {
      vueContext.commit("toggleShowResults");
    },

    doVote(vueContext, cardNumber) {
      vueContext.commit("selectCard", cardNumber);
      vueContext.commit("addParticipantsVoted", this.state.ablyClientId);
      vueContext.dispatch("publishVoteToAbly", cardNumber);
    },
    undoVote(vueContext, cardNumber) {
      vueContext.commit("deselectCard", cardNumber);
      vueContext.commit("removeParticipantsVoted", this.state.ablyClientId);
      vueContext.dispatch("publishUndoVoteToAbly", cardNumber);
    },

    publishVoteToAbly({ state }, cardNumber) {
      state.channelInstances.voting.publish("vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber
      });
    },
    publishUndoVoteToAbly({ state }, cardNumber) {
      state.channelInstances.voting.publish("undo-vote", {
        id: state.ablyClientId,
        cardNumber: cardNumber
      });
    }
  }
});
