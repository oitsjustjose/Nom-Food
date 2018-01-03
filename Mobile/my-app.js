var config = {
    apiKey: "AIzaSyCCmdTx1xIJz_uRqBzuI1KZWYYqpThJ33o",
    authDomain: "foodie-1420b.firebaseapp.com",
    databaseURL: "https://foodie-1420b.firebaseio.com",
    projectId: "foodie-1420b",
    storageBucket: "",
    messagingSenderId: "347004995162"
};

firebase.initializeApp(config);

function mouseOver(el) {
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            const width = el.offsetWidth;
            el.setAttribute("style", "width: " + width + "px;");
            el.innerHTML = "<center>Log out?</center>";
            el.setAttribute("onClick", "firebase.auth().signOut()");
        }
    });
}

function mouseOut(el) {
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            el.innerHTML = firebaseUser['email'];
        }
    });
}

function getActiveUser() {
    const auth = firebase.auth();

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            document.getElementById("user").innerHTML = firebaseUser['email'];
        }
        else {
            document.getElementById("user").innerHTML = "Log In";
        }
    });
}

function populateMealImages() {
    const database = firebase.database();

    $.getJSON(database.ref('Restaurants') + '.json', function (data) {
        var restaurants = [];

        $.each(data, function (key, val) {
            restaurants[key] = val;
        });

        for (var r in restaurants) {
            if (restaurants[r].menu !== undefined) {
                $.getJSON(database.ref('Restaurants/' + r + '/menu') + '.json', function (menuData) {
                    var menuItems = [];

                    $.each(menuData, function (key, val) {
                        menuItems[key] = val;
                    });

                    for (var m in menuItems) {
                        if (menuItems[m].img != null && menuItems[m].img !== undefined) {
                            document.getElementById("images").innerHTML += "<div class='five wide column' id='" + menuItems[m].img + "'></div>";
                            document.getElementById(menuItems[m].img).innerHTML += "<img class='ui large rounded image' src=\"" + menuItems[m].img + "\">"
                        }
                    }
                });
            }
        }
    });
}

function toggleSidebar() {
    $('.ui.sidebar').sidebar('toggle');
}

function alert(msg) {
    if (msg === undefined) {
        msg = "";
    }
    document.getElementsByTagName("body")[0].innerHTML += "<div class='ui alert modal' id='alert'></div>";
    document.getElementById("alert").innerHTML = "<div class='content'>" + msg.replace("\n", "<br>").replace(/'/g, "&#39") + "</div>";
    document.getElementById("alert").innerHTML += "<div id='buttons' class='ui center aligned segment'></div>";
    document.getElementById("buttons").innerHTML = "<button class='ui button' onclick='$(\".ui.alert.modal\").modal(\"hide\");'>Ok</button>";
    $('.ui.alert.modal').modal('show');
}

$(document)
    .ready(function () {
        $('.masthead')
            .visibility(
                {
                    once: false,
                    onBottomPassed: function () {
                        $('.fixed.menu').transition('fade in');
                    },
                    onBottomPassedReverse: function () {
                        $('.fixed.menu').transition('fade out');
                    }
                });
    });