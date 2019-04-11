<template>
  <header class="header">
    <div>
      <img class="dice-logo" :src="diceLogo">
      <a @click="showSocial" href="JavaScript:;">COMMUNITIY</a>
    </div>
    <nav>
      <ul>
        <li>
          <a @click="showAbout" href="JavaScript:;">HOW TO PLAY</a>
        </li>
        <!-- <li v-if="!account.name">
          <a @click="showLogin" href="JavaScript:;">LoginAccount</a>
        </li>-->
        <!-- <li v-if="account">{{account.name}}</li> -->
        <li>
          <a @click="showAbout" v-if="!account.name" href="JavaScript:;">LOGIN</a>
          <div class="account-cell" v-else href="JavaScript:;">
            <span>{{account.name}}</span>
            <font-awesome-icon class="icon-logout" @click="logout" icon="sign-out-alt"/>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>


<script>
import eventHub from "@/utils/event";
import diceLogo from "@/assets/dice.svg";

export default {
  methods: {
    login() {},

    logout() {
      // scatter.forgetIdentity().then(() => {
      //   this.$message.success("User logout success");
      //   this.$store.commit("UPDATE_ACCOUNT", {});
      // });
    },

    showAbout() {
      eventHub.$emit("SHOW_ABOUT");
    },

    showLogin() {
      eventHub.$emit("SHOW_LOGIN");
    },

    showSocial() {
      eventHub.$emit("SHOW_SOCIAL");
    }
  },

  data() {
    return {
      diceLogo
    };
  },

  computed: {
    account() {
      return this.$store.state.account;
    }
  },
  mounted() {
    console.log(this.account);
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
</style>

