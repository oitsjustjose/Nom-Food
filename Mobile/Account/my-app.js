(function()
{
	var config = {
		apiKey: "AIzaSyCCmdTx1xIJz_uRqBzuI1KZWYYqpThJ33o",
		authDomain: "foodie-1420b.firebaseapp.com",
		databaseURL: "https://foodie-1420b.firebaseio.com",
		projectId: "foodie-1420b",
		storageBucket: "",
		messagingSenderId: "347004995162"
	};
	
	firebase.initializeApp(config);
	
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
			.then(function() {window.location = "..";})
			.catch(e => alert(e.message));
		
	});
	
	firebase.auth().onAuthStateChanged(firebaseUser => {
//		if (firebaseUser)
//		{
//			email.setAttribute("hidden", "true");
//			password.setAttribute("hidden", "true");
//			login.setAttribute("hidden", "true");
//			logout.setAttribute("hidden", "false");
//			signup.setAttribute("hidden", "true");
//			alert("logged in");
//		}
//		else
//		{
//			email.setAttribute("hidden", "false");
//			password.setAttribute("hidden", "false");
//			login.setAttribute("hidden", "false");
//			logout.setAttribute("hidden", "true");
//			signup.setAttribute("hidden", "false");
//			location.reload;
//			alert("not logged in");
//		}
	});
}());