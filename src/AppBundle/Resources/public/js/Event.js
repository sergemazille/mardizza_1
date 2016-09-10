import {Dom} from "./Dom";
import {FirebaseDb} from "./FirebaseDb";

export class Event {

    static init() {

        // current order database reference
        let orderReference = Dom.getOrderReference();
        let databaseReference = FirebaseDb.setDatabaseOrderReference(orderReference);

        // login form hook
        $("#login-form").on('submit', function (e) {

            e.preventDefault();

            let credentials = Dom.getCredentials();

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
            Dom.addPizza(data.key, data.val());
        });

        databaseReference.on('child_removed', function (data) {
            Dom.removePizza(data.key);
        });
    }
}
