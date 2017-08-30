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
var chats = 0;
var rps = ["Rock", "Paper", "Scissors"];

var addRPS = function(playerToAdd) {
  $(playerToAdd).append("<p class='rps' id='" + playerToAdd + "Rock'>Rock</p>");
  $(playerToAdd).append("<p class='rps' id='" + playerToAdd + "Paper'>Paper</p>");
  $(playerToAdd).append("<p class='rps' id='" + playerToAdd + "Scissors'>Scissors</p>");
  database.ref('players/' + playerNumber + '/').on("value", function(snapshot) {
    $(playerToAdd).append("<p class='rps' id='" + playerToAdd + "WinsAndLosses'>Wins: " + snapshot.val().wins + " Losses: " + snapshot.val().losses + "</p>");
  });
  console.log('players/' + playerNumber);
}

var addPlayer = function(name) {
  var playerToAdd = "#player"  + playerNumber;
  $(playerToAdd).append("<p class='playerNameTag' id='player" + playerNumber + "'>" + name + "</p>");
  //console.log(playerToAdd);
  addRPS(playerToAdd);
}

var initialLoad = function() {
  $("#turn").append("<div class='form-group' id='nameForm'>" +
    "<input type='text' class='form-control' id='nameEntry' placeholder='Your name here'>" +
    "<button type='submit' id='add-user' class='btn btn-primary'>OK</button>" +
    "</div>");
  $("#greeting").append("<p id='nameDirections'>Enter your name to start the game</p>");
}

var headingWait = function(name) {
  database.ref('players/' + playerNumber).set({
      name: name,
      choice: "",
      wins: 0,
      losses: 0
    });
  $("#nameForm").addClass("hide");
  $("#nameDirections").addClass("hide");
  $("#greeting").html("Welcome " + name);
  $("#turn").html("Waiting on another player to join.");
  addPlayer(name);
}
   
$("#add-user").on("click", function(event) {
  event.preventDefault();
  name = $("#nameEntry").val().trim();

  database.ref('players').once('value').then(function(snap) {

    if (snap.hasChild('1') && snap.hasChild('2')) {
      consule.log("Game is full!");
    }
    else if (snap.hasChild('1')) {
      playerNumber = 2;
      //addPlayer()
    }
    else if (snap.hasChild('2')) {
      playerNumber = 1;
      //addPlayer()
    }
    else {
      headingWait(name);
    }
    console.log("1 exists: "+snap.hasChild('1'))//true is exists, false if not
    console.log("2 exists: "+snap.hasChild('2'))//true is exists, false if not
  });
});
  
//Chat functionality
$("#send").on("click", function(event) {
  event.preventDefault();
  chatEntry = $("#chatEntry").val().trim();
  chats++;
  database.ref('chat/').push({
    chatEntry: chatEntry,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  $('#chatForm')[0].reset();
});

database.ref('chat/').orderByChild("dateAdded").on("child_added", function(snapshot) {
  $("#chatDisplay").append("<p>" + snapshot.val().chatEntry + "</p>");
 });

initialLoad();
