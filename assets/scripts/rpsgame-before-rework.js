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
var isPlayer = 0;
var playerNumber = 0;
var playerName = "";
var chats = 0;
var rps = ["Rock", "Paper", "Scissors"];

var startGame = function() {
  $("#nameForm").addClass("hide");
  $("#nameDirections").addClass("hide");
}
   database.ref('players/1').on("value", function(snapshot) {
      $("#click-value").html(snapshot.val().clickCount);
      clickCounter = snapshot.val().clickCount;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

var loadPlayers = function(i) {
  database.ref('players/' + i).once('value').then(function(snapshot) { 
    var name = snapshot.val().name;
    console.log(snapshot.val().name);
    $('#player' + i + 'NameTag').text(name);
    console.log('player' + i);
  });
};

var dbCheck = function() {
  database.ref('players').once('value').then(function(snap) {

    if (snap.hasChild('1') && snap.hasChild('2')) {
      console.log("Game is full!");
    
      for (var i = 1; i <= 2; i++) {
        playerNumber = i;
        console.log('Player Number: ' + i);
        console.log('i: ' + i)
        //var playerToAdd = "#player"  + i;
        loadPlayers(i);
        addPlayer(name);
        addRPS('player' + playerNumber);
      }
      //$("#add-user").off("click");
    }
    else if (snap.hasChild('1')) {
      playerNumber = 2;
      isPlayer = 2;
      //addUserDB('player2'); 
    }
    else if (snap.hasChild('2')) {
      playerNumber = 1;
      isPlayer = 1;
      //addUserDB('player1');
    }
    else {
      console.log('database ref working');
      isPlayer = 1;
      //initialLoad();
    }
  });
};

//dbCheck();

if (playerNumber === 0) {
  $("#turn").append("<div class='form-group' id='nameForm'>" +
    "<input type='text' class='form-control' id='name-entry' placeholder='Your name here'>" +
    "<button type='form' id='add-user' class='btn btn-primary'>OK</button>" +
    "</div>");
  $("#greeting").append("<p id='nameDirections'>Enter your name to start the game</p>");
  console.log('made it to initialLoad');
  dbCheck();
}

var addRPS = function(playerToAdd) {
  $('#' + playerToAdd + 'Rock').text('Rock');
  $('#' + playerToAdd + 'Paper').text('Paper');
  $('#' + playerToAdd + 'Scissors').text('Scissors');
};

var addPlayer = function(name) {
  var playerToAdd = "#player"  + playerNumber;
  $(playerToAdd).append("<p class='playerNameTag rps' id='player" + playerNumber + "NameTag'>" + name + "</p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Rock'></p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Paper'></p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Scissors'></p>");
  database.ref('players/' + playerNumber + '/').on("value", function(snapshot) {
    $(playerToAdd).append("<p class='rps' id='" + playerToAdd + "WinsAndLosses'>Wins: " + snapshot.val().wins + " Losses: " + snapshot.val().losses + "</p>");
  });
};

var addUserDB = function(name) {
  database.ref('players/' + playerNumber).set({
      name: name,
      choice: "",
      wins: 0,
      losses: 0
  });
};

var headingWait = function(name) {
  addUserDB(name);
  addPlayer(name);
  $("#nameForm").addClass("hide");
  $("#nameDirections").addClass("hide");
  $("#greeting").html("Welcome " + name);
  $("#turn").html("Waiting on another player to join.");
};

$('#add-user').on("click", function(event) {
  //event.preventDefault();
  name = $("#name-entry").val().trim();
  console.log('Clicked:' + playerNumber);
  console.log('Clicked:' + name);

  if (playerNumber === 0) {
      playerNumber = 1;
      isPlayer = 1;
      headingWait(name);
      console.log('Listener:' + playerNumber);
      console.log('Listener:' + name);
  }
  else if (playerNumber === 2) {
      isPlayer = 2;
      addUserDB(name);
      addPlayer(name);
      dbCheck();
  }
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
