export class App {

    static init() {
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
}