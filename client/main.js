'use strict';
const fs = require('fs');
const path = require('path');

const electron = require('electron');
const ipcMain = electron.ipcMain;
const zip = require('node-7z');

const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

const collection = require("./collection");

// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let current_game;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  collection.make_necessary_directories();
  collection.scan_existing_games(function(games){
    mainWindow.webContents.send('game-list-updated', games);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  ipcMain.on('game-metadata', function(event, arg) {
    current_game = arg;
    console.log("current game");
    console.log(arg);
    console.log(current_game);
  });

  mainWindow.webContents.session.on('will-download', function(event, item, webContents) {
    console.log(current_game);
    collection.save_game_manifest(current_game);
    collection.scan_existing_games(function(games) {
      mainWindow.webContents.send('games-list-updated', games);
    });
    item.setSavePath(path.join(collection.DOWNLOAD_ROOT, item.getFilename()));
    item.on('done', function(e, state) {
      if (state == "completed") {
        console.log("Download successful.");
      } else {
        console.log("UH OH " + state);
      }
    });
  });
});
