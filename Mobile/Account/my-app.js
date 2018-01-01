(function () {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");
    const signup = document.getElementById("signup");

    login.addEventListener('click', e => {
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email.value, password.value);

        promise.catch(e => alert(e.message));
    });

    logout.addEventListener('click', e => {
        firebase.auth().signOut();
        window.location = ".";
    });

    signup.addEventListener('click', e => {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email.value, password.value);

        promise
            .then(function () {
                window.location = "..";
            })
            .catch(e => alert(e.message));

    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
    });
}());