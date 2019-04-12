<template>
  <section class="game">
    <div class="form">
      <div class="form-group">
        <div>
          <label>BET AMOUNT</label>
          <div class="input-amount-group">
            <div class="input-group">
              <img class="cocos-logo" :src="cocosbcxLogo">
              <input @change="checkBetamount" v-model="cocos">
            </div>
            <ul class="amount-rate">
              <li @click="setCOCOS(.5)">1/2</li>
              <li @click="setCOCOS(2)">2X</li>
              <li @click="setCOCOS()">MAX</li>
            </ul>
          </div>
        </div>
        <div>
          <label>PAYOUT ON WIN</label>
          <div class="bet-cell">
            <img class="cocos-logo" :src="cocosbcxLogo">
            <span>{{payWin}}</span>
          </div>
        </div>
      </div>
      <div class="info-container">
        <ul>
          <li>
            <label>ROLL UNDER TO WIN</label>
            <span>{{rollUnder}}</span>
          </li>
          <li>
            <label>PAYOUT</label>
            <span>{{Number(payOut).toFixed(2)}}x</span>
          </li>
          <li>
            <label>WIN CHANCE</label>
            <span>{{winChance}}%</span>
          </li>
        </ul>
      </div>
      <footer class="game-footer">
        <div class="currentCOCOS-container">
          <img class="cocos-lg" :src="cocosbcxLogo">
          <span
            :class="{
              'animateUp': this.showUpAnimation, 
              'animateDown': this.showDownAnimation
            }"
            class="cocos-animation"
          >{{animationTxt}}</span>
          <span>{{Number(currentCOCOS).toFixed(4)}}</span>
        </div>
        <el-button v-if="account.name" @click="doAction" class="btn-action">{{actionTxt}}</el-button>
        <!-- <button
          v-else
          @click="login"
        class="btn-action">LOGIN</button> -->
        <div class="bet-balance">
          <img class="token-logo" :src="tokenLogo">
          <span>0.0000</span>
        </div>
      </footer>
    </div>

    <dice-slider :initial="rollUnder" :max="96" :min="2"/>
    <el-dialog width="30%" :visible.sync="showAbout">
      <p slot="title">How To Play</p>
      <ol>
        <li>1. Make sure you have an COCOS account. For more information on how to create one,</li>
        <li>
          2. If you haven’t already, download and install
          <a
            href="https://chrome.google.com/webstore/detail/cocospay/mgjkjldekfadimcmllpaeafokhdjjeig"
            target="_blank"
          >CocosPay</a>, an Cocos wallet that facilitates interaction between users and dApps.
        </li>
        <li>3. Set your BET AMOUNT. This is the amount of Cocos you will be wagering.</li>
        <li>4. Adjust the slider to change your chance of winning.</li>
        <!-- <li>5. Click ROLL DICE to place your bet.</li> -->
        <li>5. If your number is lower than your ROLL UNDER TO WIN number, you win!</li>
        <!-- <li>7. If you get a notice that your transaction failed, please check that you have enough CPU & bandwidth to make the transaction! Please use to make any changes to your account!</li> -->
      </ol>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="showLogin">
      <p slot="title">Login Account</p>
      <label>UserName</label>
      <input type="text" name="user" id="login_username">
      <br>
      <br>
      <label>Password</label>
      <input type="text" name="password" id="login_pwd">
      <br>
      <br>
      <button @click="login" class="btn-action">LOGIN</button>
    </el-dialog>

    <el-dialog :visible.sync="showSocial">
      <p slot="title">Join the COCOS Community</p>
      <ul class="social-links">
        <li @click="navigate('twitter')">
          <font-awesome-icon :icon="['fab', 'twitter']"/>
        </li>
        <li @click="navigate('github')">
          <font-awesome-icon :icon="['fab', 'github']"/>
        </li>
        <li @click="navigate('medium')">
          <font-awesome-icon :icon="['fab', 'medium-m']"/>
        </li>
        <li @click="navigate('discord')">
          <font-awesome-icon :icon="['fab', 'discord']"/>
        </li>
      </ul>
    </el-dialog>
  </section>
</template>

<script>
import cocosbcxLogo from "@/assets/cocosbcx.png";
import tokenLogo from "@/assets/bet-token.png";
import eventHub from "@/utils/event";
import fetch from "@/utils/api";
import createHash from "create-hash";

