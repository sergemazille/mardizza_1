import {Helper} from "./Helper";

export class Dom {

    static init() {
        // shorten too long text for pizza ingredients
        $(".pizza-card").each(function () {
            Dom.cropLongText(this);
        });

        // show a message if the order basket is empty
        Dom.showOrHideEmptyBasketMessage();

        // manage notifications
        Dom.cleanNotifications();
    }

    static getCredentials(loginOrCreate) {

        let $email;
        let $username;
        let $password;

        if (loginOrCreate === 'login') {
            $email = $("#login-email").val();
            $password = $("#login-password").val();

        } else {
            $email = $("#create-email").val();
            $username = $("#create-username").val();
            $password = $("#create-password").val();
        }

        return {
            'email': $email,
            'username': $username,
            'password': $password,
        }
    }

    static cropLongText(pizzaCard) {
        let $pizzaIngredients = $(pizzaCard).find(".pizza-card-ingredients");

        var isTruncated = $pizzaIngredients.triggerHandler("isTruncated");
        if (!isTruncated) {
            $pizzaIngredients.dotdotdot({
                ellipsis: '...'
            });
        }
    }

    static showOrHideEmptyBasketMessage() {
        if ($("tr").length < 1 && $(window).width() > 768) {

            let messages = [
            ];

            // doesn't display funny messages on small devices
            let randomMessage = messages[Math.floor(Math.random() * messages.length)];
            $("#basket-message").show();
            $("#basket-message").text(randomMessage);

        } else {
            $("#basket-message").hide();
        }
    }

    // show or hide 'total' row if table is not empty
    static showOrHideBasketFooter() {

        let $table = $("#pizza-list");

        if ($table.find('tr').length >= 1) {
            // calculate total
            let total = Helper.calculateBasketTotal();

            // format total price
            total = Helper.formatPrice(total);

            // insert total on DOM element
            $("#price-total").text(total);

            // show total element
            $("#basket-total").removeClass('hidden');

            // show phone number
            $("#phone-number").removeClass('hidden');

        } else {
            $("#basket-total").addClass('hidden');
            $("#phone-number").addClass('hidden');
        }
    }

    static createNotification(msgBody, msgClass) {
        let domElement = `<div class="hidden alert ${msgClass}">${msgBody}</div>`;
        $(".messages").append(domElement);
        Dom.cleanNotifications();
    }

    static cleanNotifications() {
        let $messages = $(".messages").children();

        if ($messages.length > 0) {
            $messages.each(function () {
                let that = $(this);

                // first fadein and animate
                that.removeClass('hidden');
                that.hide().fadeIn(700);
                that.addClass('animated');

                // and then fadeOut after some time
                setTimeout(function () {
                    that.fadeOut(500, function () {
                        that.remove();
                    });
                }, 3000);
            });
        }
    }

    static cameraEffect($pizzaCard) {
        $pizzaCard.fadeOut(100, function () {
            $(this).show();
        });
    }

    // load clipboard lib behaviour
    static loadClipboard(){
        let snapshotLinks = document.querySelectorAll('.pizza-clipboard');
        let clipboard = new Clipboard(snapshotLinks);
        clipboard.on('success', function () {
            Dom.createNotification("Pizza copiée dans le presse-papier.", "alert-success");
        });
        clipboard.on('error', function () {
            Dom.createNotification("Erreur lors de la copie dans le presse papier.", "alert-danger");
        });
    }
}
