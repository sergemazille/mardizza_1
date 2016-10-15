export const ENV_DEV = 'dev';
export const ENV_PROD = 'prod';
export const ALERT_ERROR = 'alert-danger';
export const ALERT_SUCCESS = 'alert-success';

export const messages = {
    ONE_ADMIN: 'Il doit rester au moins un administrateur.',
    IMAGE_FORMAT: 'L\'image doit être au format jpg, png ou gif.',
    IMAGE_SIZE: 'L\'image ne doit pas faire plus de 1 Mo.',
    GROUP_UPDATED: 'Le groupe a bien été mis à jour.',
    GROUP_QUITTED: 'Vous avez bien quitté le groupe.',
    GROUP_DELETED: 'Le groupe a bien été supprimé.',
    GROUP_CREATED: 'Votre nouveau groupe a bien été créé.',
    ERROR_MESSAGE: "Une erreur est survenue.",
};

export const firebaseConfigs = {
    "prod": {
        apiKey: "AIzaSyBL81xH1eFaPgh200qVoZyK4A5qYetJ6Ds",
        authDomain: "mardizza-bdfa5.firebaseapp.com",
        databaseURL: "https://mardizza-bdfa5.firebaseio.com",
        storageBucket: "mardizza-bdfa5.appspot.com"
    },

    "dev": {
        apiKey: "AIzaSyDB-HQDIYeVyUtqYfDe3T9IeTPH4dC1q1w",
        authDomain: "mardizza-dev.firebaseapp.com",
        databaseURL: "https://mardizza-dev.firebaseio.com",
        storageBucket: "mardizza-dev.appspot.com",
    }
};