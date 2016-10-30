import {Dom} from './Dom';

export class orderVue {

    static init() {

        // global storage
        let store = {};

        // initialized for filtering
        let vm = {};

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
                        username: vm.current_username,
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
            props: ['pizza', 'price'],
            data(){
                return {
                    username: this.pizza.username,
                    name: this.pizza.name,
                    key: this.pizza.key,
                }
            },
            methods: {
                removePizzaFromDb(){
                    vm.$emit('pizzaRemoved', this.pizza);
                },
            },
            computed: {
                isOwner(){
                    return this.pizza.username == vm.current_username;
                },
                isNotOwner(){
                    return !this.isOwner;
                },
            },
        };

        let Basket = {
            template: '#basket-template',
            data(){
                return {
                    messages: [],
                    message: '',
                    pizzas: [],
                }
            },
            methods: {
                addPizzaToBasket(pizza){
                    this.pizzas.push({'pizza': pizza, 'price':pizza.price}); // set a key to the object so user can add multiple times the same pizza
                },
                removePizzaFromBasket(key){
                    $(this.pizzas).each(function (index, row) {
                        if (row.pizza.key == key) {
                            this.pizzas.$remove(row);
                        }
                    }.bind(this));
                },
                removePizzaFromDb(pizza){
                    if (pizza.username == vm.current_username) {
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
                    if (!this.pizzas) {
                        return 0;
                    }
                    // prices array
                    let selectedPizzasPrices = this.pizzas.map(function(pizza){
                        return pizza.price;
                    });
                    return selectedPizzasPrices.reduce(function (total, value) {
                        return total + value;
                    }, 0);
                },
                pizzaLowestPrice() {
                    let lowestPrice = 99; // arbitrary high value
                    for(let item of this.pizzas) {
                        lowestPrice = (item.pizza.price < lowestPrice) ? item.pizza.price : lowestPrice;
                    }
                    return lowestPrice;
                },
                groupStamps() {
                    return vm.group_stamps;
                },
                promoStamps() {
                    return this.groupStamps + this.pizzas.length;
                },
                promoOn() {
                    return this.promoStamps >= 11;
                },
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
            props: ['order_reference', 'current_username', 'group_stamps'],
            data: {
                pizzas: [],
                filterByFavorite: false,
                nameFilter: '',
                alphaSort: 1,
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
                setOrderRef(){
                    store.order_reference = this.order_reference;
                    store.databaseReference = firebase.database().ref(`orders/${this.order_reference}`);
                },
                toggleFavoriteFilter(){
                    this.filterByFavorite = !this.filterByFavorite;
                },
                toggleAlphaSort(){
                    this.alphaSort = this.alphaSort * -1;
                },
            },
            components: {
                'basket': Basket,
            },
            ready(){
                // hydrate with ajax calls
                this.getPizzas();
                this.setOrderRef();
            }
        });
    }
}