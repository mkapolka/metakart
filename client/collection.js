const $ = require("./ext/jquery-2.1.4.min.js");
const fs = require("fs");
const path = require("path");

var GAMES_ROOT = './games'
var DOWNLOAD_ROOT = './downloads'

function make_game(name, url, directory) {
  return {
    name: name,
    url: url,
    directory: directory
  }
}

function game_from_url(url) {
  
}

function game_from_current_page(url, html) {
  // Check which website we're on
  var itch_rex = /http:\/\/[a-z0-9-]+\.itch\.io\/[a-z0-9-]+/
  if (itch_rex.exec(url)) {
    var jq = $(html);
    var game_id_rex = /itch.io\/([a-z0-9-]+)/;
    var title = jq.find("h1.game_title").text();
    return make_game(title, url, game_id_rex.exec(url)[1]);
  }
}

function save_game_manifest(game) {
  var manifest_data = {
    name: game.name,
    url: game.url
  }
  var manifest_string = JSON.stringify(manifest_data);
  fs.writeFile(path.join(GAMES_ROOT, game.directory, 'manifest.json'), manifest_string, function(error) {
    console.log(error);
  });
}

function make_necessary_directories() {
  if (fs.statSync(GAMES_ROOT) === undefined) {
    fs.mkdir(GAMES_ROOT);
  }
  if (fs.statSync(DOWNLOAD_ROOT) === undefined) {
    fs.mkdir(DOWNLOAD_ROOT);
  }
}

function scan_existing_games() {
  fs.readdir(GAMES_ROOT, function(err, directories) {
    directories.forEach((directory) => {
      fs.readFile(path.join(GAMES_ROOT, directory, "manifest.json"), function(error, data) {
        if (error) {
          console.log(error);
          var game = make_game(directory, directory);
          game.name = "!ERROR" + game.name;
          add_game_entry(game)
        } else {
          var manifest_data = JSON.parse(data);
          var game = make_game(manifest_data['name'], manifest_data['url'], manifest_data['directory']);
          add_game_entry(game);
        }
      })
    });
  });
}

module.exports = {
  make_game, scan_existing_games, save_game_manifest, make_necessary_directories, DOWNLOAD_ROOT, GAMES_ROOT, game_from_current_page
}
