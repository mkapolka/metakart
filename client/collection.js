const fs = require("fs");
const path = require("path");

var GAMES_ROOT = './games'

function make_game(name, url, directory) {
  return {
    name: name,
    url: url,
    directory: directory
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
  make_game, scan_existing_games, save_game_manifest
}
