import {Helper} from "./Helper";

export class Dom {
    
    static init() {
        // shorten too long text for pizza ingredients
        $(".pizza-card").each(function () {
            Dom.cropLongText(this);
        });

        // show a message if the order basket is empty
        Dom.showOrHideEmptyBasketMessage();
    }

    static getCredentials(loginOrCreate) {

        let $email;
        let $username;
        let $password;

        if (loginOrCreate === 'login'){
            $email = $("#login-email").val();
            $password = $("#login-password").val();
            
        } else {
            $email = $("#create-email").val();
            $username = $("#create-username").val();
            $password = $("#create-password").val();
        }

       return {
            'email': $email,
            'username': $username,
            'password': $password,
        }
    }

    static getOrderReference() {
        return $("#order-reference").text();
    }

    static getSelectedPizzaInfo($pizzaCard) {
        let pizzaName = $pizzaCard.find(".pizza-name").data('name');
        let pizzaPrice = $pizzaCard.find(".pizza-price").data('price');
        let userName = $("#username").data('username'); // can't get with twig because of ES6 compiler

        return {
            name: pizzaName,
            price: pizzaPrice,
            username: userName,
        }
    }

    static getSelectedPizzaRow(pizzaId) {
        return $(`tr#${pizzaId}`);
    }

    // add pizza on DOM
    static addPizza(pizzaId, pizza) {

        // price format
        let formattedPrice = Helper.formatPrice(pizza.price);

        let pizzaRow = `<tr id="${pizzaId}">
            <td class="pizza-item"><span class="glyphicon glyphicon-remove pizza-remove"></span></td>
            <td class="user-name">${pizza.username}</td>
             <td class="pizza-name">${pizza.name}</td>
             <td class="pizza-price" data-price="${pizza.price}">${formattedPrice}</td>
             </tr>`;

        $("#pizza-list").append(pizzaRow);
    }

    // remove pizza from DOM
    static removePizza(pizzaId) {
        let $pizzaRow = Dom.getSelectedPizzaRow(pizzaId);

        $pizzaRow.remove();
    }

    static cropLongText(pizzaCard) {
        let $pizzaIngredients = $(pizzaCard).find(".pizza-card-ingredients");

        var isTruncated = $pizzaIngredients.triggerHandler("isTruncated");
        if (!isTruncated) {
            $pizzaIngredients.dotdotdot({
                ellipsis: '...'
            });
        }
    }

    static showOrHideEmptyBasketMessage() {
        if ($("#pizza-list tr").length < 1) {

            let messages = [
                "C'est l'heure de commander une pizza !!!",
                "Pour l'instant je suis un peu inutile...",
                "Mieux vaut une pizza que... heu... qu'aucune !!!",
                "Sélectionnez au moins une pizza... allez, pour me faire plaisir !",
                "Vincent recommande la pizza tartiflette !!!",
                "Eric recommande d'ajouter un supplément merguez !",
                "Kowabunga, les Tortues Ninjas recommandent de ne pas choisir et de toutes les prendre !!!"
            ];

            let randomMessage = messages[Math.floor(Math.random() * messages.length)];
            let message = `<p id="basket-message">${randomMessage}</p>`;
            $("#order-basket").append(message);

        } else {
            $("#basket-message").remove();
        }
    }

    // show or hide 'total' row if table is not empty
    static showOrHideBasketTotal() {

        let $table = $("#pizza-list");

        if ($table.find('tr').length >= 1) {
            
            // calculate total
            let total = Helper.calculateBasketTotal();

            // format total price
            total = Helper.formatPrice(total);

            // insert total on DOM element
            $("#price-total").text(total) ;

            // show total element
            $("#basket-total").removeClass('hidden');
        }else{
            $("#basket-total").addClass('hidden');
        }
    }
}
