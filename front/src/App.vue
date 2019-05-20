<template>
  <main id="app">
    <dice-header/>
    <dice-game/>
    <dice-orders/>
  </main>
</template>

<script>
/* global scatter */

export default {
  components: {
    diceHeader: require("@/components/header").default,
    diceGame: require("@/components/game").default,
    diceOrders: require("@/components/orders").default
  }
  // methods: {
  //   ...mapActions(["CONNECT_COCOS"])
  // },
  // async created() {
  //   this.CONNECT_COCOS();
  // }
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
