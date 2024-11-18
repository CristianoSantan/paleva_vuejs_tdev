const app = Vue.createApp({
  data(){
    return {
      order: {},
      listOrders: [],
      selectedOption: '',
      options: [
        { value: 'waiting', text: 'esperando' },
        { value: 'in_preparation', text: 'em preparação' },
        { value: 'ready', text: 'pronto' }
      ],
    }
  },
  computed: {
    listResult(){
      if(this.selectedOption){
        return this.listOrders.filter(order => {
          return order.status.toLowerCase().includes(this.selectedOption.toLowerCase());
        });
      } else {
        return this.listOrders;
      }
    }
  },
  async mounted(){
    this.listResult = await this.getData();
  },
  methods:{
    async change(code, status){
      let response = await fetch(`http://localhost:3000/api/v1/orders/QUEEN01/${code}/?status=${status}`, {
        method: "PATCH"
      });
      let data = await response.json();
      this.order = data
      await this.getData();
    },
    async details(item){
      this.order = item
    },
    async getData(){
      let response = await fetch('http://localhost:3000/api/v1/orders/QUEEN01/')
      let data = await response.json();

      this.listOrders = []

      data.forEach(item => {
        var order = new Object();

        order.id = item.id;
        order.name = item.name;
        order.phone = item.phone;
        order.email = item.email;
        order.cpf = item.cpf;
        order.code = item.code;
        order.status = item.status;
        order.created_at = item.created_at;
        order.order_items = item.order_items;

        this.listOrders.push(order);
      });
    }
  }
});

app.mount('#app');
