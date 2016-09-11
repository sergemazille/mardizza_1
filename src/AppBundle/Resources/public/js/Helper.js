import * as Const from "./constantes";
import {Dom} from "./Dom";

export class Helper {

    static formatPrice(price) {

        // 2 decimals
        price = parseFloat(Math.round(price * 100) / 100).toFixed(2);

        // change '.' to ','
        price = price.replace(/\./g, ',');

        // add euro sign
        price = `${price} €`;

        return price;
    }

    static calculateBasketTotal() {
        let $individualPrices = $("td.pizza-price").map(function (i, el) {
            return $(el).data("price");
        });

        let total = 0;
        $individualPrices.each(function (i, val) {
            total += val;
        });

        return total;
    }

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
}
