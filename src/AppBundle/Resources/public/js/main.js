import { VueJs } from './VueJs';
import { FirebaseDb } from './FirebaseDb';
import { Event } from './Event';
import { Dom } from './Dom';
import * as Const from "./constantes";

$(document).ready(function () {

    // Switch between ENV_DEV and ENV_PROD for appropriate database access
    let env = Const.ENV_DEV;
    // let env = Constante.ENV_PROD;

    console.log(Const.ENV_DEV);

    // initialization
    FirebaseDb.init(env);
    VueJs.init();
    Event.init();
    Dom.init();
});
