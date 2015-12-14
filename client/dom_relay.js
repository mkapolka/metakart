(function() {
  var $ = undefined;
  var ipc = require("electron").ipcRenderer;

  function load_jquery() {
    $ = require("./ext/jquery-2.1.4.min.js");
  }

  function __itch_schema_name() {
    var schemas = $("script[type='application/ld+json']");
    schemas.each((schema) => {
      var son = JSON.parse(schema.text);
      if (son.name) {
        return son.name;
      }
    });
  }

  function game_from_current_page(url) {
    // Check which website we're on
    var itch_rex = /http:\/\/[a-z0-9-]+\.itch\.io\/[a-z0-9-]+/
    var itch_download_rex = /http:\/\/[a-z0-9-]+\.itch\.io\/[a-z0-9-]+\/download/
    if (itch_download_rex.exec(url)) {
      var game_id_rex = /itch.io\/([a-z0-9-]+)/;
      var title = $("span.object_title").text();
      if (!title) {
        title = __itch_schema_name();
      }
      var url_rex = /(http:\/\/[a-z0-9-]+\.itch\.io\/[a-z0-9-]+)/
      return {
        name: title,
        url: url_rex.exec(url.href)[1],
        directory: game_id_rex.exec(url.href)[1],
        method: "itch-download"
      }
    } else if (itch_rex.exec(url)) {
      //var jq = $(html);
      var game_id_rex = /itch.io\/([a-z0-9-]+)/;
      var title = $("h1.game_title").text();
      if (!title) {
        title = __itch_schema_name();
      }
      return {
        name: title,
        url: url.href,
        directory: game_id_rex.exec(url)[1],
        method: "itch"
      };
    }
  }

  //document.addEventListener('dom-ready', load_jquery);
  document.addEventListener("DOMContentLoaded", function() {
    load_jquery();
    var game = game_from_current_page(document.location);
    console.log("Game detected", game);
    if (game) {
      ipc.sendToHost("game-metadata", game);
    }
  });
})();
