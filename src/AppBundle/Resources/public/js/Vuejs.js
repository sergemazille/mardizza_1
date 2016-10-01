import {Helper} from './Helper';

export class Vuejs {

    static init() {

        // global storage
        let store = {};

        Vue.config.delimiters = ['${', '}'];

        Vue.filter('euro', function (price) {
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
                },
            },
        });

        Vue.component('basket', {
            template: '#basket-template',
            data(){
                return {
                    messages: [],
                    message: '',
                }
            },
            methods: {
                addPizzaToBasket(){

                },
                setRandomMessage(){
                    let ln = this.messages.length;
                    this.message = this.messages[Math.floor(Math.random() * ln)];
                },
                getMessages(){
                    let that = this;
                    $.get('/basket/messages', function (messages) {
                        that.messages = messages;
                        that.setRandomMessage();
                    });
                },
            },
            created(){
                this.getMessages();
            }
        });

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

            ready(){

                // hydrate with ajax calls
                this.getPizzas();
                this.getUsername();
                this.getOrderRef();
            }
        });
    }
}