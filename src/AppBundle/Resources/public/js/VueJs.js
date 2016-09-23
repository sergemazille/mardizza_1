import {FirebaseDb} from './FirebaseDb';
import {Event} from './Event';
import {Dom} from './Dom';

export class VueJs {

    static init() {
        Vue.config.delimiters = ['$<', '>'];
        Vue.filter('euro', function (price) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        Vue.component('pizzas', {

            template: '#pizzas-template',

            data: function () {
                return {
                    pizzas: []
                };
            },

            created: function () {
                this.fetchPizzas();
            },

            methods: {
                fetchPizzas(){
                    let that = this;
                    $.get('/pizzas', function (pizzas) {
                        that.pizzas = pizzas;

                        // load functions that needs pizzas to be on DOM to work
                        that.$nextTick(function(){
                            Dom.loadClipboard();
                        });
                    });
                },
            }
        });

        let vm = new Vue({
            el: '#app',

            ready(){
                // launch other scripts

            }
        });
    }
}