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
      collection.set_current_game(game);
      ipc.send('game-metadata', e.args[0]);
    }
  });

  ipc.on('games-list-updated', function(event, message) {
    for (game in message.args[0]) {
      add_game_entry(game);
    }
  });

  collection.scan_existing_games((games) => {
    games.forEach((game) => {add_game_entry(game)});
  });

  remote.getCurrentWebContents().session.on('will-download', function(event, item, webContents) {
    var current_game = collection.get_current_game();
    //var current_game = collection.get_current_game();
    collection.save_game_manifest(current_game);
    add_game_entry(current_game);
    item.setSavePath(path.join(collection.DOWNLOAD_ROOT, item.getFilename()));
    item.on('done', function(e, state) {
      if (state == "completed") {
        console.log("Download successful.");
      } else {
        console.log("UH OH " + state);
      }
    });
  });


  $("#webview").bind('dom-ready', () => {$("#webview")[0].openDevTools();});
});

module.exports = {
  add_game_entry
}
