var Tetris = Tetris || {};

Tetris.Controller = (function(gameStateModel, View, User, $){

  var gridSize = 200;
  var level = 1;

  init = function(){
    setDifficultyLevel();
    gameStateModel.init(gridSize);
    View.init(gridSize);
    gameLoop();
  };

  var gameLoop = function(){
    window.gameLoop = window.setInterval(function(){
      View.updatePieces();
    }, 400 / User.getLevel());
  };

  var setDifficultyLevel = function(){
    User.setLevel(prompt("Select difficulty: Enter 1 for easy, 2 for difficult"));
  };

  return {
    init: init
  };

})(Tetris.State, Tetris.View, Tetris.User, $);

$(document).ready(function(){Tetris.Controller.init();});