<template>
  <v-card height="100%">
    <v-card-title>Context free Grammar</v-card-title>
    <v-alert
      mx-3
      :value="error"
      transition="scale-transition"
      dismissible
      type="error"
    >{{ errorContent }}</v-alert>
    <template v-for="(input, i) in inputs">
      <v-layout :key="i">
        <v-flex px-3 xs5>
          <v-text-field
            @input="generatable = true"
            outline
            v-model="inputs[i].key"
            label="Key"
            required
          ></v-text-field>
        </v-flex>
        <v-flex px-3 xs5>
          <v-text-field
            @input="generatable = true"
            outline
            v-model="inputs[i].value"
            label="value"
            required
          ></v-text-field>
        </v-flex>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="deletInput(input, i)" v-on="on" color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete this rule</span>
        </v-tooltip>
      </v-layout>
    </template>
    <v-card-actions>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn @click="addInput" v-on="on">Add a rule</v-btn>
        </template>
        <span>Add a new rule</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            class="mx-2"
            @click="generateRules()"
            :disabled="!generatable"
            color="success"
            v-on="on"
          >Generate Rules</v-btn>
        </template>
        <span>Generate your context free grammar rules</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn @click="clear" color="error" v-on="on">
            <v-icon>mdi-delete-empty</v-icon>
          </v-btn>
        </template>
        <span>Clear all rules</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" @click="example1" color="info" v-on="on">Example 1</v-btn>
        </template>
        <span>Generate Rules</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn @click="example2" color="info" v-on="on">Example 2</v-btn>
        </template>
        <span>Generate Rules</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { EventBus } from '../evenBus.js'
import { error } from 'util'

export default {
  data() {
    return {
      grammar: {
        rules: {},
        startSymbole: '',
      },
      error: false,
      generatable: true,
      errorContent: '',
      inputs: [
        {
          key: '',
          value: '',
        },
      ],
    }
  },
  mounted() {
    // const GRAPH = new GrammarGraph(this.grammarRules)
  },
  watch: {
    error() {
      if (this.error) {
        this.generatable = false
      }
    },
    inputs(newInput, oldInput) {
      if (oldInput === newInput) {
        this.generatable = true
      }
    },
  },
  methods: {
    addInput() {
      this.error = false
      this.inputs.push({ key: '', value: '' })
    },
    deletInput(input, i) {
      if (this.inputs.length > 1) {
        this.error = false
        this.inputs.splice(i, 1)
      } else {
        this.errorContent = 'you need to have at least one rule'
        this.error = true
      }
    },
    clear() {
      this.error = false
      this.generatable = true
      this.inputs = [
        {
          key: '',
          value: '',
        },
      ]
      EventBus.$emit('grammar off')
    },
    generateRules() {
      this.grammar.rules = {}
      this.$store.commit('SET_GRAMMAR_RULES', {})
      this.inputs.forEach((rule, i) => {
        if (rule.key === '') {
          this.errorContent = "You can't have an empty key"
          this.error = true
        } else {
          if (i === 0) {
            this.grammar.startSymbole = rule.key
          }
          this.grammar.rules[rule.key] = _.words(rule.value, /[^\|]+/g).map(
            (token) => _.trim(token)
          )
        }
      })
      if (!this.error) {
        this.$store.commit('SET_GRAMMAR_RULES', this.grammar)
        EventBus.$emit('grammar on')
        this.generatable = false
      }
    },
    example1() {
      this.inputs = [
        { key: 'Sentence', value: 'NounPhrase VerbPhrase' },
        { key: 'NounPhrase', value: 'the Noun | the Noun RelativeClause' },
        { key: 'VerbPhrase', value: 'Verb | Verb NounPhrase' },
        { key: 'RelativeClause', value: 'that VerbPhrase' },
        { key: 'Noun', value: 'dog | cat | bird | squirrel' },
        { key: 'Verb', value: 'befriended | loved | ate | attacked' },
      ]
      this.generatable = true
    },
    example2() {
      this.inputs = [
        { key: 'Creature', value: 'Arm Head Arm' },
        { key: 'Head', value: '( Face )' },
        { key: 'Face', value: 'HappyFace | ZenFace | SleepyFace' },
        { key: 'HappyFace', value: '^ Mouth ^' },
        { key: 'ZenFace', value: '- Mouth -' },
        { key: 'SleepyFace', value: '* Mouth *' },
        { key: 'Mouth', value: '_ | _ Mouth' },
        { key: 'Arm', value: '~~' },
      ]
      this.generatable = true
    },
  },
  computed: {},
}
</script>

