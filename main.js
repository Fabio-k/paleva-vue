const restaurant_code = CONFIG.restaurant_code;

const app = Vue.createApp({
  data() {
    this.getOrders();
    return {
      orders: [],
      order_data: null,
      show_cancel_form: false,
      reason_message: null,
    };
  },
  methods: {
    async getOrders() {
      let response = await fetch(
        `http://localhost:4000/api/orders?restaurant_code=${restaurant_code}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const result = await response.json();
      this.orders = result.orders;
      this.sortOrders();
      console.log(this.orders);
    },

    async getOrder(code) {
      this.show_cancel_form = false;
      let response = await fetch(
        `http://localhost:4000/api/order?restaurant_code=${restaurant_code}&order_code=${code}`
      );
      this.order_data = await response.json();
      console.log(this.order_data);
    },

    returnToOrders() {
      this.order_data = null;
    },

    async acceptOrder(code) {
      let response = await fetch(
        `http://localhost:4000/api/order/accept?restaurant_code=${restaurant_code}&order_code=${code}`,
        { method: "PATCH" }
      );

      const result = response.status;
      if (result == 200) {
        this.order_data.status = "em preparação";
        this.getOrders();
      }
      console.log(result);
    },

    async markOrderAsReady(code) {
      let response = await fetch(
        `http://localhost:4000/api/order/ready?restaurant_code=${restaurant_code}&order_code=${code}`,
        { method: "PATCH" }
      );

      const result = response.status;

      console.log(result);
      if (result == 200) {
        this.order_data.status = "pronto";
        this.getOrders();
      }
    },

    async cancelOrder(code) {
      let response = await fetch(
        `http://localhost:4000/api/order/cancel?restaurant_code=${restaurant_code}&order_code=${code}&reason_message=${this.reason_message}`,
        { method: "PATCH" }
      );

      const result = response.status;

      console.log(result);
      if (result == 200) {
        this.order_data.status = "pronto";
        this.getOrders();
      }
    },

    toggleCancelOrder() {
      this.show_cancel_form = true;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString(
        "pt-BR"
      )}  ${date.getHours()}:${date.getMinutes()}`;
    },

    sortOrders() {
      this.orders.sort((a, b) => {
        const statusOrder = [
          "pronto",
          "em preparação",
          "Aguardando confirmação da cozinha",
        ];
        const statusA = statusOrder.indexOf(a.status);
        const statusB = statusOrder.indexOf(b.status);

        if (statusA !== statusB) {
          return statusB - statusA;
        }

        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        if (dateA > dateB) {
          return -1;
        }
        return 0;
      });
    },
  },
});

app.mount("#app");
