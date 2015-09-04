var Tetris = Tetris || {};

Tetris.State = (function(Piece, User, $){

  var gameboard =  {};
  var divsToDestroy = [];
  var currentPiece = '';
  var gridSize = 0;

// ------ Initialize game state ------

  var init = function(size){
    _createGameboard(size);
  };

  var _createGameboard = function(size){
    for (var i = 0; i < size; i++){ gameboard[i] = '';}
    _newCurrentPiece();
    gridSize = size;
  };

  var _newCurrentPiece = function(){
    currentPiece = Piece.create();
    _placePiece();
  };

  var _placePiece = function(){
    currentPiece.positions.forEach(function(position){
      gameboard[position] = currentPiece;
    });
  };

// ------ Get / set game state variables ------

  var getGameboard = function(){
    return gameboard;
  };

  var setGameboard = function(position, piece){
    gameboard[position] = piece;
  };

  var getCurrentPiece = function(){
    return currentPiece;
  };

  var setCurrentPiece = function(newPositions){
    currentPiece.positions = newPositions;
  };

// ------ Modify game state during play ------

  var stopPieceMovement = function(){
    currentPiece.active = false;
    _newCurrentPiece();
  };

  var checkAndDestroyLine = function(step){
    var row_full = false;
    for(var i = gridSize-1; i >= 0; i-=step){
      row_full = true;
      divsToDestroy = [];
      for(var j = i; j > i - step; j--){
        divsToDestroy.push(j);
        if (gameboard[j] === ''){row_full = false;}
      }
      if (row_full){
        _destroyLineInGameboard(step);
        User.setScore();
      }
    }
  };

  var _destroyLineInGameboard = function(step){
    for(var i=0; i < step; i++){
      var deleteDiv = divsToDestroy[i];
      while (deleteDiv-step > 0) {
        gameboard[deleteDiv] = gameboard[deleteDiv-step];
        deleteDiv = deleteDiv-step;
      }
    }
  };

// ------ End game and log score ------

  var checkEndGame = function(){
    // return ((gameboard[25] !== undefined) && gameboard[25].active) ? true : false;
    // In the view, just check if two color overlap or exceed the upper bound
  };

  return {
    init: init,
    setGameboard: setGameboard,
    getGameboard: getGameboard,
    getCurrentPiece: getCurrentPiece,
    setCurrentPiece: setCurrentPiece,
    checkAndDestroyLine: checkAndDestroyLine,
    stopPieceMovement: stopPieceMovement,
    checkEndGame: checkEndGame
  };

})(Tetris.Piece, Tetris.User, $);