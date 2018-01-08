getGeolocation();

function showMenu(el)
{
    var database = firebase.database();

    $.getJSON(database.ref('Restaurants/' + el.innerHTML + '/menu') + '.json', function (data)
    {
        var items = [];

        $.each(data, function (key, val)
        {
            items[key] = val;
        });

        // Reset the menu content:
        document.getElementById("menu_content").innerHTML = "";
        document.getElementById("menu_header").innerHTML = el.innerHTML;

        for (var i in items)
        {
            document.getElementById("menu_content").innerHTML += "<h4 id='" + i.replace(" ", "_").toLowerCase() + "'></h4><br>";
            document.getElementById(i.replace(" ", "_").toLowerCase()).innerHTML = i + " <i class='ui large shop icon' style='cursor: pointer;' onclick='addToCart(this,\"" + el.innerHTML.replace(/'/g, "&#39") + "\",\"" + i.replace(/'/g, "&#39") + "\"," + items[i].price + "," + 1 + ")'>";
            document.getElementById("menu_content").innerHTML += "Description: " + items[i].desc + "<br>";
            document.getElementById("menu_content").innerHTML += "Ingredients: " + items[i].ingr + "<br><br>";
            if (items[i].img !== undefined && items[i].img !== null)
            {
                document.getElementById("menu_content").innerHTML += "<div class='ui segment' id='" + i.replace(" ", "_").toLowerCase() + "_img" + "'></div>"
                document.getElementById(i.replace(" ", "_").toLowerCase() + "_img").innerHTML += "<img src=\"" + items[i].img + "\" class='ui image'><br>";
            }
            document.getElementById("menu_content").innerHTML += "Price: " + items[i].price;
        }

        // Show, hide then re-show the modal QUICKLY to fix alignment
        var menu = $('.ui.longer.modal');
        menu.modal('show');
        var timer = setInterval(function ()
        {
            menu.modal('hide');
            menu.modal('show');
            clearInterval(timer);
        }, 10);
    });
}

function addToCart(el, restaurant, item, price, qty)
{
    // Set the shopping icon to a checkmark, with a onClick to set it back to a cart with an onClick to add to cart again...
    el.setAttribute("class", "ui large checkmark icon");

    firebase.database().ref('Restaurants/' + restaurant.replace("&#39", "'")).on('value', function (snapshot)
    {
        firebase.database().ref('Users/' + firebase.auth().currentUser.providerData[0].email.replace(".", "_dot_") + '/cart/' + item).set({
            price: price,
            restaurant: restaurant.replace("&#39", "'"),
            restaurant_owner: snapshot.val().owner_email,
            qty: qty
        });
    });

    var newQty = qty + 1;
    el.setAttribute("onclick", "function foo (el) { el.setAttribute('class', 'ui large shop icon'); el.setAttribute('onclick', 'addToCart(this,\"" + restaurant.replace(/'/g, "&#39") + "\",\"" + item + "\"," + price + "," + newQty + ")'); } foo(this);");
}

function longfunctionfirst(callback)
{
    setTimeout(function ()
    {
        // Do stuff here...?
        if (typeof callback === 'function')
        {
            callback();
        }
    }, 3);
}

function getGeolocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(getNearbyLocations);
    }
    else
    {
        alert("Geolocation is not supported by this browser...");
    }
}

function getNearbyLocations(position)
{
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var database = firebase.database();

    $.getJSON(database.ref('Restaurants') + '.json', function (data)
    {
        var items = [];

        $.each(data, function (key, val)
        {
            items[key] = val;
        });

        var tally = 0;

        for (var i in items)
        {
            var radlat1 = Math.PI * lat / 180;
            var radlat2 = Math.PI * items[i].lat / 180;
            var theta = lon - items[i].lon;
            var radtheta = Math.PI * theta / 180;
            var distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            distance = Math.acos(distance);
            distance = distance * 180 / Math.PI;
            distance = distance * 60 * 1.1515;

            if (!isNaN(distance) && distance <= 25)
            {
                document.getElementById("results").innerHTML += "<tr style='cursor: pointer' id=\"restaurant_" + tally + "\"></tr>";
                document.getElementById("restaurant_" + tally).innerHTML += "<td onClick='showMenu(this)' class='restaurant_result'>" + i + "</td>";
                document.getElementById("restaurant_" + tally).innerHTML += "<td>" + items[i].food_type + "</td>";
                document.getElementById("restaurant_" + tally).innerHTML += "<td>" + Math.round(distance) + " mi" + "</td>";
                tally++;
            }
        }
    });
}