export default {
  mounted() {
    eventHub.$on("ROLLUNDER_CHANGE", rollUnder => (this.rollUnder = rollUnder));
    eventHub.$on("SHOW_ABOUT", () => (this.showAbout = true));
    eventHub.$on("SHOW_LOGIN", () => {
      if (window.BcxWeb && window.BcxWeb.BCX) {
        this.login();
      } else this.showLogin = true;
    });
    eventHub.$on("SHOW_SOCIAL", () => (this.showSocial = true));
    this.getCOCOS();
    this.getPool();
  },

  data() {
    return {
      cocosbcxLogo,
      tokenLogo,
      cocos: 1,
      rollUnder: 50,
      currentCOCOS: 0,
      poolBalance: 0,
      timer: 0,
      animationTxt: 0,
      actionTxt: "ROLL DICE",
      showAbout: false,
      showLogin: false,
      showSocial: false,
      animating: false,
      showUpAnimation: false,
      showDownAnimation: false
    };
  },
  methods: {
    getCOCOS() {
      if (!this.account.name) {
        this.currentCOCOS = 0;
        return;
      }

      var self = this;
      bcx.queryAccountBalances({
        assetId_or_symbol: "COCOS",
        account: self.account.name,
        callback: function(res) {
          console.info(res);
          console.info(res.data.COCOS);
          self.currentCOCOS = res.data.COCOS;
        }
      });
    },

    getPool() {
      var self = this;
      bcx.queryAccountBalances({
        assetId_or_symbol: "COCOS",
        account: "fishwarter", // contractor owner
        callback: function(res) {
          console.info(res);
          console.info(res.data.COCOS);
          self.poolBalance = res.data.COCOS;
        }
      });
    },

    floor(value, decimals) {
      return Number(Math.floor(value + "e" + decimals) + "e-" + decimals);
    },

    maxBetAmount() {
      return 10000;
      //return this.floor(this.poolBalance / 100 / (98 / this.winChance) * 0.9, 4);
    },

    setCOCOS(rate) {
      const { poolBalance, currentCOCOS } = this;
      let cocos = rate ? this.cocos * rate : this.currentCOCOS;
      switch (true) {
        case cocos < 0.1:
          cocos = 0.1;
          break;
        case cocos > currentCOCOS:
          cocos = currentCOCOS;
          break;
        case cocos > this.maxBetAmount():
          cocos = this.maxBetAmount();
          break;
      }
      this.cocos = Number(cocos).toFixed(4);
    },

    getClientSeed() {
      let randomNumber = Math.floor(
        Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)
      );
      return createHash("sha1")
        .update(this.account.name + Date.now() + randomNumber)
        .digest("hex");
    },

    doAction() {
      let maxAmount = this.maxBetAmount();
      // if (this.cocos > maxAmount) {
      //   this.$notify({
      //     title: 'Bet Failed',
      //     message: 'Bet Amount should not be more than ' + maxAmount.toFixed(4) + ' COCOS',
      //     duration: 2000,
      //     showClose: false,
      //     type: 'error'
      //   });
      //   return;
      // }
      // const minBetAmount = 0.1
      // if (this.cocos < minBetAmount) {
      //   this.$notify({
      //     title: 'Bet Failed',
      //     message: 'Bet Amount should be more than ' + minBetAmount.toFixed(4) + ' COCOS',
      //     duration: 2000,
      //     showClose: false,
      //     type: 'error'
      //   });
      //   return;
      // }
      const body = new FormData();
      const options = {
        authorization: `${this.account.name}@${this.account.authority}`,
        broadcast: true,
        sign: true
      };

      this.showCOCOSAnimation = true;
      this.$message.info("Waiting for node to confirm transfer...");
      let referrer = "fairdicegame";
      body.append("roll_under", this.rollUnder);
      body.append("referrer", referrer);

      //nameOrId=>合约名字或ID

      var self = this;
      bcx.callContractFunction({
        nameOrId: "contract.dicegame",
        functionName: "bet",
        valueList: [self.rollUnder, self.cocos],
        runTime: 10,
        onlyGetFee: false,
        callback: function(res) {
          console.info("callContractFunction res", res);
          self.getCOCOS();
        }
      });

      // fetch('//dice.dapp.pub/dice/', {
      //   method: 'POST',
      //   body
      // }).then(({ expiration_timestamp, seed, signature }) => {
      //   COCOS.transfer({
      //     from: this.account.name,
      //     to: 'fairdicegame',
      //     quantity: Number(this.cocos).toFixed(4) + ' COCOS',
      //     memo: `${this.rollUnder}-${seed}-${this.getClientSeed()}-${expiration_timestamp}-${referrer}-${signature}`
      //   }).then(() => {
      //     this.getCOCOS();
      //     this.fetchResult(seed);
      //     this.animating = true;

      //     this.$notify({
      //       title: 'Bet success',
      //       message: 'Waiting for bet result',
      //       duration: 2000,
      //       showClose: false,
      //       type: 'info'
      //     });
      //   }).catch(e => {
      //     this.$notify.error(e.message || JSON.parse(e).error.details[0].message);
      //   });
      // });
    },

    fetchResult(hash) {
      api.getActions("fairdicelogs", -1, -20).then(({ actions }) => {
        const result = actions.find(
          action =>
            action.action_trace &&
            action.action_trace.act &&
            action.action_trace.act.account === "fairdicelogs" &&
            action.action_trace.act.name === "result" &&
            action.action_trace.act.data &&
            action.action_trace.act.data.result &&
            action.action_trace.act.data.result.seed_hash === hash
        );

        if (!result) return this.fetchResult(hash);

        const {
          action_trace: {
            act: {
              data: {
                result: { amount, payout }
              }
            }
          }
        } = result;

        if (payout === "0.0000 COCOS") {
          this.showDownAnimation = true;
          this.animationTxt = amount;
        } else {
          this.showUpAnimation = true;
          this.animationTxt = payout;
        }

        setTimeout(() => {
          this.showDownAnimation = false;
          this.showUpAnimation = false;
        }, 3100);

        this.animating = false;
        this.getCOCOS();
      });
    },

    gel(selector) {
      return document.querySelector(selector);
    },

    login() {
      var self = this;
      if (window.BcxWeb && window.BcxWeb.BCX) {
        bcx = window.BcxWeb.BCX;
        self.account.name = window.BcxWeb.address;
        self.getCOCOS();
        return true;
      }

      bcx.passwordLogin({
        account: self.gel("#login_username").value,
        password: self.gel("#login_pwd").value,
        callback: function(res) {
          if (res.code == 1) {
            var username = self.gel("#login_username").value;
            self.$store.commit("UPDATE_ACCOUNT", { name: res.account_name });
            self.account.name = username;
            self.getCOCOS();
            self.showLogin = false;
            self.$message({
              message: "Login Success",
              type: "success"
            });
            //gel(".current_account").innerText=bcx.getAccountInfo().account_name;
          }
        }
      });
      // scatter.getIdentity({
      //   accounts: [network]
      // }).then(() => {
      //   const account = scatter.identity.accounts.find(account => account.blockchain === 'COCOS');
      //   if (!account) return;
      //   this.$store.commit('UPDATE_ACCOUNT', account);
      // }).catch(e => {
      //   this.$message.warning(e.message);
      // });
    },

    logout() {},

    checkBetamount() {},

    navigate(brand) {
      switch (brand) {
        case "twitter":
          window.open("//twitter.com/dappPub");
          break;
        case "medium":
          window.open("//medium.com/dapppub");
          break;
        case "github":
          window.open("//github.com/dappub");
          break;
        case "discord":
          window.open(
            "//discordapp.com/channels/482077322070196225/487187255065313292"
          );
          break;
      }
    }
  },

  watch: {
    account() {
      this.getCOCOS();
    },
    animating() {
      const { animating } = this;
      if (!animating) {
        clearInterval(this.timer);
        this.actionTxt = "ROLL DICE";
        return;
      }
      this.timer = setInterval(() => {
        this.actionTxt = (Math.random() * 100).toFixed(0);
      }, 100);
    }
  },
  components: {
    diceSlider: require("@/components/slider").default
  },
  computed: {
    winChance() {
      return this.rollUnder - 1;
    },

    payOut() {
      return 98 / this.winChance;
    },

    payWin() {
      return (this.cocos * this.payOut).toFixed(4);
    },

    account() {
      return this.$store.state.account;
    }
  }
};
</script>

