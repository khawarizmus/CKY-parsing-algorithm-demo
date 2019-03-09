<template>
  <v-card min-height="62%">
    <v-card-title>Test your context free grammar</v-card-title>
    <v-alert
      mx-3
      :value="generated"
      transition="scale-transition"
      dismissible
      type="success"
    >Context free grammar generated successfully</v-alert>
    <div class="mx-3">
      <div class="mx-1">Next suggestions:</div>
      <template v-for="(item, i) in suggestions">
        <v-chip class="mx-1" :key="i" @click="appendSuggestion(item)">{{ item }}</v-chip>
      </template>
    </div>
    <v-card-text>
      <v-textarea
        :error="error"
        outline
        name="input"
        :disabled="!generated"
        label="Input to evaluate"
        v-model="input"
        @input="predictSuggestion"
      ></v-textarea>
      <v-tooltip v-if="!computedCompleetness" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="red" text-color="white" v-on="on">Not complete</v-chip>
        </template>
        <span>Sentential Forms</span>
      </v-tooltip>
      <v-tooltip v-if="computedCompleetness" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="green" text-color="white" v-on="on">Completed</v-chip>
        </template>
        <span>Sentance</span>
      </v-tooltip>
      <v-tooltip v-if="!computedValidity" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="red" text-color="white" v-on="on">Invalid</v-chip>
        </template>
        <span>Syntax error</span>
      </v-tooltip>
      <v-tooltip v-if="computedValidity" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="green" text-color="white" v-on="on">Valid</v-chip>
        </template>
        <span>Correct sentance</span>
      </v-tooltip>
    </v-card-text>
  </v-card>
</template>

<script>
import GrammarGraph from 'grammar-graph'
import _ from 'lodash'
import { EventBus } from '../evenBus.js'

export default {
  data() {
    return {
      graph: undefined,
      recognizer: undefined,
      guide: undefined,
      generated: false,
      input: '',
      inputSiz: 0,
      error: false,
      suggestions: [],
    }
  },
  mounted() {
    const that = this
    EventBus.$on('grammar on', () => {
      console.log('catchin...')
      that.input = ''
      that.graph = new GrammarGraph(that.$store.getters.getGrammarRules.rules)
      that.recognizer = that.graph.createRecognizer(
        that.$store.getters.getGrammarRules.startSymbole
      )
      that.guide = that.graph.createGuide(
        that.$store.getters.getGrammarRules.startSymbole
      )
      that.suggestions = this.guide.choices()
      that.generated = true
    })
    EventBus.$emit('grammar off', () => {
      that.graph = undefined
      that.recognizer = undefined
      that.guide = undefined
      that.generated = false
    })
  },
  methods: {
    appendSuggestion(item) {
      if (this.input === '') {
        this.input = item
      } else {
        this.input = `${this.input} ${item}`
      }
      this.guide.choose(item)
      this.suggestions = this.guide.choices()
      this.inputSiz++
    },
    predictSuggestion() {
      if (this.recognizer.isValid(this.input)) {
        const tokens = _.words(this.input)
        if (tokens.length > this.inputSiz) {
          this.guide.choose(tokens[tokens.length - 1])
          this.suggestions = this.guide.choices()
          this.inputSiz++
        } else {
          this.guide.pop()
          this.suggestions = this.guide.choices()
          this.inputSiz--
        }
      }
    },
  },
  computed: {
    computedValidity() {
      if (this.recognizer) {
        return this.recognizer.isValid(this.input)
      }
    },
    computedCompleetness() {
      if (this.recognizer) {
        return this.recognizer.isComplete(this.input)
      }
    },
  },
}
</script>

<style>
.adjust-pos {
  margin-top: 48px;
}
</style>


