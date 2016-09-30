import {Helper} from './Helper';

export class Vuejs {

    static init() {

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
                    Helper.addPizzaOnOrderDatabase(this.pizza, vm.username);
                },
            },
        });

        let vm = new Vue({
            el: '#app',
            data: {
                pizzas: [],
                username: {},
            },

            methods:{
                getPizzas(){
                    $.get('/pizzas', function(pizzas){
                        vm.pizzas = pizzas;
                        // load functions that needs pizzas to be on DOM to work
                        vm.$nextTick(function(){

                        });
                    });
                },
                getUsername(){
                    $.getJSON('/username', function(username){
                        vm.username = username;
                    });
                },
            },

            ready(){
                this.getPizzas();
                this.getUsername();
            }
        });
    }
}