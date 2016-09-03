$(document).ready(function () {
    initFirebase();
    initVueJs();
    initApp();
});

// Firebase
function initFirebase() {

    var config = {
        apiKey: "AIzaSyBL81xH1eFaPgh200qVoZyK4A5qYetJ6Ds",
        authDomain: "mardizza-bdfa5.firebaseapp.com",
        databaseURL: "https://mardizza-bdfa5.firebaseio.com",
        storageBucket: "mardizza-bdfa5.appspot.com",
    };
    firebase.initializeApp(config);
}

// VueJS
function initVueJs() {

    Vue.config.delimiters = ['${', '}'];

    new Vue({
        el: '#app',
        data: {
            pageTitle: "Mardizza !!!"
        }
    });
}

// App logic
function initApp() {

    // Firebase database reference
    var database = firebase.database();

    // new order reference
    var timestamp = Date.now();
    var orderPath = 'orders/' + timestamp + '/';

    // new order pizzas references
    var pizzasPath = orderPath + 'pizzas/';
    var pizzasRef = database.ref(pizzasPath);

    // add a new pizza to the order
    $('.card').on('click', function(){

        var card = $(this);
        var name = card.find('.pizza-name').text();
        var price = card.find('.pizza-price').text();

        // push new pizza to DB
        var pizza = pizzasRef.push({
            'name': name,
            'price': price
        });

        // show new pizza on page
        var pizzaList = $('#pizzas');
        pizzaList.append('<li>' + name + ' : ' + price + '</li>');
    });
}