const restaurant_code = "ABC123";

const app = Vue.createApp({
  data() {
    this.getOrders();
    return {
      orders: [],
      order_data: null,
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
      console.log(this.orders);
    },

    async getOrder(code) {
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

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString(
        "pt-BR"
      )}  ${date.getHours()}:${date.getMinutes()}`;
    },
  },
});

app.mount("#app");
