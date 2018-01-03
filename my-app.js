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
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            if (document.getElementById("user_1") != null) {
                document.getElementById("user_1").innerHTML = firebaseUser['email'];
            }
            if (document.getElementById("user_2") != null) {
                document.getElementById("user_2").innerHTML = firebaseUser['email'];
            }
            if (document.getElementById("user") != null) {
                document.getElementById("user").innerHTML = firebaseUser['email'];
            }
        }
        else {
            if (document.getElementById("user_1") != null) {
                document.getElementById("user_1").innerHTML = "Log In";
            }
            if (document.getElementById("user_2") != null) {
                document.getElementById("user_2").innerHTML = "Log In";
            }
            if (document.getElementById("user") != null) {
                document.getElementById("user").innerHTML = "Log In";
            }
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

function alert(msg) {
    if (msg === undefined) {
        msg = "";
    }
    document.getElementsByTagName("body")[0].innerHTML += "<div class='ui alert modal' id='semantic-alert'></div>";
    document.getElementById("semantic-alert").innerHTML = "<div class='content'>" + msg.replace("\n", "<br>").replace(/'/g, "&#39") + "</div>";
    document.getElementById("semantic-alert").innerHTML += "<div id='semantic-alert-buttons' class='ui center aligned segment'></div>";
    document.getElementById("semantic-alert-buttons").innerHTML = "<button class='ui button' onclick='$(\".ui.alert.modal\").modal(\"hide\");'>Ok</button>";
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

        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item');
    });

(function (a, b) {
    if (navigator.userAgent.match(/iPad/i) == null && /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) window.location = b
})(navigator.userAgent || navigator.vendor || window.opera, window.location.href.replace("Nom-Food", "Nom-Food/Mobile"));