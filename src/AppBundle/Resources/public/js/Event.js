import {Dom} from "./Dom";
import * as Const from "./constantes";
import {FirebaseDb} from "./FirebaseDb";
import {Helper} from "./Helper";

export class Event {

    static init() {

        Event.snapshot();

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
        // $(".pizza-card-content").on('click', function (e) {
        //     e.preventDefault();
        //
        //     let pizza = Dom.getSelectedPizzaInfo($(this).parent('.pizza-card'));
        //
        //     $.post(`/pizza/${pizza.id}`)
        //         .done(function (pizzaInfos) {
        //
        //             $('body').append(pizzaInfos);
        //             $("#pizza-modal").modal("show");
        //             Event.snapshot();
        //
        //             // Remove modal from the DOM in case user click an other pizza card
        //             $("#pizza-modal").on("hidden.bs.modal", function(){
        //                 $(this).remove();
        //             });
        //         })
        // });

        // add camera effect for pizza card clipboard copy
        $(".pizza-clipboard").on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let $pizzaCard = $(this).closest(".pizza-card");
            Dom.cameraEffect($pizzaCard);
        });

        // expand account dropdown on hover
        $(".dropdown.nav-right-content").hover(
            // hover
            function () {
                $(this).addClass('open');
            },
            // leave
            function () {
                $(this).removeClass('open');
            }
        );
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

    // copy pizza snapshot image into clipboard
    static snapshot() {
        let screenshotLinks = document.querySelectorAll('.pizza-clipboard');
        let clipboard = new Clipboard(screenshotLinks);
        clipboard.on('success', function () {
            Dom.createNotification("Pizza copiée dans le presse-papier.", "alert-success");
        });
        clipboard.on('error', function () {
            Dom.createNotification("Erreur lors de la copie dans le presse papier.", "alert-danger");
        });
    }
}
