//Firebase access
var config = {
  apiKey: "AIzaSyCtOwQCFKMF5f-vqzehJqXDv-YdmmJ5cpQ",
  authDomain: "firstda-1c74e.firebaseapp.com",
  databaseURL: "https://firstda-1c74e.firebaseio.com",
  projectId: "firstda-1c74e",
  storageBucket: "firstda-1c74e.appspot.com",
  messagingSenderId: "374453102303"
};

firebase.initializeApp(config);

//Global variables
var database = firebase.database();
var playerNumber = 0;
var playerName = "";
var rps = ["Rock", "Paper", "Scissors"];

if (playerNumber === 0) {
  $("#turn").append("<div class='form-group'>" +
    "<input type='text' class='form-control' id='nameEntry' placeholder='Your name here'>" +
    "<button type='button' id='add-user' class='btn btn-primary'>OK</button>" +
    "</div>");
  $("#greeting").append("<p>Enter your name to start the game</p>");
}
   
$("#add-user").on("click", function(event) {
  name = $("#nameEntry").val().trim();
  database.ref().push({
    players{
      //playerNumber: 
      nameEntr: name
    }
  });
  if (playerNumber === 0) {
    playerNumber = 1;
  }
  else if (playerNumber === 1) {
    playerNumber = 2;
  }
  console.log(name);
  console.log(playerNumber);
  console.log(database.ref().push({
    name: nameEntry
  }));
});
