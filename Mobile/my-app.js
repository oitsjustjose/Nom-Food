function mouseOver(el)
{
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser)
    {
      const width = el.offsetWidth;
      el.setAttribute("style", "width: " + width + "px;");
      el.innerHTML = "<center>Log out?</center>";
      el.setAttribute("onClick", "firebase.auth().signOut()");
    }
  });
}

function mouseOut(el)
{
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser)
    {
      el.innerHTML = firebaseUser['email'];
    }
  });
}

function getActiveUser()
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
  
  const auth = firebase.auth();
  
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser)
    {
      document.getElementById("user").innerHTML = firebaseUser['email'];
    }
    else
    {
      document.getElementById("user").innerHTML = "Log In";
    }
  });
}

function toggleSidebar()
{
	$('.ui.sidebar').sidebar('toggle');
}

$(document)
  .ready(function()
  {
    $('.masthead')
      .visibility(
      {
        once: false,
        onBottomPassed: function()
        {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function()
        {
          $('.fixed.menu').transition('fade out');
        }
      });
});