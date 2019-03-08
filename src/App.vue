<template>
  <v-app id="inspire" :dark="dark">
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Context Freedom</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="dark = !dark">
        <v-icon>mdi-compare</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex class="wrapper">
            <grammar></grammar>
          </v-flex>
          <v-flex class="wrapper">
            <g-input></g-input>
          </v-flex>
          <v-flex class="wrapper">
            <tree></tree>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Grammar from '@/components/Grammar'
import Input from '@/components/Input'
import Tree from '@/components/Tree'

export default {
  name: 'App',
  components: {
    Grammar,
    Tree,
    'g-input': Input,
  },
  data() {
    return {
      dark: true,
    }
  },
}
</script>

<style>
.wrapper {
  flex-grow: 0.3;
}
footer {
  display: flex;
  justify-content: center;
}
</style>
