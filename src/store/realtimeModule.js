import * as Ably from 'ably';

export const realtimeModule = {
  state: () => ({
    ablyClientId: null,
    ablyRealtimeInstance: null,
    channelNames: {
      voting: 'voting',
    },
    channelInstances: {
      voting: null,
    },
    isAblyConnected: false,
    participantsJoinedArr: [],
  }),
  getters: {
    clientId: (state) => state.ablyClientId,
    haveParticipantsJoined: (state) => state.participantsJoinedArr.length > 1,
    isAblyConnected: (state) => state.isAblyConnected,
    numberOfParticipantsJoined: (state) => state.participantsJoinedArr.length,
  },
  mutations: {
    addParticipantJoined(state, clientId) {
      if (!state.participantsJoinedArr.includes(clientId)) {
        state.participantsJoinedArr.push(clientId);
      }
    },
    removeParticipantJoined(state, clientId) {
      state.participantsJoinedArr.splice(
        state.participantsJoinedArr.findIndex(
          (participant) => participant.id === clientId,
        ),
        1,
      );
    },
    setAblyChannelInstances(state, { voting }) {
      state.channelInstances.voting = voting;
    },
    setAblyClientId(state, clientId) {
      state.ablyClientId = clientId;
    },
    setAblyConnectionStatus(state, status) {
      state.isAblyConnected = status;
    },
    setAblyRealtimeInstance(state, ablyRealtimeInstance) {
      state.ablyRealtimeInstance = ablyRealtimeInstance;
    },
  },
  actions: {
    instantiateAblyConnection({
      dispatch, commit, state, getters,
    }, ids) {
      if (!getters.isAblyConnected) {
        const ablyInstance = new Ably.Realtime({
          authUrl: '/api/createTokenRequest',
          echoMessages: false,
        });
        ablyInstance.connection.on('connected', () => {
          commit('setAblyConnectionStatus', true);
          commit('setAblyRealtimeInstance', ablyInstance);
          commit(
            'setAblyClientId',
            ids.clientId ?? state.ablyRealtimeInstance.auth.clientId,
          );
          if (ids.sessionId) {
            commit('setSessionId', ids.sessionId);
          }
          dispatch('attachToAblyChannels').then(() => {
            dispatch('enterClientInAblyPresenceSet');
            dispatch('getExistingAblyPresenceSet').then(() => {
              dispatch('subscribeToAblyPresence');
            });
          });
        });

        ablyInstance.connection.on('disconnected', () => {
          commit('setAblyConnectionStatus', false);
        });
      }
    },
    closeAblyConnection({ state }) {
      state.ablyRealtimeInstance.connection.close();
    },
    async attachToAblyChannels({
      dispatch, commit, getters, state,
    }) {
      const channelName = `${state.channelNames.voting}-${getters.sessionId}`;
      const votingChannel = await state.ablyRealtimeInstance.channels.get(
        channelName,
        {
          params: { rewind: '2m' },
        },
      );
      commit('setAblyChannelInstances', {
        voting: votingChannel,
      });
      dispatch('subscribeToAblyVoting');
    },
    enterClientInAblyPresenceSet({ state }) {
      state.channelInstances.voting.presence.enter({
        id: state.ablyClientId,
      });
    },
    async getExistingAblyPresenceSet({ commit, state }) {
      await state.channelInstances.voting.presence.get((err, participants) => {
        if (!err) {
          for (let i = 0; i < participants.length; i++) {
            commit('addParticipantJoined', participants[i].clientId);
          }
        }
      });
    },
    subscribeToAblyPresence({ dispatch, state }) {
      state.channelInstances.voting.presence.subscribe('enter', (msg) => {
        dispatch('handleNewParticipantEntered', msg);
      });
      state.channelInstances.voting.presence.subscribe('leave', (msg) => {
        dispatch('handleExistingParticipantLeft', msg);
      });
    },

    handleNewParticipantEntered({ commit }, participant) {
      commit('addParticipantJoined', participant.clientId);
    },
    handleExistingParticipantLeft({ commit, getters }, participant) {
      commit('removeParticipantJoined', participant.clientId);
      const cardNumber = getters.selectedCardForClient(participant.clientId);
      if (cardNumber !== null) {
        commit('removeParticipantVoted', {
          clientId: participant.clientId,
          cardNumber,
        });
      }
    },

    subscribeToAblyVoting({ dispatch, state }) {
      state.channelInstances.voting.subscribe('vote', (msg) => {
        dispatch('handleVoteReceived', msg);
      });
      state.channelInstances.voting.subscribe('undo-vote', (msg) => {
        dispatch('handleUndoVoteReceived', msg);
      });
      state.channelInstances.voting.subscribe('show-results', (msg) => {
        dispatch('handleShowResultsReceived', msg);
      });
      state.channelInstances.voting.subscribe('reset-voting', (msg) => {
        dispatch('handleResetVotingReceived', msg);
      });
    },

    handleVoteReceived({ commit }, msg) {
      commit('addParticipantVoted', {
        clientId: msg.data.clientId,
        cardNumber: msg.data.cardNumber,
      });
    },
    handleUndoVoteReceived({ commit }, msg) {
      commit('removeParticipantVoted', {
        clientId: msg.data.clientId,
        cardNumber: msg.data.cardNumber,
      });
    },
    handleShowResultsReceived({ commit }, msg) {
      if (msg.data.showResults) {
        commit('setShowResults', true);
      } else {
        commit('setShowResults', false);
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleResetVotingReceived({ dispatch }, msg) {
      dispatch('commonResetVoting');
    },

    publishVoteToAbly({ state }, clientVote) {
      state.channelInstances.voting.publish('vote', clientVote);
    },
    publishUndoVoteToAbly({ state }, clientVote) {
      state.channelInstances.voting.publish('undo-vote', clientVote);
    },
    publishShowResultsToAbly({ state }, showResults) {
      state.channelInstances.voting.publish('show-results', {
        showResults,
      });
    },
    publishResetVotingToAbly({ state }) {
      state.channelInstances.voting.publish('reset-voting', {});
    },
  },
};
