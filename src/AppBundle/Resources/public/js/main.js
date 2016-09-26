import { Vuejs } from './Vuejs';
import { FirebaseDb } from './FirebaseDb';
import { Event } from './Event';
import { Dom } from './Dom';

$(document).ready(function () {
    
    // initialization
    Vuejs.init();
    FirebaseDb.init();
    Event.init();
    Dom.init();
});
