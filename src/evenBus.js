import Vue from 'vue'
export const EventBus = new Vue()

// // can be used this way
// // Import the EventBus.
// import { EventBus } from './event-bus.js'

// // Listen for the i-got-clicked event and its payload.
// EventBus.$on('i-got-clicked', (clickCount) => {
//   console.log(`Oh, that's nice. It's gotten ${clickCount} clicks! :)`)
// })
// // Send the event on a channel (i-got-clicked) with a payload (the click count.)
// EventBus.$emit('i-got-clicked', this.clickCount)
// // Listen to the event.
// EventBus.$on('i-got-clicked', clickHandler)

// // Stop listening.
// EventBus.$off('i-got-clicked', clickHandler)
