import {Helper} from './Helper';

export class Vuejs {

    static init() {

        // global storage
        let store = {};

        Vue.config.delimiters = ['${', '}'];

        Vue.filter('euro', function (price = 0) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        Vue.component('pizza', {
            template: '#pizza-template',
            props: ['pizza'],
            methods: {
                toggleIsFavorite(){
                    this.pizza.isFavorite = !this.pizza.isFavorite;
                },
                addToOrder(){
                    Helper.addPizzaOnOrderDatabase(this.pizza, store.username);
                    vm.$dispatch('pizzaAdded', this.pizza);
                },
            },
        });

        let Row = {
            template: '#row-template',
            props: ['pizza'],
            data(){
                return {
                    username: store.username,
                    name: this.pizza.name,
                    price: this.pizza.price,
                }
            },
        };

        let Basket = {
            template: '#basket-template',
            data(){
                return {
                    messages: [],
                    message: '',
                    rows: [],
                }
            },
            methods: {
                addPizzaToBasket(pizza){
                    this.rows.push({'pizza': pizza}); // set a key to the object so user can add multiple times the same pizza
                },
                setRandomMessage(){
                    let ln = this.messages.length;
                    this.message = this.messages[Math.floor(Math.random() * ln)];
                },
                getMessages(){
                    $.get('/basket/messages', function (messages) {
                        this.messages = messages;
                        this.setRandomMessage();
                    }.bind(this));
                },
            },
            components:{
                'row': Row,
            },
            created(){
                this.getMessages();
                this.$parent.$on('pizzaAdded', function(pizza){
                    this.addPizzaToBasket(pizza);
                }.bind(this));
            }
        };

        let vm = new Vue({
            el: '#app',
            data: {
                pizzas: [],
            },

            methods: {
                getPizzas(){
                    $.get('/pizzas', function (pizzas) {
                        vm.pizzas = pizzas;
                        // load functions that needs pizzas to be on DOM to work
                        vm.$nextTick(function () {

                        });
                    });
                },
                getUsername(){
                    $.get('/username', function (username) {
                        store.username = username;
                    });
                },
                getOrderRef(){
                    $.get('/order/reference', function (orderRef) {
                        store.order_reference = orderRef;
                    });
                },
            },
            components: {
                'basket': Basket,
            },
            ready(){
                // hydrate with ajax calls
                this.getPizzas();
                this.getUsername();
                this.getOrderRef();
            }
        });
    }
}