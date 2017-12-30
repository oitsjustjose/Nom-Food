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
						document.getElementById("restaurant_" + tally).innerHTML += "<td>" + i + "</td>";
						document.getElementById("restaurant_" + tally).innerHTML += "<td>" + items[i].address + ", " + items[i].area_code + "</td>";
						document.getElementById("restaurant_" + tally).innerHTML += "<td class='restaurant_result' onClick=\"editMenu(this)\">Edit</td>";
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
			// Header Name field, with remove button:
			document.getElementById("menu_content").innerHTML += "<div id='" + id + "'></div>";
			document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
			document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'></input> <button class=\"ui button\" onClick='remove(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
			// Description, ingredients and price:
			document.getElementById(id).innerHTML += "Description: <input type='text' value=\"" + items[i].desc + "\" style='width: inherit;'></input><br>";
			document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value=\"" + items[i].ingr + "\" style='width: inherit;'></input><br>";
			document.getElementById(id).innerHTML += "<br>Price: <input type='number' value=\"" + items[i].price + "\"></input><br>";
			// Save button:
			document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveChanges(this,\"" + id + "\")'>Save</button>";
			tally++;
		}
		// New item button:
		document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
		document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNew(this," + items.length + ",\"" + restaurant_name + "\")'></i>";

		// Show the modal now that we've generated it.
		$('.ui.modal.menu').modal('show');
	});
}

function remove(restaurant_name, item) {
	firebase.database().ref('Restaurants/' + restaurant_name + "/menu/" + item).remove();
	$('.ui.modal.menu').modal('hide');

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
			document.getElementById("menu_content").innerHTML += "<div id='" + id + "'></div>";
			document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
			document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'></input> <button class=\"ui button\" onClick='remove(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
			document.getElementById(id).innerHTML += "Description: <input type='text' value='" + items[i].desc + "' style='width: inherit;'></input><br>";
			document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value='" + items[i].ingr + "' style='width: inherit;'></input><br>";
			document.getElementById(id).innerHTML += "<br>Price: <input type='number' value='" + items[i].price + "'></input><br>";
			document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveChanges(this,\"" + id + "\")'>Save</button>";
			tally++;
		}

		// New item button:
		document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
		document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNew(this," + items.length + ",\"" + restaurant_name + "\")'></i>";

		$('.ui.modal.menu').modal('show');
	});
}

function addNew(el, numItems, restaurant_name) {
	var id = restaurant_name + ":new";
	el.parentElement.innerHTML += "<div id='" + id + "'></div>";
	document.getElementById(id).innerHTML += "<h4 id='header_new" + "'></h4>";
	document.getElementById("header_new").innerHTML = "Item Name: <input type='text'></input><br>";
	document.getElementById(id).innerHTML += "Description: <input type='text' style='width: inherit;'></input><br>";
	document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' style='width: inherit;'></input><br>";
	document.getElementById(id).innerHTML += "<br>Price: <input type='number'></input><br>";
	document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveChanges(this,\"" + id + "\")'>Save</button>";

	document.getElementById("new_entry").style.display = "none";

	$('.ui.modal.menu').modal('hide');
	$('.ui.modal.menu').modal('show');
}

function saveChanges(el, master_id) {
	$('.ui.modal.menu').modal('hide');
	
	var inputs = document.getElementById(master_id).getElementsByTagName("input");
	var restaurant_name = master_id.substr(0, master_id.indexOf(":"));
		
	var item_name = inputs[0].value;
	var item_desc = inputs[1].value;
	var item_ingr = inputs[2].value;
	var item_price = inputs[3].value;
	
	try {
		item_price = parseInt(item_price);
	} catch (err) {
		alert("Price formatting is incorrect");
		return;
	}
	
	const promise = firebase.database().ref('Restaurants/' + restaurant_name + '/menu/' + item_name).set({
		'desc': item_desc,
		'ingr': item_ingr,
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
				document.getElementById("menu_content").innerHTML += "<div id='" + id + "'></div>";
				document.getElementById(id).innerHTML += "<h4 id='" + i + "'></h4>";
				document.getElementById(i).innerHTML = "Item Name: <input type='text' value='" + i + "'></input> <button class=\"ui button\" onClick='remove(\"" + restaurant_name + "\",\"" + i + "\")'>Remove</button><br>";
				document.getElementById(id).innerHTML += "Description: <input type='text' value='" + items[i].desc + "' style='width: inherit;'></input><br>";
				document.getElementById(id).innerHTML += "<br>Ingredients: <input type='text' value='" + items[i].ingr + "' style='width: inherit;'></input><br>";
				document.getElementById(id).innerHTML += "<br>Price: <input type='number' value='" + items[i].price + "'></input><br>";
				document.getElementById(id).innerHTML += "<br><button class=\"ui button\" onClick='saveChanges(this,\"" + restaurant_name + "\")'>Save</button>";
				tally++;
			}

			// New item button:
			document.getElementById("menu_content").innerHTML += "<div id='plus_button' class=\"ui right\"></div>";
			document.getElementById("plus_button").innerHTML += "<i style='cursor: pointer; margin-left: 98%;' class=\"plus icon\" id='new_entry' class=\"ui button\" onClick='addNew(this," + items.length + ",\"" + restaurant_name + "\")'></i>";

			$('.ui.modal.menu').modal('show');
		});
	});
}
