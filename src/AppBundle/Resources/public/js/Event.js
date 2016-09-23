import {Dom} from "./Dom";
import * as Const from "./constantes";
import {FirebaseDb} from "./FirebaseDb";
import {Helper} from "./Helper";

export class Event {

    static init() {
        // current order database reference
        let orderReference = Dom.getOrderReference();
        let databaseReference = FirebaseDb.setDatabaseOrderReference(orderReference);

        // login form hook
        $(document).on('submit', '#login-form', function (e) {
            e.preventDefault();

            let credentials = Dom.getCredentials('login');

            // login first on Firebase server
            FirebaseDb.logIn(credentials.email, credentials.password, function (data) {

                console.log(data);

                // then login on mardizza.com
                e.currentTarget.submit();
            });
        });

        // logout hook
        $(document).on('click', "a#logout", function (e) {
            e.preventDefault();

            // logout first from Firebase server
            FirebaseDb.logOut(function () {
                // then logout from mardizza.com
                window.location.href = "/logout";
            });
        });

        // create user form hook
        $(document).on('submit', "#signup-form", function (e) {
            e.preventDefault();

            let credentials = Dom.getCredentials('create');

            // check on server first if username is unique
            Helper.checkUniqueUsername(credentials.username, function (response) {

                if (true === response) {
                    // create user first on Firebase server
                    firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)

                        .then(function () {
                            // then create user on mardizza.com
                            e.currentTarget.submit();
                        })
                        .catch(function (error) {
                            Dom.createNotification(error.message, Const.ALERT_ERROR);
                        });
                } else {
                    Dom.createNotification("Ce prénom est déjà utilisé", Const.ALERT_ERROR);
                }
            });
        });

        // click on a pizza card
        $(document).on('click', ".pizza-card", function (e) {
            let pizza = Dom.getSelectedPizzaInfo($(this));
        });

        // add a pizza on database
        $(document).on('click', ".add-pizza", function (e) {
            e.preventDefault();
            e.stopPropagation();

            let pizzaInfo = Dom.getSelectedPizzaInfo($(this).closest('.pizza-card'));

            databaseReference.push({
                name: pizzaInfo.name,
                price: pizzaInfo.price,
                username: pizzaInfo.username,
            });
        });

        // watch database
        databaseReference.on('child_added', function (data) {
            // add pizza on DOM
            Dom.addPizza(data.key, data.val());

            // show message if table is empty
            Dom.showOrHideEmptyBasketMessage();

            // show or hide 'total' row if table is not empty
            Dom.showOrHideBasketFooter();

            // register 'remove from Dom' event
            Event.removePizza(data.key);
        });

        databaseReference.on('child_removed', function (data) {
            // remove pizza from DOM
            Dom.removePizza(data.key);

            // show message if table is empty
            Dom.showOrHideEmptyBasketMessage();

            // show or hide 'total' row if table is not empty
            Dom.showOrHideBasketFooter();
        });

        // add pizza to user favorites
        $(document).on('click', ".add-favorite", function (e) {
            e.preventDefault();

            Helper.switchFavoritesClasses(e.currentTarget);

            let pizzaId = $(this).closest(".pizza-card").data("pizzaid");
            Helper.addPizzaToFavorites(pizzaId);

            Dom.favoriteFilterActivation();
            Dom.filterFavorites();
        });

        // remove pizza to user favorites
        $(document).on('click', ".remove-favorite", function (e) {
            e.preventDefault();

            Helper.switchFavoritesClasses(e.currentTarget);

            let pizzaId = $(this).closest(".pizza-card").data("pizzaid");
            Helper.removePizzaFromFavorites(pizzaId);

            Dom.favoriteFilterActivation();
            Dom.filterFavorites();
        });

        // add camera effect for pizza card clipboard copy
        $(document).on('click', ".pizza-clipboard", function (e) {
            e.preventDefault();

            let $pizzaCard = $(this).closest(".pizza-card");
            Dom.cameraEffect($pizzaCard);
        });

        // filter by favorites
        $(document).on("click", "#filter-favorites", function (e) {
            e.preventDefault();

            let $checkbox = $(e.currentTarget);
            $checkbox.toggleClass("active");

            Dom.favoriteFilterActivation();
            Dom.filterFavorites();
        });
    }

    // Pizza removal behaviour
    static removePizza(pizzaId) {
        let $pizzaRow = Dom.getSelectedPizzaRow(pizzaId);

        // remove from database
        $pizzaRow.find('.pizza-remove').on('click', function () {

            // check if current user is owner
            let pizzaOwner = Dom.getPizzaOwnerUsername(pizzaId);

            if (Helper.isOwner(pizzaOwner)) {
                let pizzaReference = FirebaseDb.getPizzaReference(Dom.getOrderReference(), pizzaId);
                pizzaReference.remove();
            }
        });
    }
}
