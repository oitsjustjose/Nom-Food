populateTable();

var firebase = firebase;
var document = document;

function populateTable() {
    var database = firebase.database();

    $.getJSON(database.ref('Restaurants') + '.json', function (data) {
        var items = [];

        $.each(data, function (key, val) {
            items[key] = val;
        });

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                var tally = 0;

                for (var i in items) {
                    if (items[i].owner_email === firebaseUser.email) {
                        document.getElementById("results").innerHTML += "<tr id=\"restaurant_" + tally + "\"</tr>";
                        document.getElementById("restaurant_" + tally).innerHTML += "<td>" + i + " <sup onclick='editRestaurantName(this)' style='cursor: pointer;'>Edit</sup></td>";
                        document.getElementById("restaurant_" + tally).innerHTML += "<td>" + items[i].address + ", " + items[i].area_code + " <sup onclick='editInfo(this)' style='cursor: pointer;'>Edit</sup></td>";
                        document.getElementById("restaurant_" + tally).innerHTML += "<td style='cursor: pointer;' onClick=\"editMenu(this)\">Edit Menu</td>";
                        tally++;
                    }
                }
            } else {
                document.getElementById("rest_header").innerHTML = "Please log in to manage your restaurants";
            }
        });
    });
}

function editMenu(el) {
    var restaurant_name = (el.parentElement.innerHTML);
    // Get the name of the restaurant from the innerHTML string; it's the first <td>
    restaurant_name = restaurant_name.substr(restaurant_name.indexOf('<td>') + 4, restaurant_name.indexOf('</td>') - 4);
    restaurant_name = restaurant_name.substr(0, restaurant_name.indexOf(' <sup'));

    $.getJSON(firebase.database().ref('Restaurants/' + restaurant_name + '/menu') + '.json', function (data) {

        var items = [];

        if (data !== null) {
            $.each(data, function (key, val) {
                items[key] = val;
            });
        }

        // Reset the menu content:
        document.getElementById("menu_content").innerHTML = "";
        document.getElementById("menu_header").innerHTML = "Menu Editor: " + restaurant_name;

        var tally = 0;

        for (var i in items) {
            var id = restaurant_name + ":" + tally;
            // Header Name field, with removeMenuItem button:
            document.getElementById("menu_content").innerHTML += "<div id=\"" + id + "\"></div>";
            document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
            document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'> <button class=\"ui button\" onClick='removeMenuItem(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
            // Description, ingredients and price:
            document.getElementById(id).innerHTML += "Description: <input type='text' value=\"" + items[i].desc + "\" style='width: inherit;'><br>";
            document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value=\"" + items[i].ingr + "\" style='width: inherit;'><br>";
            // Image attachment:
            document.getElementById(id).innerHTML += "<br>Image URL: <input type='text' value=\"" + items[i].img + "\" style='width: inherit;'> <a href='https://imgur.com/' id=\"" + id + "_image\" target='_blank'></a><br>";
            document.getElementById(id + "_image").innerHTML = "<sup>(Upload here)</sup>";

            document.getElementById(id).innerHTML += "<br>Price: <input type='text' value=\"" + items[i].price + "\"><br>";
            // Save button:
            document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveMenuChanges(this,\"" + id.replace(/'/g, "&#39") + "\")'>Save</button>";
            tally++;
        }
        // New item button:
        document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
        document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNewMenuItem(this," + items.length + ",\"" + restaurant_name.replace(/'/g, "&#39") + "\")'></i>";

        // Show the modal now that we've generated it.
        $('.ui.longer.modal').modal('show');
    });
}

function editRestaurantName(el) {
    var restaurant_name = (el.parentElement.innerHTML);
    restaurant_name = restaurant_name.substr(0, restaurant_name.indexOf(' <sup'));

    document.getElementById("menu_header").innerHTML = "Your Store";
    document.getElementById("menu_content").innerHTML = "Name: <input onchange='updateNameSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\",this)' value='" + restaurant_name.replace(/'/g, "&#39") + "'><br>";
    document.getElementById("menu_content").innerHTML += "<br> <button class=\"ui button\" onclick='deleteStore(\"" + restaurant_name.replace(/'/g, "&#39") + "\")'>Remove Store</button><br>";
    document.getElementById("menu_content").innerHTML += "<br> <button class=\"ui button\" id='save_name' >Save</button>";
    $('.ui.longer.modal').modal('show');
}

function deleteStore(restaurant_name) {
    if (confirm("Do you really want to remove this store?")) {
        firebase.database().ref('Restaurants/' + restaurant_name).remove();
        location.reload();
    }
}

function updateNameSaveButton(oldName, newNameEl) {
    var newName = newNameEl.value;

    document.getElementById("save_name").addEventListener('click', () => {
        renameRestaurant(oldName, newName);
    });
}

function renameRestaurant(oldName, newName) {
    firebase.database().ref('Restaurants/' + oldName).once('value').then(function (snapshot) {
        var data = snapshot.val();
        firebase.database().ref('Restaurants/' + newName).set(data);
    }).then(function () {
        firebase.database().ref('Restaurants/' + oldName).remove();
    }).then(function () {
        location.reload()
    });
}

function editInfo(el) {
    var restaurant_name = (el.parentElement.parentElement.innerHTML);
    restaurant_name = restaurant_name.substr(restaurant_name.indexOf('<td>') + 4, restaurant_name.indexOf('</td>') - 4);
    restaurant_name = restaurant_name.substr(0, restaurant_name.indexOf(' <sup'));

    document.getElementById("menu_header").innerHTML = "Edit Address";

    $.getJSON(firebase.database().ref('Restaurants/' + restaurant_name) + '.json', function (data) {
        document.getElementById("menu_content").innerHTML = "<div id='address_inputs'></div>";
        document.getElementById("address_inputs").innerHTML = "Street Address: <input onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")' value='" + data.address + "'><br>";
        document.getElementById("address_inputs").innerHTML += "<br>City: <input onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")' value='" + data.city + "'><br>";
        document.getElementById("address_inputs").innerHTML += "<br>Area Code: <input onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")' value='" + data.area_code + "'><br>";
        document.getElementById("address_inputs").innerHTML += "<br>Country: <input onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")' value='" + data.country + "'><br>";
        document.getElementById("address_inputs").innerHTML += "<br>Phone Number: <input onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")' value='" + data.phone_number + "'><br>";
        document.getElementById("address_inputs").innerHTML += "<br>Food Type:<br> <select class='ui fluid dropdown' id='food_type_selector' onchange='updateInfoSaveButton(\"" + restaurant_name.replace(/'/g, "&#39") + "\")'></select><br>";
        document.getElementById("address_inputs").innerHTML += "<br> <button class=\"ui button\" id='save_info' >Save</button>";

        populateFoodTypes(data.food_type);
    }).then(function () {
        $('.ui.longer.modal').modal('show');
    });
}

function populateFoodTypes(firstChoice) {
    var select = document.getElementById('food_type_selector');
    var firstChoiceFormatted = firstChoice.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    select.innerHTML += "<option value=" + firstChoice + ">" + firstChoiceFormatted + "</option>";
    select.innerHTML += "<option value='ainu'>Ainu</option>";
    select.innerHTML += "<option value='all-american'>All American</option>";
    select.innerHTML += "<option value='andhra'>Andhra</option>";
    select.innerHTML += "<option value='anglo-indian'>Anglo Indian</option>";
    select.innerHTML += "<option value='arab'>Arab</option>";
    select.innerHTML += "<option value='armenian'>Armenian</option>";
    select.innerHTML += "<option value='assyrian'>Assyrian</option>";
    select.innerHTML += "<option value='awadhi'>Awadhi</option>";
    select.innerHTML += "<option value='azerbaijani'>Azerbaijani</option>";
    select.innerHTML += "<option value='balochi'>Balochi</option>";
    select.innerHTML += "<option value='belarusian'>Belarusian</option>";
    select.innerHTML += "<option value='bengali'>Bengali</option>";
    select.innerHTML += "<option value='berber'>Berber</option>";
    select.innerHTML += "<option value='buddhist'>Buddhist</option>";
    select.innerHTML += "<option value='bulgarian'>Bulgarian</option>";
    select.innerHTML += "<option value='cajun'>Cajun</option>";
    select.innerHTML += "<option value='chechen'>Chechen</option>";
    select.innerHTML += "<option value='chinese'>Chinese</option>";
    select.innerHTML += "<option value='chinese-islamic'>Chinese Islamic</option>";
    select.innerHTML += "<option value='circassian'>Circassian</option>";
    select.innerHTML += "<option value='creole'>Creole</option>";
    select.innerHTML += "<option value='crimean-tatar'>Crimean Tatar</option>";
    select.innerHTML += "<option value='estonian'>Estonian</option>";
    select.innerHTML += "<option value='filipino'>Filipino</option>";
    select.innerHTML += "<option value='french'>French</option>";
    select.innerHTML += "<option value='fusion'>Fusion</option>";
    select.innerHTML += "<option value='georgian'>Georgian</option>";
    select.innerHTML += "<option value='goan'>Goan</option>";
    select.innerHTML += "<option value='goan catholic'>Goan Catholic</option>";
    select.innerHTML += "<option value='greek'>Greek</option>";
    select.innerHTML += "<option value='haute'>Haute</option>";
    select.innerHTML += "<option value='hyderabad'>Hyderabad</option>";
    select.innerHTML += "<option value='indian-chinese'>Indian Chinese</option>";
    select.innerHTML += "<option value='indian-singaporean'>Indian Singaporean</option>";
    select.innerHTML += "<option value='indian'>Indian</option>";
    select.innerHTML += "<option value='indonesian'>Indonesian</option>";
    select.innerHTML += "<option value='inuit'>Inuit</option>";
    select.innerHTML += "<option value='italian american'>Italian American</option>";
    select.innerHTML += "<option value='italian'>Italian</option>";
    select.innerHTML += "<option value='japanese'>Japanese</option>";
    select.innerHTML += "<option value='jewish'>Jewish</option>";
    select.innerHTML += "<option value='karnataka'>Karnataka</option>";
    select.innerHTML += "<option value='kazakh'>Kazakh</option>";
    select.innerHTML += "<option value='kurdish'>Kurdish</option>";
    select.innerHTML += "<option value='latvian'>Latvian</option>";
    select.innerHTML += "<option value='latin'>Latin</option>";
    select.innerHTML += "<option value='lithuanian'>Lithuanian</option>";
    select.innerHTML += "<option value='maharashtrian'>Maharashtrian</option>";
    select.innerHTML += "<option value='mangalorean'>Mangalorean</option>";
    select.innerHTML += "<option value='malay'>Malay</option>";
    select.innerHTML += "<option value='keralite'>Keralite</option>";
    select.innerHTML += "<option value='malaysian-indian'>Malaysian Indian</option>";
    select.innerHTML += "<option value='mexican'>Mexican</option>";
    select.innerHTML += "<option value='mordovian'>Mordovian</option>";
    select.innerHTML += "<option value='mughal'>Mughal</option>";
    select.innerHTML += "<option value='native-american'>Native American</option>";
    select.innerHTML += "<option value='note-by-note'>Note by Note</option>";
    select.innerHTML += "<option value='parsi'>Parsi</option>";
    select.innerHTML += "<option value='Pashtun'>Pashtun</option>";
    select.innerHTML += "<option value='Polish'>Polish</option>";
    select.innerHTML += "<option value='pennsylvania-dutch'>Pennsylvania Dutch</option>";
    select.innerHTML += "<option value='pakistani'>Pakistani</option>";
    select.innerHTML += "<option value='peranakan'>Peranakan</option>";
    select.innerHTML += "<option value='persian'>Persian</option>";
    select.innerHTML += "<option value='portuguese'>Portuguese</option>";
    select.innerHTML += "<option value='punjabi'>Punjabi</option>";
    select.innerHTML += "<option value='rajasthani'>Rajasthani</option>";
    select.innerHTML += "<option value='romanian'>Romanian</option>";
    select.innerHTML += "<option value='russian'>Russian</option>";
    select.innerHTML += "<option value='sami'>Sami</option>";
    select.innerHTML += "<option value='serbian'>Serbian</option>";
    select.innerHTML += "<option value='sindhi'>Sindhi</option>";
    select.innerHTML += "<option value='slovak'>Slovak</option>";
    select.innerHTML += "<option value='slovenian'>Slovenian</option>";
    select.innerHTML += "<option value='south-indian'>South Indian</option>";
    select.innerHTML += "<option value='sri-lankan'>Sri Lankan</option>";
    select.innerHTML += "<option value='tatar'>Tatar</option>";
    select.innerHTML += "<option value='thai'>Thai</option>";
    select.innerHTML += "<option value='turkish'>Turkish</option>";
    select.innerHTML += "<option value='tamil'>Tamil</option>";
    select.innerHTML += "<option value='udupi'>Udupi</option>";
    select.innerHTML += "<option value='ukranian'>Ukranian</option>";
    select.innerHTML += "<option value='vegan'>Vegan</option>";
    select.innerHTML += "<option value='vegetarian'>Vegetarian</option>";
    select.innerHTML += "<option value='yamal'>Yamal</option>";
    select.innerHTML += "<option value='zanzibari'>Zanzibari</option>";
}

function updateInfoSaveButton(restaurant_name) {
    var inputs = document.getElementById("address_inputs").getElementsByTagName("input");
    var dropdown = document.getElementById("address_inputs").getElementsByTagName("select")[0];

    document.getElementById("save_info").addEventListener('click', () => {
        if (inputs[0].value === "") {
            inputs[0].setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        if (inputs[1].value === "") {
            inputs[1].setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        if (inputs[2].value === "") {
            inputs[2].setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        if (inputs[3].value === "") {
            inputs[3].setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        if (!(inputs[4].value.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im))) {
            inputs[4].setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        if (dropdown.value === "") {
            dropdown.setAttribute("style", "outline:2px solid red; outline-offset: -2px");
            return;
        }
        geocodeAddress(restaurant_name, inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value, dropdown.value, updateInfo);
    });
}

function updateInfo(restaurant_name, address, city, area_code, country, phone_number, food_type, lat, lon) {
    const promise = firebase.database().ref('Restaurants/' + restaurant_name).update({
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
            location.reload();
        })
        .catch(e => alert(e.message));
}

function geocodeAddress(restaurant_name, address, city, area_code, country, phone_number, food_type, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address + " " + city + " " + area_code + " " + country}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            callback(restaurant_name, address, city, area_code, country, phone_number, food_type, lat, lon);
        }
        else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

function removeMenuItem(restaurant_name, item) {
    firebase.database().ref('Restaurants/' + restaurant_name + "/menu/" + item).remove();
    $('.ui.longer.modal').modal('hide');

    $.getJSON(firebase.database().ref('Restaurants/' + restaurant_name + '/menu') + '.json', function (data) {

        var items = [];

        if (data !== null) {
            $.each(data, function (key, val) {
                items[key] = val;
            });
        }

        // Reset the menu content:
        document.getElementById("menu_content").innerHTML = "";
        document.getElementById("menu_header").innerHTML = "Menu Editor: " + restaurant_name;

        var tally = 0;

        for (var i in items) {
            var id = restaurant_name + ":" + tally;
            // Header Name field, with removeMenuItem button:
            document.getElementById("menu_content").innerHTML += "<div id=\"" + id + "\"></div>";
            document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
            document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'> <button class=\"ui button\" onClick='removeMenuItem(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
            // Description, ingredients and price:
            document.getElementById(id).innerHTML += "Description: <input type='text' value=\"" + items[i].desc + "\" style='width: inherit;'><br>";
            document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value=\"" + items[i].ingr + "\" style='width: inherit;'><br>";
            // Image attachment:
            document.getElementById(id).innerHTML += "<br>Image URL: <input type='text' value=\"" + items[i].img + "\" style='width: inherit;'> <a href='https://imgur.com/' id=\"" + id + "_image\" target='_blank'></a><br>";
            document.getElementById(id + "_image").innerHTML = "<sup>(Upload here)</sup>";

            document.getElementById(id).innerHTML += "<br>Price: <input type='text' value=\"" + items[i].price + "\"><br>";
            // Save button:
            document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveMenuChanges(this,\"" + id.replace(/'/g, "&#39") + "\")'>Save</button>";
            tally++;
        }

        // New item button:
        document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
        document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNewMenuItem(this," + items.length + ",\"" + restaurant_name.replace(/'/g, "&#39") + "\")'></i>";

        $('.ui.longer.modal').modal('show');
    });
}

function addNewMenuItem(el, numItems, restaurant_name) {
    var id = restaurant_name + ":new";
    el.parentElement.innerHTML += "<div id=\"" + id + "\"></div>";
    document.getElementById(id).innerHTML += "<h4 id=\"header_new\"></h4>";
    document.getElementById("header_new").innerHTML = "Item Name: <input type='text'><br>";
    document.getElementById(id).innerHTML += "Description: <input type='text' style='width: inherit;'><br>";
    document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' style='width: inherit;'><br>";
    document.getElementById(id).innerHTML += "<br>Image URL: <input type='text' style='width: inherit;'> <a href='https://imgur.com/' id=\"" + id + "_image\" target='_blank'></a><br>";
    document.getElementById(id + "_image").innerHTML = "<sup>(Upload here)</sup>";
    document.getElementById(id).innerHTML += "<br>Price: <input type='text'><br>";
    document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveMenuChanges(this,\"" + id.replace(/'/g, "&#39") + "\")'>Save</button><br>";

    document.getElementById("new_entry").style.display = "none";

    $('.ui.longer.modal').modal('hide');
    $('.ui.longer.modal').modal('show');
}

function saveMenuChanges(el, master_id) {
    $('.ui.longer.modal').modal('hide');

    var inputs = document.getElementById(master_id).getElementsByTagName("input");
    var restaurant_name = master_id.substr(0, master_id.indexOf(":"));

    var item_name = inputs[0].value;
    var item_desc = inputs[1].value;
    var item_ingr = inputs[2].value;
    var item_img = inputs[3].value;
    var item_price = inputs[4].value;

    try {
        item_price = parseFloat(item_price);
    } catch (err) {
        alert("Price formatting is incorrect");
        return;
    }

    if (isNaN(item_price)) {
        alert("Price formatting is incorrect");
        return;
    }

    if (item_img.indexOf('.png') !== item_img.length - 5 && item_img.indexOf('.jpg') !== item_img.length - 4 && item_img.indexOf('.jpeg') !== item_img.length - 5) {
        alert("Please only attach images ending in .jpg, .jpeg or .png");
        return;
    }

    const promise = firebase.database().ref('Restaurants/' + restaurant_name + '/menu/' + item_name).set({
        'desc': item_desc,
        'ingr': item_ingr,
        'img': item_img,
        'price': item_price
    });

    promise.then(function () {
        // TODO: reload thet main list..?
        $.getJSON(firebase.database().ref('Restaurants/' + restaurant_name + '/menu') + '.json', function (data) {
            var items = [];

            if (data !== null) {
                $.each(data, function (key, val) {
                    items[key] = val;
                });
            }

            // Reset the menu content:
            document.getElementById("menu_content").innerHTML = "";
            document.getElementById("menu_header").innerHTML = "Menu Editor: " + restaurant_name;

            var tally = 0;

            for (var i in items) {
                var id = restaurant_name + ":" + tally;
                // Header Name field, with removeMenuItem button:
                document.getElementById("menu_content").innerHTML += "<div id=\"" + id + "\"></div>";
                document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
                document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'> <button class=\"ui button\" onClick='removeMenuItem(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
                // Description, ingredients and price:
                document.getElementById(id).innerHTML += "Description: <input type='text' value=\"" + items[i].desc + "\" style='width: inherit;'><br>";
                document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value=\"" + items[i].ingr + "\" style='width: inherit;'><br>";
                // Image attachment:
                document.getElementById(id).innerHTML += "<br>Image URL: <input type='text' value=\"" + items[i].img + "\" style='width: inherit;'> <a href='https://imgur.com/' id=\"" + id + "_image\" target='_blank'></a><br>";
                document.getElementById(id + "_image").innerHTML = "<sup>(Upload here)</sup>";

                document.getElementById(id).innerHTML += "<br>Price: <input type='text' value=\"" + items[i].price + "\"><br>";
                // Save button:
                document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveMenuChanges(this,\"" + id.replace(/'/g, "&#39") + "\")'>Save</button>";
                tally++;
            }

            // New item button:
            document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
            document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNewMenuItem(this," + items.length + ",\"" + restaurant_name.replace(/'/g, "&#39") + "\")'></i>";

            $('.ui.longer.modal').modal('show');
        });
    });
}
