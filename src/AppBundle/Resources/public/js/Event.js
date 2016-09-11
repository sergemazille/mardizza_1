import {Dom} from "./Dom";
import {FirebaseDb} from "./FirebaseDb";
import {Helper} from "./Helper";

export class Event {

    static init() {
        // current order database reference
        let orderReference = Dom.getOrderReference();
        let databaseReference = FirebaseDb.setDatabaseOrderReference(orderReference);

        // login form hook
        $("#login-form").on('submit', function (e) {
            e.preventDefault();

            let credentials = Dom.getCredentials('login');

            // login first on Firebase server
            FirebaseDb.logIn(credentials.email, credentials.password, function (data) {
                // then login on mardizza.com
                e.currentTarget.submit();
            });
        });

        // logout hook
        $("a#logout").on('click', function (e) {
            e.preventDefault();

            // logout first from Firebase server
            FirebaseDb.logOut(function () {
                // then logout from mardizza.com
                window.location.href = "/logout";
            });
        });

        // create user form hook
        $("#signup-form").on('submit', function (e) {
            e.preventDefault();

            let credentials = Dom.getCredentials('create');

            // create user first on Firebase server
            firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)

                .then(function () {
                    // then create user on mardizza.com
                    e.currentTarget.submit();
                })
                .catch(function (error) {
                    $(".messages").append(`<div class="alert alert-danger">${error.message}</div>`);
                });
        });

        // click on a pizza card
        $(".pizza-card").on('click', function (e) {
            let pizza = Dom.getSelectedPizzaInfo($(this));
        });

        // add a pizza on database
        $(".add-pizza").on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let pizzaInfo = Dom.getSelectedPizzaInfo($(this).closest('.pizza-card'));

            databaseReference.push({
                name: pizzaInfo.name,
                price: pizzaInfo.price,
                username: pizzaInfo.username,
            });
        });

        // change fav icon on hover
        $(".glyphicon-heart-empty").hover(
            // hover
            function (e) {
                $(e.currentTarget).removeClass('glyphicon-heart-empty');
                $(e.currentTarget).addClass('glyphicon-heart');
            },
            // leave
            function (e) {
                $(e.currentTarget).removeClass('glyphicon-heart');
                $(e.currentTarget).addClass('glyphicon-heart-empty');
            });

        // watch database
        databaseReference.on('child_added', function (data) {
            // add pizza on DOM
            Dom.addPizza(data.key, data.val());

            // show message if table is empty
            Dom.showOrHideEmptyBasketMessage();

            // show or hide 'total' row if table is not empty
            Dom.showOrHideBasketTotal();

            // register 'remove from Dom' event
            Event.removePizza(data.key);
        });

        databaseReference.on('child_removed', function (data) {
            // remove pizza from DOM
            Dom.removePizza(data.key);

            // show message if table is empty
            Dom.showOrHideEmptyBasketMessage();

            // show or hide 'total' row if table is not empty
            Dom.showOrHideBasketTotal();
        });
    }

    // Pizza removal behaviour
    static removePizza(pizzaId) {
        let $pizzaRow = Dom.getSelectedPizzaRow(pizzaId);

        // remove from database
        $pizzaRow.find('.pizza-remove').on('click', function () {

            // check if current user is owner
            let pizzaOwner = Dom.getPizzaOwnerUsername(pizzaId);

            if(Helper.isOwner(pizzaOwner)){
                let pizzaReference = FirebaseDb.getPizzaReference(Dom.getOrderReference(), pizzaId);
                pizzaReference.remove();
            }
        });
    }
}
