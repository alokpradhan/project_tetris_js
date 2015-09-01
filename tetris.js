// Board is 10 blocks wide 20 blocks high
// At regular intervals blocks are moved down
// Stop when touching something below them (piece or ground)
// Pressing left or right moves piece but not past edge
// Pressing down speeds up movement of current piece

// Piece taken from pieceQuere
// Inserted at same position (top center of grid)
// Falls until moving = false
// Next

// Model:
// Piece queue
// gameBoard
var model = {

  gameboard:  {},
  pieceQueue: {},

  init: function(){
    model.createGameBoard();
  },

  createGameBoard: function(){
    for (var i = 0; i < 200; i++){
      gameboard[i] = "";
    }
    var newPiece = model.createPiece();
    newPiece.position.forEach(function(el){
      gameBoard[el] = newPiece;
    });
    gameBoard[newPiece.positon] = newPiece;
  },

  createPiece: function(){
    var pieceToAdd = new Piece();
    // pieceToAdd.positon = [5];
    // pieceToAdd.active = true;
    pieceToAdd.shape = "singleSquare";
    pieceToAdd.color = "blue";
    return pieceToAdd;
  },

  Piece: function(){
    this.position = [5]; // id of element
    this.shape = '';
    this.color = '';
    this.active = true; // true or false
  }
};


// View:
// initializeGrid()
// renderGrid()
// movePiece()
// keyPressListener()

var view = {

  init: function(gridSize){
    view.initializeGrid(gridSize);
  },

  initializeGrid: function(gridSize){
    for(var i=1; i <= gridSize; i++){
      $('#gameboard').append('<div class="cell" id="'+i+'"></div>');
      console.log(gridSize);
      if (i % 10 === 0){
        $('#gameboard').append('<br>');
      }
    }
  },

  updatePieces: function(){
    view.moveActivePiece();
    view.destoryStaticPieces();
  },

  moveActivePiece: function(){

  },

  destoryStaticPieces: function(){

  }
};


// Controller:
// Difficulty level-
// difficultyLevel
// setDifficultyLevel()
// interval loop
// init
// checkGameOver()
var controller = {

  gridSize: 400,
  level: 1,

  init: function(){
    controller.setDifficultyLevel();
    view.init(controller.gridSize);
    controller.gameLoop();
  },

  gameLoop: function(){
    view.updatePieces();
    window.gameLoop = window.setInterval(function(){
      view.updatePieces();
    }, 1000 / controller.level);
  },

  setDifficultyLevel: function(){
    controller.level = prompt("Select difficulty: Enter 1 for easy, 2 for difficult");
  }

};

$(document).ready(function(){controller.init();});
