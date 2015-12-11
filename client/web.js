$ = require("./ext/jquery-2.1.4.min.js");
ipc = require("electron").ipcRenderer;
const collection = require("./collection.js");

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
    if (e.channel == "window-data") {
      console.log(collection.game_from_current_page($("#webview").attr("src"), e.args[0]));
    }
  });

  collection.scan_existing_games();
});

function add_game_entry(game) {
  var entry = $(Handlebars.compile($("#game-entry-template").html())(game));
  entry.mousedown(function(e) {
    $("#webview").attr("src", game.url);
  });
  $("#game-group").append(entry);
}
