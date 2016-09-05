export class Dom {

    static getCredentials(){
        let $email = $("#email").val();
        let $username = $("#username").val();
        let $password = $("#password").val();

        return {
            'email': $email,
            'username': $username,
            'password': $password
        }
    }
}
