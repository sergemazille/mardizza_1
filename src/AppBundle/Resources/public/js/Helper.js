import * as Const from "./constantes";
import {Dom} from "./Dom";

export class Helper {

    static formatPrice(price) {

        // 2 decimals
        price = parseFloat(Math.round(price * 100) / 100).toFixed(2);

        // change '.' to ','
        price = price.replace(/\./g, ',');

        // add euro sign
        price = price + String.fromCharCode(160) + "€";

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

    // ajax call to check if user username is unique
    static checkUniqueUsername(username, callback) {

        $.ajax({
            url: `/check/username?username=${username}`
        })
            .done(function (response) {
                callback(response);
            });
    }

    // ajax call to add favorite pizza
    static addPizzaToFavorites(pizzaId) {
        $.ajax({
            url: "/user/add/pizza/" + pizzaId
        });
    }

    // ajax call to remove favorite pizza
    static removePizzaFromFavorites(pizzaId) {
        $.ajax({
            url: "/user/remove/pizza/" + pizzaId
        });
    }

    static switchFavoritesClassesBehaviour(link) {

        // find pizza id
        let $link = $(link);
        let pizzaId = $link.closest(".pizza-card").data("pizzaid");
        let pizzaCards = $(document).find("[data-pizzaid='" + pizzaId + "']");

        // switch the favorite classes of each pizza with this id
        pizzaCards.each(function(i, pizza){

            $(pizza).toggleClass("pizza-favorite");

            let $link = $(pizza).find('.fav');
            let $linkIcon = $link.find('.glyphicon');
            Helper.switchFavoritesClasses($link, $linkIcon);
        });
    }

    static switchFavoritesClasses($link, $linkIcon) {
        if ($link.hasClass("add-favorite")) {
            $link
                .removeClass("add-favorite")
                .addClass("remove-favorite");

            $linkIcon
                .removeClass("glyphicon-heart-empty")
                .addClass("glyphicon-heart");
        } else {
            $link
                .removeClass("remove-favorite")
                .addClass("add-favorite");

            $linkIcon
                .removeClass("glyphicon-heart")
                .addClass("glyphicon-heart-empty");
        }
    }
}