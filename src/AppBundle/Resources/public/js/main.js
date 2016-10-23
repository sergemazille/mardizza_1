import { orderVue } from './orderVue';
import { groupsVue } from './groupsVue';
import { groupConfigVue } from './groupConfigVue';
import { Event } from './Event';
import { Dom } from './Dom';
import { FirebaseDb } from './FirebaseDb';

$(document).ready(function () {

    // initializations //

    // current order database reference
    FirebaseDb.init();

    // test if we're on the groups page to initialize the right vue js file
    if($("#groups").length >= 1){
        groupsVue.init();
    }

    // test if we're on the group config page to initialize the right vue js file
    if($("#group-config").length >= 1){
        groupConfigVue.init();
    }

    // test if we're on the app page to initialize the right vue js file
    if($("#app").length >= 1){
        orderVue.init();
    }

    Event.init();
    Dom.init();
});
