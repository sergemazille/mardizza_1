import {Helper} from "./Helper";

export class Dom {

    static init() {
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
        let snapshotLinks = document.querySelectorAll('.take-snapshot');
        let clipboard = new Clipboard(snapshotLinks);

        clipboard.on('success', function () {
            Dom.createNotification("Pizza copiée dans le presse-papier.", "alert-success");
        });
        clipboard.on('error', function () {
            Dom.createNotification("Erreur lors de la copie dans le presse papier.", "alert-danger");
        });
    }
}
