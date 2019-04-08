<template>
  <main id="app">
    <dice-header />
    <dice-game />
    <dice-orders />
  </main>
</template>

<script>
  /* global scatter */
  const task = new Promise(r => {
    document.addEventListener('scatterLoaded', r);
  });

  export default {
    mounted() {
      task.then(() => {
        if (!scatter.identity) return;
        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        if (!account) return;
        this.$store.commit('UPDATE_ACCOUNT', account);
      });
    },

    components: {
      diceHeader: require('@/components/header').default,
      diceGame: require('@/components/game').default,
      diceOrders: require('@/components/orders').default
    }
  };
</script>

<style>
#app {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
}
</style>
