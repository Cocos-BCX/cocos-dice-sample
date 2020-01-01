<template>
  <header class="header">
    <div>
      <img class="dice-logo" :src="diceLogo" />
      <a href="JavaScript:;">COMMUNITIY</a>
    </div>
    <nav>
      <ul>
        <li v-if="!account.name">
          <!-- <a @click="refresh" href="JavaScript:;">LOGIN</a> -->
          <img class="refresh-logo" :src="refreshIcon" @click="refresh" />
        </li>
        <li v-if="account">{{account.name}}</li>
      </ul>
    </nav>
  </header>
</template>


 <script>
import eventHub from "@/utils/event";
import diceLogo from "@/assets/dice.svg";
import refreshIcon from "@/assets/refresh.png";

export default {
  methods: {
    refresh() {
      eventHub.$emit("REFRESH", "REFRESH");
    }
  },

  data() {
    return {
      diceLogo,
      refreshIcon
    };
  },

  computed: {
    account() {
      return this.$store.state.account;
    }
  }
};
</script>

 <style scoped>
.header {
  background-color: #3f3e3e;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 76px;
  justify-content: space-between;
  padding: 0 30px;
}

.header ul {
  display: flex;
  align-items: center;
}

.header ul li {
  margin-left: 30px;
}

.header a {
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 0.9em;
}

.header .account-cell {
  color: #fff;
}

.header .account-cell > span {
  margin-right: 10px;
}

.header a:hover {
  text-shadow: 0 0 5px #fff;
}

.icon-logout {
  cursor: pointer;
}

.dice-logo {
  width: 40px;
  vertical-align: middle;
  margin-right: 30px;
}

.refresh-logo {
  vertical-align: middle;
  width: 26px;
  margin-left: 6px;
}

@media screen and (max-width: 720px) {
  .header {
    width: 100%;
    background-color: #3f3e3e;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 0.76rem;
    justify-content: space-between;
    padding: 0 0.3rem;
  }

  .header ul {
    display: flex;
    align-items: center;
  }

  .header ul li {
    margin-left: 0.3rem;
  }

  .header a {
    color: #fff;
    text-decoration: none;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 0.9em;
  }

  .header .account-cell {
    color: #fff;
  }

  .header .account-cell > span {
    margin-right: 0.1rem;
  }

  .header a:hover {
    text-shadow: 0 0 5px #fff;
  }

  .icon-logout {
    cursor: pointer;
  }

  .dice-logo {
    width: 0.4rem;
    vertical-align: middle;
    margin-right: 0.3rem;
  }
}
</style>

