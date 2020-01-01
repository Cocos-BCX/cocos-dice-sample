<template>
  <section class="orders-container">
    <header class="orders-tab">
      <ul>
        <li>ALL BETS</li>
      </ul>
    </header>
    <table class="orders-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Bettor</th>
          <th>Bet</th>
          <th>Roll Under</th>
          <th>Roll</th>
          <!-- <th>Payout</th> -->
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(order, index) in orders">
          <td>{{order.date}}</td>
          <td>{{account.name}}</td>
          <td>{{order.parse_operations.arg_list.amount}}</td>
          <td>{{order.parse_operations.arg_list.num}}</td>
          <td>{{order.parse_operations.fee}}</td>
          <!-- <td
            class="payout"
          >{{order.action_trace.act.data.result.payout !== '0.0000 COCOS' && order.action_trace.act.data.result.payout || ''}}</td>-->
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  mounted() {
    //注释
    // setTimeout(() => {
    //   this.fetchOrders();
    // }, 2000);
    // setInterval(this.fetchOrders(), 1000);
  },
  computed: {
    ...mapState(["account", "cocos"])
  },
  data() {
    return {
      orders: []
    };
  },
  watch: {
    cocos(val, old) {
      this.fetchOrders();
    }
  },

  methods: {
    fetchOrders() {
      let params = {
        account: this.account.name,
        limit: 10,
        startId: "1.11.0",
        endId: "1.11.0"
      };
      let list = [];
      bcx.queryAccountOperations(params).then(res => {
        if (res.code === 1 && res.data.length) {
          res.data.forEach(item => {
            if (
              item.type === "call_contract_function" &&
              item.parse_operations &&
              item.parse_operations.contract_name === "contract.dicegame"
            ) {
              item.parse_operations.fee = parseFloat(
                item.parse_operations.fee
              ).toFixed(4);
              list.push(item);
            }
          });
          this.orders = list;
        }
      });
    }

    // dateFormat(raw) {
    //   return new Date(raw + "Z").toLocaleTimeString();
    // }
  }
};
</script>

<style scoped>
.thead {
  font-size: 0.16rem !important;
}
.orders-container {
  background-color: #191919;
  padding: 0.2rem;
}

.orders-tab {
  color: #fff;
  display: flex;
  justify-content: center;
  margin-bottom: 0.2rem;
}

.orders-tab ul {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #bbb;
}

.orders-tab ul li {
  cursor: pointer;
  padding: 0.07rem 0.35rem;
  display: inline-block;
  text-align: center;
  color: #bbb;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.orders-table {
  width: 90%;
  color: #fff;
  font-weight: 900;
  letter-spacing: 0.5px;
  border-collapse: collapse;
  margin: 0 auto;
}

.orders-table tbody tr {
  border-radius: 5px;
}

.orders-table tbody tr:nth-child(even) {
  background-color: #292929;
}

.orders-table td {
  font-size: 0.16rem;
  padding: 0.2rem 0;
  text-align: center;
}

.payout {
  color: #02f292;
  text-shadow: 0 0 5px #02f292;
}
</style>

