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
  }
  gameboard: {},
  pieceQueue:,
  createPiece: function(){
    var pieceToAdd = new Piece();
    pieceToAdd.positon = [5];
    pieceToAdd.active = true;
    pieceToAdd.shape = "singleSquare";
    pieceToAdd.color = "blue";
    return pieceToAdd;
  },
  Piece: function(){
    this.position; // id of element
    this.shape;
    this.color;
    this.moving; // true or false
  }
}


// View:
// initializeGrid()
// renderGrid()
// movePiece()
// keyPressListener()

var view = {
  init: function(grid){
    view.initializeGrid(grid);
  },
  initializeGrid: function(){

  },
  updatePieces: function(){
    view.moveActivePiece();
    view.destoryStaticPieces();
  },
  moveActivePiece: function(){

  },
  destoryStaticPieces: function(){

  }
}


// Controller:
// Difficulty level-
// difficultyLevel
// setDifficultyLevel()
// interval loop
// init
// checkGameOver()
var controller = {
  init: function(){
    controller.setDifficultyLevel();
    view.init(controller.gridSize);
    controller.gameLoop();
  },
  gridSize: 200,
  speed: 1,
  gameLoop: function(){
    view.updatePieces();
    window.gameLoop = window.setInterval(function(){
      view.updatePieces();
    }, 1000 / controller.level)
  }
}
