import {VueJs} from './VueJs';
import {Dom} from './Dom';
import {FirebaseDb} from './FirebaseDb';
import {Event} from './Event';

$(document).ready(function () {
    VueJs.init();
    Dom.init();
    FirebaseDb.init();
    Event.init();
});
