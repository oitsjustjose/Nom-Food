function geocodeAddress(address, owner_email, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            callback(owner_email, lat, lon);
        }
        else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

function uploadToFirebase(owner_email, lat, lon) {
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const restaurant_name = document.getElementById("restaurant_name").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const area_code = document.getElementById("area_code").value;
    const phone_number = document.getElementById("phone_number").value;
    const country = document.getElementById("country").value;
    const food_type = document.getElementById("food_type").value;
    var database = firebase.database();
    const promise = database.ref('Restaurants/' + restaurant_name).set({
        'owner_first': first_name,
        'owner_last': last_name,
        'owner_email': owner_email,
        'address': address,
        'city': city,
        'area_code': area_code,
        'phone_number': phone_number,
        'country': country,
        'food_type': food_type,
        'lat': lat,
        'lon': lon
    });

    promise
        .then(function () {
            alert("We've added your restaurant, thanks!!");
            window.location = ".";
        })
        .catch(e => alert(e.message));
}

const submit = document.getElementById("submit");

submit.addEventListener('click', e => {
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const restaurant_name = document.getElementById("restaurant_name").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const area_code = document.getElementById("area_code").value;
    const phone_number = document.getElementById("phone_number").value;
    const country = document.getElementById("country").value;
    const food_type = document.getElementById("food_type").value;
    var good = true;

    if (first_name === "") {
        document.getElementById("first_name").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("first_name").removeAttribute("style");
    }
    if (last_name === "") {
        document.getElementById("last_name").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("last_name").removeAttribute("style");
    }
    if (restaurant_name === "") {
        document.getElementById("restaurant_name").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("restaurant_name").removeAttribute("style");
    }
    if (address === "") {
        document.getElementById("address").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("address").removeAttribute("style");
    }
    if (city === "") {
        document.getElementById("city").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("city").removeAttribute("style");
    }
    if (area_code === "") {
        document.getElementById("area_code").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("area_code").removeAttribute("style");
    }
    if (phone_number === "" || !(phone_number.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im))) {
        document.getElementById("phone_number").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("phone_number").removeAttribute("style");
    }
    if (country === "") {
        document.getElementById("country").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("country").removeAttribute("style");
    }
    if (food_type === "") {
        document.getElementById("food_type").setAttribute("style", "outline:2px solid red; outline-offset: -2px");
        good = false;
    }
    else {
        document.getElementById("food_type").removeAttribute("style");
    }

    if (good) {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                geocodeAddress(address + " " + area_code + " " + country, firebaseUser['email'], uploadToFirebase);
            }
            else {
                alert("Please sign in before submitting...");
            }
        });
    }
});