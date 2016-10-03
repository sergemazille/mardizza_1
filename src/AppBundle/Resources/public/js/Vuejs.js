import {FirebaseDb} from './FirebaseDb';
import {Dom} from './Dom';

export class Vuejs {

    static init() {

        // current order database reference
        FirebaseDb.init();

        // global storage
        let store = {};

        // initialized for filtering
        let vm = {};

        Vue.config.delimiters = ['${', '}'];

        Vue.filter('euro', function (price = 0) {
            return ((price.toFixed(2)).replace('.', ',') + '\xa0€');
        });

        Vue.filter('filterByFavorite', function (pizzas) {
            if (vm.filterByFavorite) {
                return pizzas.filter(function (pizza) {
                    return pizza.isFavorite;
                })
            }

            return pizzas;
        });

        Vue.component('pizza', {
            template: '#pizza-template',
            props: ['pizza'],
            methods: {
                toggleIsFavorite(){
                    this.pizza.isFavorite = !this.pizza.isFavorite;
                    this.saveUserFavorite();
                },
                addPizzaToDb(){
                    store.databaseReference.push({
                        name: this.pizza.name,
                        price: this.pizza.price,
                        username: store.username,
                    });
                },
                saveUserFavorite(){
                    let action = this.pizza.isFavorite ? 'add' : 'remove';
                    $.post({
                        url: `/user/${action}/pizza/${this.pizza.id}`
                    });
                },
                takeSnapshot(e){
                    // visual effect
                    let $pizzaCard = $(e.currentTarget).closest('.pizza-container');
                    Dom.cameraEffect($pizzaCard);
                }
            },
        });

        let Row = {
            template: '#row-template',
            props: ['pizza'],
            data(){
                return {
                    username: this.pizza.username,
                    name: this.pizza.name,
                    price: this.pizza.price,
                    key: this.pizza.key,
                }
            },
            methods: {
                removePizzaFromDb(){
                    vm.$emit('pizzaRemoved', this.pizza);
                },
            }
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
                removePizzaFromBasket(key){
                    $(this.rows).each(function (index, row) {
                        if (row.pizza.key == key) {
                            this.rows.$remove(row);
                        }
                    }.bind(this));
                },
                removePizzaFromDb(pizza){
                    if (pizza.username == store.username) {
                        let dbPizza = firebase.database().ref(`orders/${store.order_reference}/${pizza.key}`);
                        dbPizza.remove();
                    }
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
            components: {
                'row': Row,
            },
            computed: {
                order_total(){
                    if (!this.rows) {
                        return 0;
                    }

                    // prices array
                    let selectedPizzasPrices = this.rows.map(function(row){
                        return row.pizza.price;
                    });

                    return selectedPizzasPrices.reduce(function (total, value) {
                        return total + value;
                    }, 0);
                }
            },
            created(){
                this.getMessages();

                // load functions that needs store variable to be hydrated
                this.$parent.$nextTick(function () {
                    // watch database
                    store.databaseReference.on('child_added', function (dbPizza) {
                        let pizza = dbPizza.val();
                        pizza.key = dbPizza.key; // add the key to enable the remove behaviour
                        this.addPizzaToBasket(pizza);
                    }.bind(this));

                    store.databaseReference.on('child_removed', function (dbPizza) {
                        let key = dbPizza.key;
                        this.removePizzaFromBasket(key);
                    }.bind(this));
                }.bind(this));

                // listen for when a remove row button is clicked
                this.$parent.$on('pizzaRemoved', this.removePizzaFromDb)
            }
        };

        vm = new Vue({
            el: '#app',
            props: ['order_reference'],
            data: {
                pizzas: [],
                username: '',
                filterByFavorite: false,
                nameFilter: '',
            },
            methods: {
                getPizzas(){
                    $.get('/pizzas', function (pizzas) {
                        this.pizzas = pizzas;
                        // load functions that needs pizzas to be on DOM to work
                        this.$nextTick(function () {
                            Dom.loadClipboard();
                        });
                    }.bind(this));
                },
                getUsername(){
                    $.get('/username', function (username) {
                        store.username = username;
                    });
                },
                setOrderRef(){
                    store.order_reference = this.order_reference;
                    store.databaseReference = firebase.database().ref(`orders/${this.order_reference}`);
                },
                toggleFavoriteFilter(){
                    this.filterByFavorite = !this.filterByFavorite;
                },
            },
            components: {
                'basket': Basket,
            },
            ready(){
                // hydrate with ajax calls
                this.getPizzas();
                this.getUsername();
                this.setOrderRef();
            }
        });

    }
}