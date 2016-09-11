import { VueJs } from './VueJs';
import { FirebaseDb } from './FirebaseDb';
import { Event } from './Event';
import { Dom } from './Dom';

$(document).ready(function () {
    
    // initialization
    FirebaseDb.init();
    VueJs.init();
    Event.init();
    Dom.init();
});
