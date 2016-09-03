import * as constantes from './constantes';

export class Database {

    static init() {
        firebase.initializeApp(constantes.firebaseConfig);
    }
}