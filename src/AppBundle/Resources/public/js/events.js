import {Dom} from "./Dom";
import {FirebaseDb} from "./FirebaseDb";

export class Events {

    static init() {

        $(".card").on('click', function(){
            let fUser = firebase.auth().currentUser;

            console.log(fUser.email);
        });

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
        })
    }
}
