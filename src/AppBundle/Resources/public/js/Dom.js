export class Dom {

    static init() {
        // manage notifications
        Dom.cleanNotifications();

        // prepare animations
        Dom.animations();
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

    // hide modals
    static hideModal(){
        $(".modal").modal('hide');
    }

    // animation
    static animations() {
        $.fn.extend({
            animateCss: function (animationName) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                this.addClass(animationName).one(animationEnd, function () {
                    $(this).removeClass(animationName);
                });
            }
        });
    }
}
