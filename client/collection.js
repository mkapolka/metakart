const fs = require("fs");

function make_game(name, url, directory) {
  return {
    name: name,
    url: url,
    directory: directory
  }
}

function scan_existing_games() {
  fs.readdir('./games/', function(err, directories) {
    directories.forEach((directory) => {
      var game = make_game(directory, directory);
      add_game_entry(game)
    });
  });
}

module.exports = {
  make_game, scan_existing_games
}
