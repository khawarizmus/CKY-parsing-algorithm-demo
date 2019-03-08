import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    grammarInput: '',
    grammarRules: {},
    input: ''
  },
  getters: {
    getGrammarInput (state) {
      return state.grammarInput
    },
    getGrammarRules (state) {
      return state.grammarRules
    },
    getInput (state) {
      return state.input
    }
  },
  mutations: {
    SET_GRAMMAR_INPUT (state, input) {
      state.grammarInput = input
    },
    SET_GRAMMAR_RULES (state, rules) {
      state.grammarRules = rules
    },
    SET_INPUT (state, input) {
      state.input = input
    }
  },
  actions: {}
})
