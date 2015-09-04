var Tetris = Tetris || {};

Tetris.Controller = (function(State, View, User, $){

  var gridSize = 200;
  var level = 1;

  init = function(){
    setDifficultyLevel();
    State.init(gridSize);
    View.init(gridSize);
    gameLoop();
  };

  var gameLoop = function(){
    window.gameLoop = window.setInterval(function(){
      View.updatePieces();
      if (State.checkEndGame()){endGame();}
    }, 400 / User.getLevel());
  };

  var endGame = function(){
    window.clearInterval(window.gameLoop);
  };

  var setDifficultyLevel = function(){
    User.setLevel(prompt("Select difficulty: Enter 1 for easy, 2 for difficult"));
  };

  return {
    init: init
  };

})(Tetris.State, Tetris.View, Tetris.User, $);

$(document).ready(function(){Tetris.Controller.init();});