<style scoped>
.game {
  background: #555;
  background-size: contain;
  padding: 60px 0;
}

.form {
  width: 655px;
  border-radius: 5px;
  font-size: 18px;
  background-color: #4b4848;
  margin: 0 auto 20px auto;
  padding: 20px 30px;
}

.form-group {
  display: flex;
  align-items: center;
}

.form-group > div:last-child {
  flex: 1;
}

.amount-rate {
  display: flex;
  align-items: center;
}

.amount-rate li {
  color: #9b9fae;
  font-size: 0.6em;
  font-weight: 600;
}

.amount-rate li:not(:last-child) {
  border-right: 2px solid #2f2f2f;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  color: #9b9fae;
  font-weight: 600;
  font-size: 0.6em;
  margin-bottom: 0.75em;
  display: block;
}

.form-group input {
  text-align: center;
  border: none;
  padding: 10px 12px;
  borde-radius: 0.3em;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 18px;
  outline: none;
  background-color: #4b4848;
  width: 177px;
  color: #fff;
}

.input-amount-group {
  display: flex;
  align-items: center;
  background-color: #3f3e3e;
  padding: 2px;
  border-radius: 0.3em;
  margin-right: 30px;
  height: 47px;
  position: relative;
}

.input-amount-group ul li {
  cursor: pointer;
  padding: 8px 15px;
}

