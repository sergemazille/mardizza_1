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
            },
        });

        let vm = new Vue({
            el: '#app',

            data: {
                pizzas: []
            },

            ready(){
                $.get('/pizzas', function(pizzas){
                    vm.pizzas = pizzas;
                });
            }
        });
    }
}