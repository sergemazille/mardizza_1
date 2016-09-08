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

        // add a pizza on database
        $(".card").on('click', function () {

            let pizza = Dom.getSelectedPizza($(this));

            databaseReference.push({
                name: pizza.name,
                price: pizza.price,
                username: pizza.username,
            });
        });

        // watch database
        databaseReference.on('child_added', function (data) {
            Dom.addPizza(data.key, data.val());

            // refresh Dom for jquery events
            // Event.refreshDomEvents();
        });

        databaseReference.on('child_removed', function (data) {
            Dom.removePizza(data.key);
        });
    }
}
