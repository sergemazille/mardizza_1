import {Events} from "./Events";
import {Dom} from "./Dom";
import {FirebaseDb} from "./FirebaseDb";

export class App {

    static init() {

        Events.init();

        // show symfony and firebase auth checker
        // TODO: delete on prod
        let checkUser = setInterval(function () {

            let fUser = firebase.auth().currentUser;

            if (fUser != null) {
                $("p#check-auth-firebase").text('Firebase : ' + fUser.email);
                clearInterval(checkUser);
            }
        }, 500);

            // TODO: move to appropriate place in Events
            // current order database reference
            let orderReference = Dom.getOrderReference();
            let databaseReference = FirebaseDb.setDatabaseOrderReference(orderReference);

            // test push a pizza on database order
            let pizzaId = databaseReference.push({
                name: "Reine",
                price: "9,50",
                owner: "Serge",
            });

            databaseReference.on('child_added', function (data) {
                Dom.addPizza(data.key, data.val());
            });
    }
}
