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
    
    static addPizza(pizzaId, pizza){
        let pizzaItem = `<li id="${pizzaId}">${pizza.name} : ${pizza.price}</li>`;
        $("#pizza-list").append(pizzaItem);
    }
}
