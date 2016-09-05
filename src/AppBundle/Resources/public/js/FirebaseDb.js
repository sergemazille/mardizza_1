import * as constantes from "./constantes";

export class FirebaseDb {

    static init() {
        firebase.initializeApp(constantes.firebaseConfig);
    }

    static signIn(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                console.log('Le mot de passe est trop faible.');
            } else {
                console.log(errorMessage);
            }
            console.log(error);
        });
    }

    static logIn(email, password, callback) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (data) {

                callback(data);
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/wrong-password') {
                    console.log('Mauvais mot de passe.');
                } else {
                    console.log(errorMessage);
                }
                callback(); // trigger callback for Symfony error message
            });
    }
    
    static logOut(callback){
        firebase.auth().signOut()
            .then(function(){
                
                callback();
            });
    }
}
