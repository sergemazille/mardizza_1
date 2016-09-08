import { VueJs } from './VueJs';
import { FirebaseDb } from './FirebaseDb';
import { App } from './App';

$(document).ready(function () {

    // initialization
    FirebaseDb.init();
    VueJs.init();
    Event.init();
    App.init();
});
