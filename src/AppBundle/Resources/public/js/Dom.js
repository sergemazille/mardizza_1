import {FirebaseDb} from "./FirebaseDb";
export class Dom {

    static init() {
        $(".pizza-card").each(function(){
            Dom.cropLongText(this);
        });
    }

    static getCredentials() {
        let $email = $("#email").val();
        let $username = $("#username").val();
        let $password = $("#password").val();

        return {
            'email': $email,
            'username': $username,
            'password': $password
        }
    }

    static getOrderReference() {
        return $("#order-reference").text();
    }

    static getSelectedPizza($pizzaCard) {
        let pizzaName = $pizzaCard.find(".pizza-name").text();
        let pizzaPrice = $pizzaCard.find(".pizza-price").text();
        let userName = $("#username").text(); // can't get with twig because of ES6 compiler

        return {
            name: pizzaName,
            price: pizzaPrice,
            username: userName,
        }
    }

    static addPizza(pizzaId, pizza) {
        let pizzaItem = `<li id="${pizzaId}" class="pizza-item"><span class="glyphicon glyphicon-remove pizza-remove"></span>&nbsp;</a>${pizza.username} - ${pizza.name} : ${pizza.price}</li>`;
        $("#pizza-list").append(pizzaItem);

        // Pizza removal behaviour from db
        $("#pizza-list").find('.pizza-remove').on('click', function (e) {

            let $pizzaId = $(e.currentTarget).parent().attr('id');
            let pizzaReference = FirebaseDb.getPizzaReference(Dom.getOrderReference(), $pizzaId);

            // removed from firebase
            pizzaReference.remove();
        });
    }

    static removePizza(pizzaId) {
        let $pizzaListItem = $(`li#${pizzaId}`);

        // removed from dom
        $pizzaListItem.remove();
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
}
