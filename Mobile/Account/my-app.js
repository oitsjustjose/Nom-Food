$(document).ready(function () {
    $('.ui.form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter your e-mail'
                    },
                    {
                        type: 'email',
                        prompt: 'Please enter a valid e-mail'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter your password'
                    },
                    {
                        type: 'length[6]',
                        prompt: 'Your password must be at least 6 characters'
                    },
                    {
                        type: 'error',
                        prompt: 'The password does not exist in the system, or it is not valid.'
                    }
                ]
            }
        }
    });
});

(function () {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");
    const signup = document.getElementById("signup");

    login.addEventListener('click', e => {
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email.value, password.value);

        promise
            .then(function () {
                window.user = {
                };
                location.assign("..");
            })
            .catch(e => {
                window.user = {
                    error: true,
                    message: e.message
                };
            });
    });

    logout.addEventListener('click', () => {
        firebase.auth().signOut();
        window.location = ".";
    });

    signup.addEventListener('click', () => {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email.value, password.value);

        promise
            .then(function () {
                window.user = {
                };
                window.location = "..";
            })
            .catch(e => {
                window.user = {
                    error: true,
                    message: e.message
                };
            });
    });
}());