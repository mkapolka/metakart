'use strict'
const $ = require("./ext/jquery-2.1.4.min.js");
const fs = require("fs");
const path = require("path");
const zip = require('node-7z');

var GAMES_ROOT = './games'
var DOWNLOAD_ROOT = './downloads'

let current_game = undefined;

GameStates = {
  Downloading = "downloading",
  Downloaded = "downloaded",
  Ready = "ready"
}

function set_current_game(game) {
  current_game = game;
}

function get_current_game() {
  return current_game;
}

function make_game(name, url, directory) {
  return {
    name: name,
    url: url,
    directory: directory
  }
}

function save_game_manifest(game, callback) {
  var manifest_data = {
    name: game.name,
    url: game.url
  }
  var manifest_string = JSON.stringify(manifest_data);
  var manifest_path = path.join(GAMES_ROOT, game.directory, 'manifest.json');
  fs.mkdir(path.join(GAMES_ROOT, game.directory));
  fs.writeFile(manifest_path, manifest_string, function(error) {
    if (error) {
      console.log("Error saving " + manifest_path);
      console.log(error);
    } else {
      console.log("Saved " + path.join(GAMES_ROOT, game.directory, 'manifest.json'));
    }
    callback(error);
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

function scan_existing_games(callback) {
  fs.readdir(GAMES_ROOT, function(err, directories) {
    var output = []
    directories.forEach((directory) => {
      var exception = undefined;
      var data = ""
      try {
        data = fs.readFileSync(path.join(GAMES_ROOT, directory, "manifest.json"))
      } catch (e) {
        exception = e;
      }

      if (exception) {
        console.log(exception);
        var game = make_game(directory, directory);
        game.name = "!ERROR" + game.name;
        output.push(game)
      } else {
        var manifest_data = JSON.parse(data);
        var game = make_game(manifest_data['name'], manifest_data['url'], manifest_data['directory']);
        output.push(game)
      }
    });
    callback(output);
  });
}

// file = archive file, game = game object that it'll be added to
function extract_game(file, game) {
  var task = new zip();
  task.extractFull(file, game.directory)
    .then(function() {
      console.log("donezo");
    })
    .catch(function(error) {
      console.log(error);
    });
}

module.exports = {
  make_game, scan_existing_games, save_game_manifest, make_necessary_directories, DOWNLOAD_ROOT, GAMES_ROOT,
  set_current_game, get_current_game, extract_game
}
