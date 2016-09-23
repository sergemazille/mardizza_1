import { FirebaseDb } from './FirebaseDb';
import { Event } from './Event';
import { Dom } from './Dom';

export class VueJs {

    static init() {
        Vue.config.delimiters = ['$<', '>'];
        Vue.filter('euro', function (price) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        Vue.component('pizzas',{
            props: ['pizzas'],
            template: '#pizzas-template'
        });

        let vm = new Vue({
            el: '#app',

            ready: function(){

                // launch regular javascript
                FirebaseDb.init();
                Event.init();
                Dom.init();
            }
        });
    }
}