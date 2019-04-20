<template>
  <v-card height="100%">
    <v-card-title>Grammar</v-card-title>
    <v-card-text>
      <v-textarea outline label="Grammar Rules" height="245" v-model="input"></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { EventBus } from '../evenBus.js'

export default {
  data() {
    return {
      input: '',
      startSymbole: '',
      error: false,
      errorLog: '',
      rules: [],
      tokenized: [],
      terminals: {},
      noneTerminals: {},
      parsed: [[]],
      solved: false,
    }
  },
  mounted() {
    const that = this
    this.input =
      'S -> NP VP\nS -> Verb NP\nS -> X2 PP\nS -> Verb PP\nS -> VP PP\nS -> was\nS -> gave\nS -> gives\nS -> told\nS -> slowly\nS -> found\nS -> thought\nS -> ordered\nNP -> There\nNP -> It\nNP -> big\nNP -> cheap\nNP -> goods\nNP -> He\nNP -> the\nNP -> her\nNP -> timely\nNP -> expensive\nNP -> children\nNP -> FedEx\nNP -> heavy\nNP -> Det Nominal\nNominal -> Nominal Noun\nNominal -> Nominal PP\nNominal -> beautiful\nNominal -> feasible\nNominal -> parcel\nNominal -> weight\nNominal -> far\nNominal -> location\nNominal -> little\nNominal -> belonged\nNominal -> envelope\nNominal -> important\nNominal -> warehouse\nVP -> was\nVP -> gave\nVP -> gives\nVP -> told\nVP -> slowly\nVP -> found\nVP -> thought\nVP -> ordered\nVP -> Verb NP\nVP -> X2 PP\nX2 -> Verb NP\nVP -> Verb PP\nVP -> VP PP\nPP -> Preposition NP\nVerb -> was\nVerb -> gave\nVerb -> gives\nVerb -> told\nVerb -> slowly\nVerb -> found\nVerb -> thought\nVerb -> ordered\nDet -> a\nDet -> The\nDet -> the\nDet -> her\nDet -> send\nDet -> reached\nDet -> seven\nDet -> they\nNoun -> document\nNoun -> discount\nNoun -> away\nNoun -> beds\nNoun -> beautiful\nNoun -> feasible\nNoun -> parcel\nNoun -> weight\nNoun -> far\nNoun -> location\nNoun -> little\nNoun -> belonged\nNoun -> envelope\nNoun -> important\nNoun -> warehouse\nPreposition -> named\nPreposition -> and\nPreposition -> in\nPreposition -> into\nPreposition -> to\nPreposition -> send'
    EventBus.$on('parse', (s) => {
      that.parser(s)
    })
    EventBus.$on('reset', () => {
      that.startSymbole = ''
      that.error = false
      that.errorLog = ''
      that.rules = []
      that.tokenized = []
      that.terminals = {}
      that.noneTerminals = {}
      that.parsed = [[]]
      that.solved = false
    })
  },
  methods: {
    parser(sentence) {
      const that = this
      // tokenize the sentence
      this.tokenized = this.tokenize(sentence)
      // we create a matrix that holds the solution
      this.initializeMatrix(this.tokenized.length)
      // we save each line from the input as a rule
      this.rules = this.input.split('\n')
      // this regex is to extract each symbole individually
      const rex = /^(\w+)\s*->\s*(\w+)(?:\s+(\w+))?\s*\.?$/
      // we iterate on each rule
      for (const [i, rule] of this.rules.entries()) {
        // if the line is empty
        if (rule.length === 0) continue
        // check the rule syntax
        const check = rex.exec(rule)
        if (check === null) {
          this.error = true
          this.errorLog = `Syntax error rule not following 'Symbole -> Symbole', line ${i}, rule ${rule}`
          break
        }
        // extract the left-hand-side and right-hand-side of each rule
        let lhs, rhs
        ;[lhs, rhs] = _.map(rule.split('->'), _.trim)
        // create an object for representing all the rules
        if (rhs.split(' ').length === 1) {
          // trminal symbole
          if (_.has(this.terminals, lhs)) {
            this.terminals[lhs].push(rhs)
          } else {
            this.terminals[lhs] = [rhs]
          }
        } else if (rhs.split(' ').length === 2) {
          // none-terminal symbole
          if (_.has(this.noneTerminals, lhs)) {
            this.noneTerminals[lhs].push(rhs)
          } else {
            this.noneTerminals[lhs] = [rhs]
          }
        } else {
          // not chomsky normal form
          this.error = true
          this.errorLog = `your rules are not in CNF, line ${i}, rule ${rule}`
          break
        }
        if (i === 0) {
          // getting the start symbole
          this.startSymbole = lhs
        }
      }
      // at this point we are ready to excute the CYK algorithm
      this.cykParser()
      // we can finally check if the sentence is dirivable from that grammar
      this.parsed[0][0].forEach((symbole) => {
        if (symbole === that.startSymbole) {
          that.solved = true
        }
      })
      EventBus.$emit('solution', this.solved)
    },
    tokenize(s) {
      return _.trim(s).split(' ')
    },
    initializeMatrix(len) {
      this.parsed = new Array(len)
      for (var i = 0; i < this.parsed.length; i++) {
        this.parsed[i] = new Array(len)
      }
    },
    cykParser() {
      for (let i = this.tokenized.length - 1; i >= 0; i--) {
        for (let j = 0; j < i + 1; j++) {
          if (i === this.tokenized.length - 1) {
            // terminal symbole matching
            for (const key in this.terminals) {
              for (const T of this.terminals[key]) {
                if (T === this.tokenized[j]) {
                  // the token matches the sentence word
                  // we save the solution to the matrix
                  if (this.parsed[i][j]) {
                    this.parsed[i][j].push(key)
                  } else {
                    this.parsed[i][j] = [key]
                  }
                }
              }
            }
            // we update the UI
            if (this.parsed[i][j] === undefined) {
              // no match
              this.parsed[i][j] = ['∅']
            }
            document.querySelector(
              `#card${i}${j} > .v-card__text`
            ).innerHTML = this.parsed[i][j]
          } else {
            // none terminal symbole matching
            let count1 = this.tokenized.length - 1 - i
            let count2 = 1
            // let negrativeLen = this.tokenized.length - (i + 2)
            for (let k = i + 1; k <= this.tokenized.length - 1; k++) {
              console.log({ i }, { j }, { k })
              // we prepare for what we want to search
              for (const m in this.parsed[i + count1][j]) {
                for (const n in this.parsed[k][j + count2]) {
                  console.log({ count1 }, { count2 })
                  const searchSymbole = `${this.parsed[i + count1][j][m]} ${
                    this.parsed[k][j + count2][n]
                  }`
                  console.log('searching for', searchSymbole)
                  console.log(
                    `[${i}][${j}]`,
                    document.getElementById(`card${i}${j}`)
                  )
                  console.log(document.getElementById(`card${i + count1}${j}`))
                  console.log(document.getElementById(`card${k}${j + count2}`))
                  // we loop over all noneterminal symboles
                  for (const key in this.noneTerminals) {
                    // we get all their possible rules
                    for (const noneterminalSymboles of this.noneTerminals[
                      key
                    ]) {
                      // if that rule matches with the rule we are looking for we save
                      if (noneterminalSymboles === searchSymbole) {
                        // saving to the solution matrix
                        if (this.parsed[i][j]) {
                          // if the array do exist
                          if (!this.parsed[i][j].includes(key)) {
                            // if the array don't contain the current value
                            this.parsed[i][j].push(key)
                          }
                        } else {
                          this.parsed[i][j] = [key]
                        }
                      }
                    }
                  }
                }
              }
              count1--
              count2++
            }
            if (this.parsed[i][j] === undefined) {
              // no match
              this.parsed[i][j] = ['∅']
            }
            document.querySelector(
              `#card${i}${j} > .v-card__text`
            ).innerHTML = this.parsed[i][j]
          }
        }
      }
    },
  },
  computed: {},
  watch: {},
}
</script>

