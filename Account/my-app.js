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


function loginWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();

    const promise = firebase.auth().signInWithPopup(provider);

    promise.then(function (result) {
        var user = result.user;
        var first_name = user.displayName.split(" ")[0];
        var last_name = user.displayName.split(" ")[1];

        if (first_name === undefined) {
            first_name = "";
        }
        if (last_name === undefined) {
            last_name = "";
        }

        firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/Name").set({
            first: first_name,
            last: last_name
        }).then(function () {
            location.reload()
        });
    }).catch(e => {
        if (e.message.indexOf("Sign in using a provider associated with this email address") !== -1) {
            alert("Looks like you've already logged in here with another service. Please use it instead.");
        }
        else {
            console.log(e.message);
        }
    });
}

function loginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    const promise = firebase.auth().signInWithPopup(provider);

    promise.then(function (result) {
        var user = result.user;
        var first_name = user.displayName.split(" ")[0];
        var last_name = user.displayName.split(" ")[1];

        if (first_name === undefined) {
            first_name = "";
        }
        if (last_name === undefined) {
            last_name = "";
        }

        firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/Name").set({
            first: first_name,
            last: last_name
        }).then(function () {
            location.reload()
        });
    }).catch(e => {
        if (e.message.indexOf("Sign in using a provider associated with this email address") !== -1) {
            alert("Looks like you've already logged in here with another service. Please use it instead.");
        }
        else {
            console.log(e.message);
        }
    });
}

function loginWithTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();

    const promise = firebase.auth().signInWithPopup(provider);

    promise.then(function (result) {
        var user = result.user;
        var first_name = user.displayName.split(" ")[0];
        var last_name = user.displayName.split(" ")[1];

        if (first_name === undefined) {
            first_name = "";
        }
        if (last_name === undefined) {
            last_name = "";
        }

        firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/Name").set({
            first: first_name,
            last: last_name
        }).then(function () {
            location.reload()
        });
    }).catch(e => {
        if (e.message.indexOf("Sign in using a provider associated with this email address") !== -1) {
            alert("Looks like you've already logged in here with another service. Please use it instead.");
        }
        else {
            console.log(e.message);
        }
    });
}

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
                firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/Name").set({
                    first: first.value,
                    last: last.value
                }).then(function () {
                    location.reload()
                });
            });
        });
    }
}

function removeFromCart(item) {
    console.log("Removing " + item + " from cart");
    firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/cart/" + item).remove();
    window.location.reload()
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

            document.getElementById("contents").innerHTML = "<div class='ui segment' id='cart'></div>" + document.getElementById("contents").innerHTML;
            firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/cart").on('value', function (snapshot) {
                let tally = 0;
                document.getElementById("cart").innerHTML += "<div class='ui horizontal divider' id='cart_title'></div>";
                document.getElementById("cart_title").innerHTML += "<h1><i class='shopping cart icon'></i>Your Cart</h1>";
                snapshot.forEach(function (childSnapshot) {
                    document.getElementById("cart").innerHTML += "<p>";
                    document.getElementById("cart").innerHTML += "<h2><i class='red minus icon' onclick='removeFromCart(\"" + Object.keys(snapshot.val())[tally] + "\")'></i> " + Object.keys(snapshot.val())[tally] + "</h2>";
                    document.getElementById("cart").innerHTML += "<h3>From " + childSnapshot.val().restaurant + "</h3>";
                    document.getElementById("cart").innerHTML += "Quantity: " + childSnapshot.val().qty;
                    document.getElementById("cart").innerHTML += "<h4>$" + (parseFloat(childSnapshot.val().price) * parseInt(childSnapshot.val().qty)).toFixed(2) + "</h4>";
                    document.getElementById("cart").innerHTML += "($" + childSnapshot.val().price.toFixed(2) + " each)";
                    document.getElementById("cart").innerHTML += "</p>";
                    document.getElementById("cart").innerHTML += "<div class='ui horizontal divider'></div>";
                    tally ++;
                });
                if (tally === 0) {
                    document.getElementById("cart").innerHTML += "<h1>Your cart is empty.</h1>";
                }
            });


            firebase.database().ref("Users/" + firebase.auth().currentUser.providerData[0].email.replace(/\./g, "_dot_") + "/Name" + "/first").on('value', function (snapshot) {
                document.getElementById("status").innerHTML = "<div class='ui horizontal divider' id='status_title'></div>";
                document.getElementById("status_title").innerHTML += "<h1><i class='user icon'></i>Hi " + snapshot.val() + "!</h1>";
                document.getElementById("status").innerHTML += "Would you like to log out?";
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
