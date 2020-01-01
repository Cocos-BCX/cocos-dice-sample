<template>
  <main id="app">
    <dice-header />
    <dice-game v-loading="loading" />
  </main>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    diceHeader: require("@/components/header").default,
    diceGame: require("@/components/game").default
  },
  computed: {
    ...mapState(["loading"])
  }
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
}
</style>
