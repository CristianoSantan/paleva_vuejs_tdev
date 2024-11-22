// Componentes das páginas
const Home = {
  data() {
    return {
      selectedOption: '',
      options: [
        { value: 'waiting', text: 'esperando' },
        { value: 'in_preparation', text: 'em preparação' },
        { value: 'ready', text: 'pronto' }
      ],
      listOrders: []
    }
    },
    computed: {
      listResult() {
        if (this.selectedOption) {
          return this.listOrders.filter(order => {
            return order.status.toLowerCase().includes(this.selectedOption.toLowerCase());
          });
        } else {
          return this.listOrders;
        }
      }
    },
    async mounted() {
      await this.getData();
    },
    methods: {
      async getData() {
        let response = await fetch('http://localhost:3000/api/v1/orders/QUEEN01/')
        let data = await response.json();

        this.listOrders = data.map(item => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          email: item.email,
          cpf: item.cpf,
          code: item.code,
          status: item.status,
          created_at: item.created_at,
          order_items: item.order_items
        }));
      }
    },
    template: `
      <div class="container text-center">
        <select v-model="selectedOption" class="m-5">
            <option value="">Todos</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>
        
        <div class="msg mx-5" v-if="listResult.length <= 0">Nenhum pedido encontrado!</div>
        <ul class="">
            <li v-for="item in listResult">
                <div class="card">
                    <address>
                        <br><strong>{{ item.id }}</strong>
                        <br><strong>{{ item.name }}</strong>
                        <br> Código: {{ item.code }}
                        <br> Criado em: {{ item.created_at }}
                        <div class="">
                            <p v-if="item.status === 'waiting'" class="badge bg-secondary mb-0 p-2">Situação: Aguardando</p>
                            <p v-else-if="item.status === 'in_preparation'" class="badge bg-warning mb-0 p-2">Situação: Em preparação</p>
                            <p v-else-if="item.status === 'ready'" class="badge bg-success mb-0 p-2">Situação: Pronto</p>
                        </div>
                    </address>
                    <router-link :to="'/detalhe/' + item.code" class="btn btn-primary">
                        Detalhes
                    </router-link>
                </div>
            </li>
        </ul>
      </div>
    `
}

const Detalhe = {
  data() {
    return {
      order: {}
    }
  },
  async created() {
    await this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      const code = this.$route.params.code;
      let response = await fetch(`http://localhost:3000/api/v1/orders/QUEEN01/${code}`);
      let data = await response.json();
      this.order = data;
    },
    async change(code, status) {
      let response = await fetch(`http://localhost:3000/api/v1/orders/QUEEN01/${code}/?status=${status}`, {
        method: "PATCH"
      });
      let data = await response.json();
      this.order = data;
    }
  },
  template: `
    <div class="container">
      <div class="m-0 fs-4 text-center">
        <p v-if="order.status === 'waiting'" style="color: rgb(64, 64, 63);">Situação: Aguardando</p>
        <p v-else-if="order.status === 'in_preparation'" style="color: rgb(249, 129, 0);">Situação: Em preparação</p>
        <p v-else-if="order.status === 'ready'" style="color: green;">Situação: Pronto</p>
      </div>
      <p class="m-0">Nome: <strong>{{ order.name }}</strong></p>
      <p class="m-0">Telefone: {{ order.phone }}</p>
      <p class="m-0">E-mail: {{ order.email }}</p>
      <p class="m-0">CPF: {{ order.cpf }}</p>
      <p class="m-0">Código: {{ order.code }}</p>
      <p class="m-0">Criado em: {{ order.created_at }}</p>
      <hr>
      <h2 class="fs-5">Itens do pedido: </h2>
      <ol class="list-group list-group-numbered">
        <li v-for="item in order.order_items" class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">{{ item.orderable.name }}</div>
            {{ item.orderable.description }}
          </div>
          <span class="badge text-bg-primary rounded-pill">{{ item.orderable.calories }} Cal</span>
        </li>
      </ol>
      <div class="mt-4">
        <button v-if="order.status === 'in_preparation'" type="button" class="btn btn-success" v-on:click="change(order.code, 'ready')">Pedido Pronto</button>
        <button v-if="order.status === 'waiting'" type="button" class="btn btn-primary" v-on:click="change(order.code, 'in_preparation')">Aceitar Pedido</button>
      </div>
    </div>
  `
}

// Definição das rotas
const routes = [
    { path: '/', component: Home },
    { path: '/detalhe/:code', component: Detalhe }
]

// Criação do router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

// Criação da aplicação Vue
const app = Vue.createApp({})
app.use(router)
app.mount('#app')