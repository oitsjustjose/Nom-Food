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

function register() {
    var first = document.getElementById("new_first");
    var last = document.getElementById("new_last");
    var email = document.getElementById("new_email");
    var pass = document.getElementById("new_pass");
    var pass_conf = document.getElementById("new_pass_conf");
    var good = true;

    if (first.value === "") {
        first.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        first.removeAttribute("style")
    }
    if (last.value === "") {
        last.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        last.removeAttribute("style")
    }
    if (email.value === "") {
        email.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        email.removeAttribute("style")
    }
    if (pass.value.length < 6) {
        pass.value = "";
        pass.setAttribute("placeholder", "Password must be at least 6 chars");
        pass.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    if (pass_conf.value.length < 6) {
        pass_conf.value = "";
        pass_conf.setAttribute("placeholder", "Password must be at least 6 chars");
        pass_conf.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }

    if (pass.value === pass_conf.value && pass.value.length >= 6 && pass_conf.value.length >= 6) {
        pass.removeAttribute("style");
        pass_conf.removeAttribute("style");
    }
    else {
        pass.value = "";
        pass_conf.value = "";
        pass.setAttribute("placeholder", "Passwords do not match");
        pass_conf.setAttribute("placeholder", "Passwords do not match");
        pass.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        pass_conf.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }

    if (good) {
        const promise = firebase.auth().createUserWithEmailAndPassword(email.value, pass.value);

        promise.then(function () {
            firebase.auth().onAuthStateChanged(firebaseUser => {
                firebase.database().ref("Users/" + firebaseUser.uid).set({
                    first: first.value,
                    last: last.value
                }).then(function () {
                    location.reload()
                });
            });
        });
    }
}

(function () {
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            document.getElementById("signup_field").remove();
            document.getElementById("email_field").remove();
            document.getElementById("pass_field").remove();
            document.getElementById("login").remove();
            document.getElementById("fblogin").remove();
            document.getElementById("googlelogin").remove();
            document.getElementById("twitterlogin").remove();

            firebase.database().ref("Users/" + firebaseUser.uid + "/first").on('value', function (snapshot) {
                document.getElementById("status").innerHTML = "Welcome " + snapshot.val() + ", would you like to log out?";
            });
        }
        else {
            document.getElementById("logout").remove();
        }
    });
}());

(function () {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");

    login.addEventListener('click', e => {
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email.value, password.value);

        promise
            .then(function () {
                window.user = {};
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
        location.reload();
    });
}());