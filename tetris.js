
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

  factorySelection: function(){
    var num = Math.floor(Math.random() * 7);
    // var num = Math.floor(Math.random() * 1);
    // var pieces = ["RightHandLFactory"];
    var pieces = ["SquareFactory", "LineFactory", "TFactory",
                  "RightHandLFactory", "LeftHandLFactory",
                  "LeftSFactory", "RightSFactory"];
    return new model[pieces[num]]();
  },

  createPiece: function(){
    return model.factorySelection();
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

  stopPieceMovement: function(){
    model.currentPiece.active = false;
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

  SquareFactory: function(){
    this.positions = [5,6,15,16]; // id of element
    this.shape = 'square';
    this.color = model.colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 6;
    this.active = true;
  },

  LeftSFactory: function(){
    this.positions = [5,15,16,26]; // id of element
    this.shape = 'left_s';
    this.color = model.colorPiece();
    this.structure = [11,0,9,-2];
    this.reverse = [11,0,9,-2];
    this.rorated = false;
    // this.pivot = 15;
    this.active = true;
  },

  RightSFactory: function(){
    this.positions = [5,15,14,24]; // id of element
    this.shape = 'right_s';
    this.color = model.colorPiece();
    this.structure = [9,0,11,2];
    this.reverse = [9,0,11,2];
    this.rorated = false;
    // this.pivot = 15;
    this.active = true;
  },

  LineFactory: function(){
    this.positions = [5,6,7,8]; // id of element
    this.shape = 'line';
    this.color = model.colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 8;
    this.active = true;
  },

  LeftHandLFactory: function(){
    this.positions = [5,6,7,17]; // id of element
    this.shape = 'left_l';
    this.color = model.colorPiece();
    this.structure = [-18,-9,0,-11];
    this.pivot = 7;
    this.active = true;
  },

  RightHandLFactory: function(){
    this.positions = [15,5,6,7]; // id of element
    this.shape = 'right_l';
    this.color = model.colorPiece();
    this.structure = [11,20,9,-2];
    this.reverse = [2,9,20,-9]; // [-10,-1,-10,19];
    this.rorated = false;
    this.pivot = 5;
    this.active = true;
  },

  TFactory: function(){
    this.positions = [5,6,7,16]; // id of element
    this.shape = 't';
    this.color = model.colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 6;
    this.active = true;
  },

  rotatePiece: function(direction){
    for(var i = 0; i < model.currentPiece.positions.length; i++){
      if (!model.currentPiece.rotated){
        model.currentPiece.positions[i] += model.currentPiece.structure[i];
      } else {
        model.currentPiece.positions[i] -= model.currentPiece.structure[i];
      }
    }
    model.currentPiece.rotated = model.currentPiece.rotated ? false : true;
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
    view.checkMovements();
    view.makeMove();
    view.destoryStaticPieces();
  },

  checkMovements: function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      var currentID = model.currentPiece.positions[i];
      if (currentID + view.step > 199 ||
        view.testIfBrick(currentID + view.step) &&
        !(model.gameboard[currentID + view.step].active)
        ){
        model.stopPieceMovement();
      } else {
        if (currentID + view.step + view.step > 199 ||
            view.testIfBrick(currentID + view.step + view.step) ||
            view.testIfBrick(currentID + view.step + 1) && !(model.gameboard[currentID + view.step + 1].active) ||
            view.testIfBrick(currentID + view.step - 1) && !(model.gameboard[currentID + view.step - 1].active)
            ) {
          view.currentDirection = '38';
        }
      }
    }
  },

  removeClasses: function(){
    for (var i=0; i < model.currentPiece.positions.length; i++) {
      $('#' + model.currentPiece.positions[i]).removeClass(model.currentPiece.color);
      model.gameboard[model.currentPiece.positions[i]] = '';
    }
  },

  addClasses: function(divIdsToMoveTo){
    for (var i=0; i < divIdsToMoveTo.length; i++) {
      $('#' + divIdsToMoveTo[i]).addClass(model.currentPiece.color);
      model.gameboard[divIdsToMoveTo[i]] = model.currentPiece;
    }
  },

  makeMove: function(){
    view.removeClasses();
    var divIdsToMoveTo = view.newPieceDiv();
    view.addClasses(divIdsToMoveTo);
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
    var divIdsToMoveTo = [];
    var moveID = 0;
    switch (this.currentDirection) {
      case 'left' :
        var doNotMove = false;
        for (var m = 0; m < model.currentPiece.positions.length; m++){
          var currentDivID = model.currentPiece.positions[m];
          if (currentDivID%10 === 0){ doNotMove = true; }
        }

        if(!doNotMove) {
          for (var l = 0; l < model.currentPiece.positions.length; l++){
            moveID = (model.currentPiece.positions[l] - 1 + view.step);
            divIdsToMoveTo.push(moveID);
          }
        } else {
          for (var p = 0; p < model.currentPiece.positions.length; p++){
          moveID = model.currentPiece.positions[p] + view.step;
          divIdsToMoveTo.push(moveID);
          }
        }
        break;

      case 'right' :
        var doNotMove = false;
        for (var m = 0; m < model.currentPiece.positions.length; m++){
          var currentDivID = model.currentPiece.positions[m];
          if (currentDivID%10 === 9){ doNotMove = true; }
        }

        if(!doNotMove) {
          for (var l = 0; l < model.currentPiece.positions.length; l++){
            moveID = (model.currentPiece.positions[l] + 1 + view.step);
            divIdsToMoveTo.push(moveID);
          }
        } else {
          for (var p = 0; p < model.currentPiece.positions.length; p++){
          moveID = model.currentPiece.positions[p] + view.step;
          divIdsToMoveTo.push(moveID);
          }
        }
        break;

      case 'down':
        for (var j = 0; j < model.currentPiece.positions.length; j++){
          moveID = model.currentPiece.positions[j] + view.step*3;
          divIdsToMoveTo.push(moveID);
        }
        break;

      case 'rotate_left':
        model.rotatePiece();
        divIdsToMoveTo = model.currentPiece.positions;
        break;

      case 'rotate_right':
        model.rotatePiece();
        divIdsToMoveTo = model.currentPiece.positions;
        break;

      default:
        for (var k = 0; k < model.currentPiece.positions.length; k++){
          moveID = model.currentPiece.positions[k] + view.step;
          divIdsToMoveTo.push(moveID);
        }
    }
    this.currentDirection = '38';
    console.log(divIdsToMoveTo);
    return divIdsToMoveTo;
  },

  userMove: {
    37: 'left',
    39: 'right',
    40: 'down',
    81: 'rotate_left',
    87: 'rotate_right'
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
    }, 400 / controller.level);
  },

  setDifficultyLevel: function(){
    controller.level = prompt("Select difficulty: Enter 1 for easy, 2 for difficult");
  }

};

$(document).ready(function(){controller.init();});
