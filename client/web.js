'use strict'
const path = require("path");
const ipc = require("electron").ipcRenderer;
const components = require("./components.js");
const ReactDOM = require("react-dom");
const React = require("react");

const $ = require("./ext/jquery-2.1.4.min.js");
const collection = require("./collection.js");

function render_game_list(games) {
  ReactDOM.render(React.createElement(components.GameList, {games: games}), $("#game-group")[0]);
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
    render_game_list(games);
  });

  collection.scan_existing_games((games) => {
    render_game_list(games);
  });

  $("#webview").openDevTools();
});