.input-amount-group ul li:hover {
  background-color: #0000003f;
}

.input-group {
  flex: 1;
}

.input-group input {
  padding-left: 15px;
}

.input-group .cocos-logo {
  position: absolute;
  left: 10px;
  top: 12.5px;
}

.info-container {
  background-color: #3f3e3e;
  padding: 20px;
}

.info-container ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-container ul > li {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.info-container ul > li:not(:last-child) {
  border-right: 2px solid #2f2f2f;
}

.info-container ul > li > label {
  color: #9b9fae;
  font-weight: 600;
  font-size: 0.6em;
  margin-bottom: 0.75em;
  display: block;
}

.info-container ul > li > span {
  color: #fff;
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.bet-cell {
  background-color: #3f3e3e;
  border-radius: 0.3em;
  height: 47px;
  line-height: 47px;
  text-align: center;
  position: relative;
}

.bet-cell > span {
  color: #fff;
  font-weight: 600;
}

.bet-cell .cocos-logo {
  position: absolute;
  left: 10px;
  top: 12.5px;
}

.game-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.game-footer > div {
  flex: 1;
  text-align: center;
  color: #fff;
  font-weight: 600;
}

.btn-action {
  outline: none;
  letter-spacing: 3px;
  font-weight: 600;
  font-size: 18px;
  background-color: #0191ee;
  border-color: #0191ee;
  cursor: pointer;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  border-radius: 0.3rem;
  color: #fff;
  flex: 1;
}

.cocos-logo {
  height: 22px;
}

.cocos-lg {
  width: 22px;
  margin-right: 5px;
  vertical-align: middle;
}

.token-logo {
  width: 22px;
  vertical-align: middle;
  margin-right: 5px;
}

.game >>> .el-dialog {
  background-color: #4a4848;
}

.game >>> .el-dialog__header {
  font-weight: 700;
  text-align: center;
  line-height: 1.5;
  letter-spacing: 0.5px;
  color: #fff;
  font-size: 1.25em;
}

.game >>> .el-dialog__body {
  color: #fff;
  padding-top: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  font-size: 1em;
}

.game >>> .el-dialog__body li,
.game >>> .el-dialog__body p {
  margin-bottom: 10px;
}

.game >>> .el-dialog__body a {
  color: #0191ee;
  text-decoration: none;
}

.game >>> .el-dialog__body a:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 30px 0 30px;
  font-size: 1.2em;
}

.social-links li {
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: background-color ease 200ms;
}

.social-links li:hover {
  background-color: #6c2ded;
}

.bet-balance {
  visibility: hidden;
}

.currentCOCOS-container {
  position: relative;
}

.cocos-animation {
  opacity: 0;

  position: absolute;
}

.cocos-animation.animateUp {
  animation: fadeOutUp 3s;
  color: #02f292;
  text-shadow: 0 0 5px #02f292;
}

.cocos-animation.animateDown {
  animation: fadeOutDown 1s;
  color: #cd4263;
  text-shadow: 0 0 5px #cd4263;
}

@keyframes fadeOutUp {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
</style>

