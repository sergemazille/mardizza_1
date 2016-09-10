import {FirebaseDb} from "./FirebaseDb";
export class Dom {

    static init() {
        $(".pizza-card").each(function () {
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

    static getSelectedPizzaInfo($pizzaCard) {
        let pizzaName = $pizzaCard.find(".pizza-name").text();
        let pizzaPrice = $pizzaCard.find(".pizza-price").text();
        let userName = $("#username").text(); // can't get with twig because of ES6 compiler

        return {
            name: pizzaName,
            price: pizzaPrice,
            username: userName,
        }
    }

    static getSelectedPizzaRow(pizzaId){
        return $(`tr#${pizzaId}`);
    }

    // add pizza on DOM
    static addPizza(pizzaId, pizza) {
        let pizzaRow = `<tr id="${pizzaId}">
            <td class="pizza-item"><span class="glyphicon glyphicon-remove pizza-remove"></span></td>
            <td class="userName">${pizza.username}</td>
             <td class="pizzaName">${pizza.name}</td>
             <td class="pizzaPrice">${pizza.price}</td>
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
}
