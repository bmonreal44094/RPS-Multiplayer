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
var otherPlayer = 0;
var playerName = "";
var chats = 0;
var rps = ["Rock", "Paper", "Scissors"];


//Listerns & DB Checks for game state
var listenForStart = function() {
  database.ref('players').once('value').then(function(snap) {
    if (snap.hasChild('1') && snap.hasChild('2')) {
      startGame();
      clearInterval(timer);
    }      
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
   
};

var dbCheck = function() {
  database.ref('players').once('value').then(function(snap) {

    if (snap.hasChild('1') && $().not(snap.hasChild('2'))) {
      isPlayer = 2;
    }
    else if (snap.hasChild('2') && $().not(snap.hasChild('1'))) {
      isPlayer = 1;
    }
    else if (snap.hasChild('1') && snap.hasChild('2')) {
      startGame();
    }
    else {
      isPlayer = 1;
      console.log('missed other conditions in dbCheck');
    }
  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
};

var dbStartReady = function() {
  database.ref('players').once('value').then(function(snap) {
    if (snap.hasChild('1') && snap.hasChild('2')) {
      startGame();
    }
    else {
      timer = setInterval(listenForStart, 1000);
    }
  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
};

//Game load fucntions
var startGame = function() {
  if (isPlayer === 1) {
    otherPlayer = 2;
  }
  else if (isPlayer === 2){
    otherPlayer = 1;
  }
  loadPlayers();
};

var loadPlayers = function() {
  database.ref('players/' + isPlayer).once('value').then(function(snapshot) { 
    var isName = snapshot.val().name;
    var isWins = snapshot.val().wins;
    var isLosses = snapshot.val().losses;
    addPlayer(isName, isPlayer, isWins, isLosses);
    hideNameEntry(); 
  });
    database.ref('players/' + otherPlayer).once('value').then(function(snapshot) { 
    var otherName = snapshot.val().name;
    var otherWins = snapshot.val().wins;
    var otherLosses = snapshot.val().losses;
    addPlayer(otherName, otherPlayer, otherWins, otherLosses); 
  });

};

var addPlayer = function(name, playerNumber, wins, losses) {
  var playerToAdd = "#player"  + playerNumber;
  $(playerToAdd).append("<p class='playerNameTag rps' id='player" + playerNumber + "NameTag'>" + name + "</p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Rock'>Rock</p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Paper'>Paper</p>");
  $(playerToAdd).append("<p class='rps options' id='player" + playerNumber + "Scissors'>Scissors</p>");
  $(playerToAdd).append("<p class='rps' id='player" + playerNumber + "WinsAndLosses'>Wins: " + wins + " Losses: " + losses + "</p>");
};

var hideNameEntry = function() {
  $("#nameForm").addClass("hide");
  $("#nameDirections").addClass("hide");
}

var addUserDB = function(name) {
  database.ref('players/' + isPlayer).set({
      name: name,
      choice: "",
      wins: 0,
      losses: 0
  });
};

var headingWait = function(name) {
  hideNameEntry();
  $("#greeting").html("Welcome " + name);
  $("#turn").html("Waiting on another player to join.");
};

$('#add-user').on("click", function(event) {
  name = $("#name-entry").val().trim();
  clearInterval(wait);
  if (isPlayer === 1) {
      addUserDB(name);
      headingWait(name);
      dbStartReady();
  }
  else if (isPlayer === 2) {
      addUserDB(name);
      dbStartReady();
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

var wait = setInterval(dbCheck, 1000);
