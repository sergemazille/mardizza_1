export class Vuejs {

    static init() {
        Vue.config.delimiters = ['${', '}'];

        Vue.filter('euro', function (price) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        Vue.component('pizza', {
            props: ['id', 'name', 'image', 'snapshot', 'ingredients', 'price', 'favorite'],
            template: '#pizza-template',
            methods: {
                toggleFavorite(){
                    this.favorite = !this.favorite;
                },
            }
        });

        let vm = new Vue({
            el: '#app',
        });
    }
}