<template>
  <v-card min-height="50%">
    <v-card-title>Test your context free grammar</v-card-title>
    <v-alert
      mx-3
      :value="generated"
      transition="scale-transition"
      dismissible
      type="success"
    >Context free grammar generated successfully</v-alert>
    <v-card-text>
      <v-textarea
        :error="error"
        outline
        name="input"
        :disabled="!generated"
        label="Input to evaluate"
        v-model="input"
      ></v-textarea>
      <v-tooltip v-if="!computedCompleetness" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="red" text-color="white">Not complete</v-chip>
        </template>
        <span>Sentential Forms</span>
      </v-tooltip>
      <v-tooltip v-if="computedCompleetness" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="green" text-color="white">Completed</v-chip>
        </template>
        <span>Sentance</span>
      </v-tooltip>
      <v-tooltip v-if="!computedValidity" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="red" text-color="white">Invalid</v-chip>
        </template>
        <span>Syntax error</span>
      </v-tooltip>
      <v-tooltip v-if="computedValidity" bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="green" text-color="white">Valid</v-chip>
        </template>
        <span>Correct sentance</span>
      </v-tooltip>
    </v-card-text>
  </v-card>
</template>

<script>
import GrammarGraph from 'grammar-graph'
import { EventBus } from '../evenBus.js'

export default {
  data() {
    return {
      graph: undefined,
      recognizer: undefined,
      generated: false,
      input: '',
      error: false,
    }
  },
  mounted() {
    const that = this
    EventBus.$on('grammar on', () => {
      console.log('catchin...')
      that.graph = new GrammarGraph(that.$store.getters.getGrammarRules.rules)
      that.recognizer = that.graph.createRecognizer(
        that.$store.getters.getGrammarRules.startSymbole
      )
      that.generated = true
    })
    EventBus.$emit('grammar off', () => {
      that.graph = undefined
      that.recognizer = undefined
      that.generated = false
    })
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


