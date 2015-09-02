
// --------- Model -----------

var model = {

  gameboard:  {},
  // pieceQueue: [],
  currentPiece: '',
  divsToDestroy: [],

  init: function(){
    model.createGameBoard();
  },

  createGameBoard: function(){
    for (var i = 0; i < controller.gridSize; i++){
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
    pieceToAdd.color = model.colorPiece();
    return pieceToAdd;
  },

  // addPieceToQueue: function(){
  //   model.pieceQueue.push(model.createPiece());
  // },

  colorPiece: function(){
    var colors = ['blue','red','green','yellow'];
    return colors[Math.floor(Math.random()*4)];
  },

  newCurrentPiece: function(){
    model.currentPiece = model.createPiece();
    for(var i=0; i < model.currentPiece.positions; i++){
      model.gameboard[model.currentPiece.positons[i]] = model.currentPiece;
    }
  },

  stopPieceMovement: function(piece){
    // piece.active = false;
    model.newCurrentPiece();
  },

  checkAndDestroyLine: function(){
    var row_full = false;
    for(var i = controller.gridSize-1; i >= 0; i-=view.step){
      row_full = true;
      model.divsToDestroy = [];
      for(var j = i; j > i - view.step; j--){
        model.divsToDestroy.push(j);
        if (model.gameboard[j] === ''){
          row_full = false;
        }
      }
      if (row_full){
        // console.log("check destroy line is running " + model.divsToDestroy.length);
        model.destroyLine();
      }
    }
  },

  destroyLine: function(){
      for(var i=0; i < view.step; i++){
        deleteDiv = model.divsToDestroy[i];
        while (deleteDiv-view.step > 0) {
          model.gameboard[deleteDiv] = model.gameboard[deleteDiv-view.step];
          deleteDiv = deleteDiv-view.step;
        }
      }
  },

  Piece: function(){
    this.positions = [5,6,15,16]; // id of element
    this.shape = '';
    this.color = '';
    this.structure = [1,1,1,1];
    // this.active = true; // true or false
  }
};

// --------- View -----------

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
      $('#gameboard').append('<div class="cell" id="'+(i-1)+'"></div>');
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
    view.moveActivePieces();
    view.destoryStaticPieces();
  },

  renderGameboard: function(){
    for (var i = 0; i < controller.gridSize; i++){
      if (model.gameboard[i] !== ''){
        var piece = model.gameboard[i];
        $("#" + i).addClass(piece.color);
      } else {
        $("#" + i).removeClass('green').removeClass('blue').removeClass('yellow').removeClass('red');
      }
    }
  },

  testIfBrick: function(div){
    return $('#' + (div)).hasClass("blue") || $('#' + (div)).hasClass("yellow") ||
           $('#' + (div)).hasClass("red")  || $('#' + (div)).hasClass("green");
  },

  moveActivePieces: function(){
    checkMovements();
    makeMove();
    view.destoryStaticPieces();
  },

  checkMovements: function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      var currentID = model.currentPiece.positions[i];
      if (currentID + view.step > 199 || view.testIfBrick(currentID + view.step)){
        model.stopPieceMovement();
      } else {
        if (currentID + view.step + view.step > 199 ||
            view.testIfBrick(currentID + view.step + view.step)) {
          view.currentDirection = '38';
        }
      }
    }
  },

  removeClasses: function(){
    $('#' + model.currentPiece.positions[0]).removeClass(model.currentPiece.color);
    $('#' + model.currentPiece.positions[1]).removeClass(model.currentPiece.color);
    $('#' + model.currentPiece.positions[2]).removeClass(model.currentPiece.color);
    $('#' + model.currentPiece.positions[3]).removeClass(model.currentPiece.color);
    model.gameboard[model.currentPiece.positions[0]] = '';
    model.gameboard[model.currentPiece.positions[1]] = '';
    model.gameboard[model.currentPiece.positions[2]] = '';
    model.gameboard[model.currentPiece.positions[3]] = '';
  },

  addClasses: function(divIdsToMoveTo){
    $('#' + divIdsToMoveTo[0]).addClass(model.currentPiece.color);
    $('#' + divIdsToMoveTo[1]).addClass(model.currentPiece.color);
    $('#' + divIdsToMoveTo[2]).addClass(model.currentPiece.color);
    $('#' + divIdsToMoveTo[3]).addClass(model.currentPiece.color);
    model.gameboard[divIdsToMoveTo[0]] = model.currentPiece;
    model.gameboard[divIdsToMoveTo[1]] = model.currentPiece;
    model.gameboard[divIdsToMoveTo[2]] = model.currentPiece;
    model.gameboard[divIdsToMoveTo[3]] = model.currentPiece;

  }

  makeMove: function(){
    divIdsToMoveTo = view.newPieceDiv();
    removeClasses();
    addClasses();
    model.currentPiece.positions = divIdsToMoveTo;

  },

  destoryStaticPieces: function(){
    model.checkAndDestroyLine();
    view.renderGameboard();
  },

  setPieceDirection: function(event){
    view.currentDirection = view.userMove[event.which];
  },

  newPieceDiv: function() {
    var divIdToMoveTo = 0;
    switch (this.currentDirection) {
      case 'left' :
        divIdsToMoveTo = []
        for (var i = 0; i < model.currentPiece.positions.length; i++){
          moveID = (model.currentPiece.positions[i]%10 === 0) ?
                    model.currentPiece.positions[i] : (model.currentPiece.positions[i] - 1 + view.step)
          divIdsToMoveTo.push(moveID)
        }
        // divIdToMoveTo = (currentDiv%10 === 0) ?
        //                 currentDiv : (currentDiv - 1 + view.step);
        break;
      case 'right' :
        divIdsToMoveTo = []
        for (var i = 0; i < model.currentPiece.positions.length; i++){
          moveID = (model.currentPiece.positions[i]%10 === 9) ?
                    model.currentPiece.positions[i] : (model.currentPiece.positions[i] + 1 + view.step)
          divIdsToMoveTo.push(moveID)
        }
        // divIdToMoveTo = (currentDiv%10 === 9) ?
        //                 currentDiv : (currentDiv + 1 + view.step);
        break;
      case 'down':
        divIdsToMoveTo = []
        for (var i = 0; i < model.currentPiece.positions.length; i++){
          moveID = model.currentPiece.positions[i] + view.step*3
          divIdsToMoveTo.push(moveID)
        }
        // divIdToMoveTo = currentDiv + view.step*3;
        break;
      default:
        divIdsToMoveTo = []
        for (var i = 0; i < model.currentPiece.positions.length; i++){
          moveID = model.currentPiece.positions[i] + view.step
          divIdsToMoveTo.push(moveID)
        }
        // divIdToMoveTo = currentDiv + view.step;
    }
    this.currentDirection = '38';
    return divIdsToMoveTo;
  },

  userMove: {
    37: 'left',
    39: 'right',
    40: 'down'
  }

};

// --------- Controller -----------

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
    }, 100 / controller.level);
  },

  setDifficultyLevel: function(){
    controller.level = prompt("Select difficulty: Enter 1 for easy, 2 for difficult");
  }

};

$(document).ready(function(){controller.init();});
