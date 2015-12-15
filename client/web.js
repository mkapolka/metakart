const path = require("path");
ipc = require("electron").ipcRenderer;

$ = require("./ext/jquery-2.1.4.min.js");
const collection = require("./collection.js");

function add_game_entry(game) {
  var entry = $(Handlebars.compile($("#game-entry-template").html())(game));
  entry.mousedown(function(e) {
    $("#webview").attr("src", game.url);
  });
  $("#game-group").append(entry);
}

$(function(){
  $("#navbar-back").click(function() {
    $("#webview")[0].goBack()
  });
  $("#navbar-forward").click(function() {
    $("#webview")[0].goForward()
  });
  $("#navbar-reload").click(function() {
    $("#webview")[0].reload()
  });

  $("#navbar-url").keyup("enterKey", function(e) {
    if (e.keyCode == 13) {
      $("#webview").attr("src", $("#navbar-url").val());
    }
  })

  $("#webview").bind("did-get-response-details", function(e) {
    $("#navbar-url").val(e.target.src);
  })

  $("#webview")[0].addEventListener("ipc-message", function(e) {
    if (e.channel == "game-metadata") {
      var game = e.args[0];
      $("#game-name").attr("value", game.name);
      $("#game-url").attr("value", game.url);
      $("#game-id").attr("value", game.directory);
      ipc.send('game-metadata', e.args[0]);
    }
  });

  ipc.on('games-list-updated', function(event, games) {
    console.log(games);
    games.forEach((game) => {
      add_game_entry(game);
    });
  });

  collection.scan_existing_games((games) => {
    console.log(games);
    games.forEach((game) => {
      add_game_entry(game);
    });
  });

  //$("#webview").bind('dom-ready', () => {$("#webview")[0].openDevTools();});
});

module.exports = {
  add_game_entry
}
