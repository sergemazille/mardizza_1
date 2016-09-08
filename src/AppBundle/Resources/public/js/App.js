import {Event} from "./Event";

export class App {

    static init() {

        Event.init();

        let firebaseInterval = setInterval(function () {
            let user = firebase.auth().currentUser;
            if(user){
                console.log(user.email);
                clearInterval(firebaseInterval);
            }

        }, 200)
    }
}
