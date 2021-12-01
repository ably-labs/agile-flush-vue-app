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
    nrOfParticipantsJoined: 0,
    nrOfParticipantsVoted: 0,
    participantsArr: [],
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
    getVotingChannel: state => state.channelInstances.voting,
    getVotingMessage: state => state.channelMessages.voting,
    getNrOfParticipantsJoined: state => state.nrOfParticipantsJoined,
    getNrOfParticipantsVoted: state => state.nrOfParticipantsVoted,
    getShowResults: state => state.showResults,
    getCardsSortedByCountDescending: state => {
      return state.cards
        .filter(card => card.count > 0)
        .sort(function(a, b) { b.count - a.count });
    }
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
    setParticipantsJoined(state, count) {
      state.nrOfParticipantsJoined = count;
    },
    incrementParticipantsJoined(state) {
      state.nrOfParticipantsJoined++;
    },
    decrementParticipantsJoined(state) {
      state.nrOfParticipantsJoined--;
    },
    addParticipant(state, participant) {
      state.participantsArr.push(participant);
    },
    removeParticipant(state, clientId) {
      state.participantsArr.splice(
        state.participantsArr.findIndex(
          participant => participant.id === clientId
        ),
        1
      );
    },
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
      state.nrOfParticipantsVoted = 0;
    }
  },
  actions: {
    //Ably init
    instantiateAbly(vueContext) {
      const ablyInstance = new Ably.Realtime({
        authUrl: '/auth',
        echoMessages: false
      });
      ablyInstance.connection.once("connected", () => {
        vueContext.commit("setAblyConnectionStatus", true);
        vueContext.commit("setAblyRealtimeInstance", ablyInstance);
        vueContext.commit(
          "setAblyClientId",
          this.state.ablyRealtimeInstance.auth.clientId
        );
        vueContext.dispatch("attachToAblyChannels");
        vueContext.dispatch("getExistingAblyPresenceSet");
        vueContext.dispatch("subscribeToAblyPresence");
        vueContext.dispatch("enterClientInAblyPresenceSet");
      });
    },
    attachToAblyChannels(vueContext) {
      const votingChannel = this.state.ablyRealtimeInstance.channels.get(
        this.state.channelNames.voting +
          "-" +
          this.state.sessionId
      );

      vueContext.commit("setAblyChannelInstances", {
        voting: votingChannel
      });

      vueContext.dispatch("subscribeToChannels");
    },

    subscribeToChannels({ state, dispatch }) {
      state.channelInstances.comments.subscribe(msg => {
        state.channelMessages.commentsChMsg = msg;
      });
      state.channelInstances.mainParty.subscribe(msg => {
        state.channelMessages.mainPartyChMsg = msg;
      });
      state.channelInstances.video.subscribe(msg => {
        if (msg.name === "general-status-request" && state.isAdmin) {
          dispatch("publishCurrentVideoStatus", "general-status");
        } else if (!state.isAdmin && msg.name !== "general-status-request") {
          state.channelMessages.videoChMsg = msg;
        }
      });
    },

    publishCurrentVideoStatus({ state }, updateEvent) {
      console.log("ADMIN PUBLISHING", updateEvent);
      state.channelInstances.video.publish(
        updateEvent,
        this.state.currentVideoStatus
      );
    },

    getExistingAblyPresenceSet(vueContext) {
      this.state.channelInstances.voting.presence.get((err, participants) => {
        if (!err) {
          for (let i = 0; i < participants.length; i++) {
            vueContext.commit("addParticipant", {
              clientId: participants[i].clientId
            });
          }
          console.log(participants);
          vueContext.commit("setParticipantsJoined", participants.length);
        } else {
          console.log(err);
        }
      });
    },

    subscribeToAblyPresence(vueContext) {
      this.state.channelInstances.voting.presence.subscribe(
        "enter",
        msg => {
          vueContext.dispatch("handleNewMemberEntered", msg);
        }
      );
      this.state.channelInstances.voting.presence.subscribe(
        "leave",
        msg => {
          vueContext.dispatch("handleExistingMemberLeft", msg);
        }
      );
    },

    handleNewMemberEntered(vueContext, member) {
      vueContext.commit("setPresenceIncrement");
      vueContext.commit("setOnlineMembersArrInsert", {
        id: member.clientId,
        username: member.data.username,
        isAdmin: member.data.isAdmin
      });
    },

    handleExistingMemberLeft(vueContext, member) {
      if (member.data.isAdmin) {
        vueContext.commit("setAdminLeaveStatus");
      }
      vueContext.commit("setOnlineMembersArrRemoval", member.id);
      vueContext.commit("setPresenceDecrement");
    },

    enterClientInAblyPresenceSet(vueContext) {
      this.state.channelInstances.mainParty.presence.enter({
        username: this.state.username,
        isAdmin: this.state.isAdmin
      });
      if (this.state.isAdmin) {
        vueContext.dispatch("showShareableCode");
      }
    },

    requestInitialVideoStatus({ state }) {
      state.channelInstances.video.publish(
        "general-status-request",
        "request"
      );
    },

    publishMyCommentToAbly({ state }, commentMsg) {
      state.channelInstances.comments.publish("comment", {
        username: state.username,
        content: commentMsg
      });
    },

    //Utility methods
    showShareableCode(vueContext) {
      vueContext.commit("setShouldShowCodeStatus", true);
    },
    generateWatchPartyCode(vueContext) {
      const uniqueCode = Math.random()
        .toString(36)
        .substr(2, 16);
      vueContext.commit("setWatchPartyRoomCode", uniqueCode);
    }
  }
});
