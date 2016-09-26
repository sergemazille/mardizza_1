export class Vuejs {

    static init() {

        Vue.config.delimiters = ['${', '}'];

        Vue.filter('euro', function (price) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        let pizzaComponent = Vue.component('pizza', {
            template: '#pizza-template',
            props: ['pizza'],
            // props: ['id', 'name', 'image', 'snapshot', 'ingredients', 'price', 'favorite'],
            methods: {
                toggleFavorite(){
                    this.pizza.isFavorite = !this.pizza.isFavorite;
                },
            },
            // data(){
            //     return {
            //         id: '',
            //         name: '',
            //         image: '',
            //         snapshot: '',
            //         ingredients: '',
            //         price: '',
            //         favorite: '',
            //     }
            // }
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