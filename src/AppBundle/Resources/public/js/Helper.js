import * as Const from "./constantes";
import {Dom} from "./Dom";

export class Helper {

    static getEnvVariable() {
        let url = window.location.href;
        let isDev = url.indexOf("mardizza.com") == -1;

        if (isDev) {
            return Const.ENV_DEV;
        } else {
            return Const.ENV_PROD;
        }
    }

    static isOwner(ownerUsername) {
        let currentUsername = Dom.getCurrentUsername();
        return currentUsername == ownerUsername;
    }

    // ajax call to check if user username is unique
    static checkUniqueUsername(username, callback) {
        $.ajax({
            url: `/check/username?username=${username}`
        }).done(function (response) {
            callback(response);
        });
    }
}