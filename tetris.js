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
  // pieceQueue: [],
  currentPiece: '',
  divsToDestroy: [],

  init: function(){
    model.createGameBoard();
  },

  createGameBoard: function(){
    for (var i = 0; i < 200; i++){
      model.gameboard[i] = "";
    }
    model.currentPiece = model.createPiece();
    model.currentPiece.positions.forEach(function(el){
      model.gameboard[el] = model.currentPiece;
    });
    model.gameboard[model.currentPiece.positons] = model.currentPiece;
  },

  createPiece: function(){
    var pieceToAdd = new model.Piece();
    pieceToAdd.shape = "singleSquare";
    pieceToAdd.color = "blue";
    return pieceToAdd;
  },

  // addPieceToQueue: function(){
  //   model.pieceQueue.push(model.createPiece());
  // },

  newCurrentPiece: function(){
    model.currentPiece = model.createPiece();
    model.gameboard[model.currentPiece.positons] = model.currentPiece;
  },

  stopPieceMovement: function(piece){
    // piece.active = false;
    model.newCurrentPiece();
  },

  checkDestroyLine: function(){
    var row_full = false;
    for(var i = controller.gridSize; i > 0; i--){
      row_full = false;
      model.divsToDestroy = [];
      for(var j = i; j > i - view.step; j--){
        if (model.gameboard[i] !== ''){
          model.divsToDestroy.push(i);
          row_full = true;
        } else {
          row_full = false;
        }
      }
    }
    return row_full;
  },

  destroyLine: function(){
    if (model.checkDestroyLine()){
      for(var i=0; i < view.step; i++){
        model.gameboard[model.divsToDestroy[i]] = '';
      }
    }
  },

  Piece: function(){
    this.positions = [5]; // id of element
    this.shape = '';
    this.color = '';
    // this.active = true; // true or false
  }
};


// View:
// initializeGrid()
// renderGrid()
// movePiece()
// keyPressListener()

var view = {

  currentDirection: '',
  step: 10,

  init: function(gridSize){
    view.initializeGrid(gridSize);
    view.initializePiece();
    $(document).keydown(function(event){
      view.setPieceDirection(event);
    });
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

  initializePiece: function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      $('#'+ model.currentPiece.positions[i]).addClass(model.currentPiece.color);
    }
  },

  updatePieces: function(){
    view.moveActivePiece();
    view.destoryStaticPieces();
  },

  testIfBrick: function(div){
    return $('#' + (div)).hasClass("blue") || $('#' + (div)).hasClass("yellow") ||
           $('#' + (div)).hasClass("red")  || $('#' + (div)).hasClass("green");
  },

  moveActivePiece: function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      var currentID = model.currentPiece.positions[i];
      if (currentID + view.step > 200 || view.testIfBrick(currentID + view.step)){
        model.stopPieceMovement();
      } else {
        if (currentID + view.step + view.step > 200 ||
            view.testIfBrick(currentID + view.step + view.step)) {
          view.currentDirection = '38';
        }
        $('#'+ currentID).removeClass(model.currentPiece.color);
        divToMoveToID = view.newPieceDiv(currentID);  // currentID + view.step;
        $('#'+ divToMoveToID).addClass(model.currentPiece.color);
        model.currentPiece.positions[i] = divToMoveToID;
        model.gameboard[currentID] = '';
        model.gameboard[divToMoveToID] = model.currentPiece;
      }
    }
  },

  destoryStaticPieces: function(){
    // for(var i = 0; i < view.step; i++){
    //   for(var j = 0; i < view.step; i++){

    //   }
    // }
  },

  setPieceDirection: function(event){
    view.currentDirection = view.userMove[event.which];
  },

  newPieceDiv: function(currentDiv) {
    var divIdToMoveTo = 0;
    switch (this.currentDirection) {
      case 'left' :
        divIdToMoveTo = currentDiv - 1 + view.step;
        break;
      case 'right' :
        divIdToMoveTo = currentDiv + 1 + view.step;
        break;
      case 'down':
        divIdToMoveTo = currentDiv + view.step + view.step;
        break;
      default:
        divIdToMoveTo = currentDiv + view.step;
    }
    this.currentDirection = '38';
    return divIdToMoveTo;
  },

  userMove: {
    37: 'left',
    39: 'right',
    40: 'down'
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

  gridSize: 200,
  level: 1,

  init: function(){
    controller.setDifficultyLevel();
    model.init();
    view.init(controller.gridSize);
    controller.gameLoop();
  },

  gameLoop: function(){
    window.gameLoop = window.setInterval(function(){
      view.updatePieces();
    }, 1000 / controller.level);
  },

  setDifficultyLevel: function(){
    controller.level = prompt("Select difficulty: Enter 1 for easy, 2 for difficult");
  }

};

$(document).ready(function(){controller.init();});
