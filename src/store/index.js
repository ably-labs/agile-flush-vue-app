import { createStore } from 'vuex';
import { generateSessionId } from '../util/sessionIdGenerator';
import { cardModule } from './cardModule';
import { realtimeModule } from './realtimeModule';

export const store = createStore({
  modules: {
    cards: cardModule,
    realtime: realtimeModule,
  },
  state: {
    sessionId: null,
    showResults: false,
  },
  getters: {
    sessionId: (state) => state.sessionId,
    hasSessionStarted: (state) => state.sessionId !== null && state.sessionId !== undefined,
    showResults: (state) => state.showResults,
  },
  mutations: {
    setSessionId(state, sessionId) {
      state.sessionId = sessionId;
    },
    setShowResults(state, showResults) {
      state.showResults = showResults;
    },
    toggleShowResults(state) {
      state.showResults = !state.showResults;
    },
  },
  actions: {
    commonResetVoting({ commit }) {
      const flush = new Audio('flush.mp3');
      flush.play();
      commit('resetCards');
      commit('setShowResults', false);
    },
    resetVoting({ dispatch }) {
      dispatch('commonResetVoting');
      dispatch('publishResetVotingToAbly');
    },
    startSession({ commit }, routeSessionId) {
      let sessionId;
      if (routeSessionId == null) {
        sessionId = generateSessionId();
      } else {
        sessionId = routeSessionId;
      }
      commit('setSessionId', sessionId);
    },
    toggleShowResults({ dispatch, commit, getters }) {
      commit('toggleShowResults');
      dispatch(
        'publishShowResultsToAbly',
        getters.showResults,
      );
    },
  },
});
