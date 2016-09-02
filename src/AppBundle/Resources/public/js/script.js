$(document).ready(function(){
    initFirebase();
    initVueJs();
    initApp();
});

// Firebase
function initFirebase() {

    var config = {
        apiKey: "AIzaSyBL81xH1eFaPgh200qVoZyK4A5qYetJ6Ds",
        authDomain: "mardizza-bdfa5.firebaseapp.com",
        databaseURL: "https://mardizza-bdfa5.firebaseio.com",
        storageBucket: "mardizza-bdfa5.appspot.com",
    };
    firebase.initializeApp(config);
}

// VueJS
function initVueJs() {

    Vue.config.delimiters = ['${', '}'];

    new Vue({
        el: '#app',
        data: {
            pageTitle: "Mardizza !!!"
        }
    });
}

// App logic
function initApp() {

    // TODO
}