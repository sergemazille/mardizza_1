import { Events } from './Events';

export class App {

    static init() {
        
        Events.init();

        // show symfony and firebase auth checker
        // TODO: delete on prod
        let checkUser = setInterval(function(){

            let fUser = firebase.auth().currentUser;

            if(fUser != null){
                $("p#check-auth-firebase").text('Firebase : ' + fUser.email);
                clearInterval(checkUser);
            }
        }, 500);


        // Firebase database reference
        let database = firebase.database();

        // new order reference
        let timestamp = Date.now();
        let orderPath = 'orders/' + timestamp + '/';

        // new order pizzas references
        let pizzasPath = orderPath + 'pizzas/';
        let pizzasRef = database.ref(pizzasPath);
        
    }
}
