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
}
