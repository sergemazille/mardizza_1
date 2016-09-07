export class Dom {

    static getCredentials(){
        let $email = $("#email").val();
        let $username = $("#username").val();
        let $password = $("#password").val();

        return {
            'email': $email,
            'username': $username,
            'password': $password
        }
    }
    
    static getOrderReference(){
        return $("#order-reference").text();
    }

    static getSelectedPizza($pizzaCard){

        let pizzaName = $pizzaCard.find(".pizza-name").text();
        let pizzaPrice = $pizzaCard.find(".pizza-price").text();
        let userName = $("#username").text(); // can't get with twig because of ES6 compiler

        return {
            name: pizzaName,
            price: pizzaPrice,
            username: userName,
        }
    }
    
    static addPizza(pizzaId, pizza){
        let pizzaItem = `<li id="${pizzaId}" class="pizza-item"><span class="glyphicon glyphicon-remove pizza-remove"></span>&nbsp;</a>${pizza.username} - ${pizza.name} : ${pizza.price}</li>`;
        $("#pizza-list").append(pizzaItem);
    }

    static removePizza(pizzaId){
        let $pizzaListItem = $(`li#${pizzaId}`);
        $pizzaListItem.remove();
    }
}
