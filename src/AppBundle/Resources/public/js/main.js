import { VueJs } from './VueJs';
import { Database } from './Database';
import { App } from './App';

$(document).ready(function () {

    // initialization
    Database.init();
    VueJs.init();
    App.init();
});