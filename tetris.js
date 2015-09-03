
// --------- Model -----------

var model = (function(){
  var gameboard =  {};
  // pieceQueue = [];
  var currentPiece = '';
  var divsToDestroy = [];

  var init = function(){
    createGameBoard();
  };

  var createGameBoard = function(){
    for (var i = 0; i < controller.gridSize; i++){
      model.gameboard[i] = "";
    }
    model.currentPiece = createPiece();
    model.currentPiece.positions.forEach(function(el){
      model.gameboard[el] = model.currentPiece;
    });
    model.gameboard[model.currentPiece.positons] = model.currentPiece;
  };

  var getGameBoard = function(){
    return gameboard;
  };

  var setGameBoard = function(i, object){
    gameboard[i] = object;
  };

  var getCurrentPiece = function(){
    return currentPiece;
  };

  var createPiece = function(){
    var num = Math.floor(Math.random() * 7);
    // var num = Math.floor(Math.random() * 1);
    // var pieces = ["RightHandLFactory"];
    var pieces = [SquareFactory, LineFactory, TFactory,
                  RightHandLFactory, LeftHandLFactory,
                  LeftSFactory, RightSFactory];
    return new pieces[num]();
  };

  // addPieceToQueue = function(){
  //   model.pieceQueue.push(model.createPiece());
  // },

  var colorPiece = function(){
    var colors = ['blue','red','green','yellow'];
    return colors[Math.floor(Math.random()*4)];
  };

  var newCurrentPiece = function(){
    model.currentPiece = createPiece();
    for(var i=0; i < model.currentPiece.positions; i++){
      model.gameboard[model.currentPiece.positons[i]] = model.currentPiece;
    }
  };

  var stopPieceMovement = function(){
    model.currentPiece.active = false;
    newCurrentPiece();
  };

  var checkAndDestroyLine = function(){
    var row_full = false;
    for(var i = controller.gridSize-1; i >= 0; i-=view.step){
      row_full = true;
      divsToDestroy = []
      for(var j = i; j > i - view.step; j--){
        divsToDestroy.push(j);
        if (model.gameboard[j] === ''){row_full = false;}
      }
      if (row_full){destroyLine();}
    }
  };

  var destroyLine = function(){
      for(var i=0; i < view.step; i++){
        deleteDiv = divsToDestroy[i];
        while (deleteDiv-view.step > 0) {
          model.gameboard[deleteDiv] = model.gameboard[deleteDiv-view.step];
          deleteDiv = deleteDiv-view.step;
        }
      }
  };

  var SquareFactory = function(){
    this.positions = [5,6,15,16]; // id of element
    this.shape = 'square';
    this.color = colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 6;
    this.active = true;
  };

  var LeftSFactory = function(){
    this.positions = [5,15,16,26]; // id of element
    this.shape = 'left_s';
    this.color = colorPiece();
    this.structure = [11,0,9,-2];
    this.reverse = [11,0,9,-2];
    this.rorated = false;
    // this.pivot = 15;
    this.active = true;
  };

  var RightSFactory = function(){
    this.positions = [5,15,14,24]; // id of element
    this.shape = 'right_s';
    this.color = colorPiece();
    this.structure = [9,0,11,2];
    this.reverse = [9,0,11,2];
    this.rorated = false;
    // this.pivot = 15;
    this.active = true;
  };

  var LineFactory = function(){
    this.positions = [5,6,7,8]; // id of element
    this.shape = 'line';
    this.color = colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 8;
    this.active = true;
  };

  var LeftHandLFactory = function(){
    this.positions = [5,6,7,17]; // id of element
    this.shape = 'left_l';
    this.color = colorPiece();
    this.structure = [-18,-9,0,-11];
    this.pivot = 7;
    this.active = true;
  };

  var RightHandLFactory = function(){
    this.positions = [15,5,6,7]; // id of element
    this.shape = 'right_l';
    this.color = colorPiece();
    this.structure = [11,20,9,-2];
    this.reverse = [2,9,20,-9]; // [-10,-1,-10,19];
    this.rorated = false;
    this.pivot = 5;
    this.active = true;
  };

  var TFactory = function(){
    this.positions = [5,6,7,16]; // id of element
    this.shape = 't';
    this.color = colorPiece();
    this.structure = [1,1,1,1];
    this.pivot = 6;
    this.active = true;
  };

  var rotatePiece = function(direction){
    for(var i = 0; i < model.currentPiece.positions.length; i++){
      if (!model.currentPiece.rotated){
        model.currentPiece.positions[i] += model.currentPiece.structure[i];
      } else {
        model.currentPiece.positions[i] -= model.currentPiece.structure[i];
      }
    }
    model.currentPiece.rotated = model.currentPiece.rotated ? false : true;
  };

  return {
    init: init,
    gameboard: gameboard,
    currentPiece: currentPiece,
    checkAndDestroyLine: checkAndDestroyLine,
    stopPieceMovement: stopPieceMovement,
    rotatePiece: rotatePiece
  };

})();

// --------- View -----------

var view = (function(){

  var currentDirection = '';
  var step = 10;

  var init = function(gridSize){
    initializeGrid(gridSize);
    initializePiece();
    setDirectionListener();
  };

  var initializeGrid = function(gridSize){
    for(var i=1; i <= gridSize; i++){
      $('#gameboard').append('<div class="cell" id="'+(i-1)+'"></div>');
      console.log(gridSize);
      if (i % 10 === 0){
        $('#gameboard').append('<br>');
      }
    }
  };

  var initializePiece = function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      $('#'+ model.currentPiece.positions[i]).addClass(model.currentPiece.color);
    }
  };

  var setDirectionListener = function(){
    $(document).keydown(function(event){
      setPieceDirection(event);
    });
  };

  var updatePieces = function(){
    moveActivePieces();
    destoryStaticPieces();
  };

  var renderGameboard = function(){
    for (var i = 0; i < controller.gridSize; i++){
      if (model.gameboard[i] !== ''){
        var piece = model.gameboard[i];
        $("#" + i).addClass(piece.color);
      } else {
        $("#" + i).removeClass('green').removeClass('blue').removeClass('yellow').removeClass('red');
      }
    }
  };

  var testIfBrick = function(div){
    return $('#' + (div)).hasClass("blue") || $('#' + (div)).hasClass("yellow") ||
           $('#' + (div)).hasClass("red")  || $('#' + (div)).hasClass("green");
  };

  var moveActivePieces = function(){
    checkMovements();
    makeMove();
    destoryStaticPieces();
  };

  var checkMovements = function(){
    for (var i = 0; i < model.currentPiece.positions.length; i++){
      var currentID = model.currentPiece.positions[i];
      if (currentID + step > 199 ||
        testIfBrick(currentID + step) &&
        !(model.gameboard[currentID + step].active)
        ){
        model.stopPieceMovement();
      } else {
        if (currentID + step + step > 199 ||
            testIfBrick(currentID + step + step) ||
            testIfBrick(currentID + step + 1) && !(model.gameboard[currentID + step + 1].active) ||
            testIfBrick(currentID + step - 1) && !(model.gameboard[currentID + step - 1].active)
            ) {
          currentDirection = '38';
        }
      }
    }
  };

  var removeClasses = function(){
    for (var i=0; i < model.currentPiece.positions.length; i++) {
      $('#' + model.currentPiece.positions[i]).removeClass(model.currentPiece.color);
      model.gameboard[model.currentPiece.positions[i]] = '';
    }
  };

  var addClasses = function(divIdsToMoveTo){
    for (var i=0; i < divIdsToMoveTo.length; i++) {
      $('#' + divIdsToMoveTo[i]).addClass(model.currentPiece.color);
      model.gameboard[divIdsToMoveTo[i]] = model.currentPiece;
    }
  };

  var makeMove = function(){
    removeClasses();
    var divIdsToMoveTo = newPieceDiv();
    addClasses(divIdsToMoveTo);
    model.currentPiece.positions = divIdsToMoveTo;
  };

  var destoryStaticPieces = function(){
    model.checkAndDestroyLine();
    renderGameboard();
  };

  var setPieceDirection = function(event){
    currentDirection = userMove[event.which];
  };

  var newPieceDiv = function() {
    var divIdsToMoveTo = [];
    var moveID, currentDivID;
    var doNotMove = false;
    switch (currentDirection) {
      case 'left':
        for (var m = 0; m < model.currentPiece.positions.length; m++){
          currentDivID = model.currentPiece.positions[m];
          if (currentDivID%10 === 0){ doNotMove = true; }
        }

        if(!doNotMove) {
          for (var l = 0; l < model.currentPiece.positions.length; l++){
            moveID = (model.currentPiece.positions[l] - 1 + step);
            divIdsToMoveTo.push(moveID);
          }
        } else {
          for (var p = 0; p < model.currentPiece.positions.length; p++){
          moveID = model.currentPiece.positions[p] + step;
          divIdsToMoveTo.push(moveID);
          }
        }
        break;

      case 'right':
        for (var t = 0; t < model.currentPiece.positions.length; t++){
          currentDivID = model.currentPiece.positions[t];
          if (currentDivID%10 === 9){ doNotMove = true; }
        }

        if(!doNotMove) {
          for (var u = 0; u < model.currentPiece.positions.length; u++){
            moveID = (model.currentPiece.positions[u] + 1 + step);
            divIdsToMoveTo.push(moveID);
          }
        } else {
          for (var q = 0; q < model.currentPiece.positions.length; q++){
          moveID = model.currentPiece.positions[q] + step;
          divIdsToMoveTo.push(moveID);
          }
        }
        break;

      case 'down':
        for (var j = 0; j < model.currentPiece.positions.length; j++){
          moveID = model.currentPiece.positions[j] + step*3;
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
          moveID = model.currentPiece.positions[k] + step;
          divIdsToMoveTo.push(moveID);
        }
    }
    currentDirection = '38';
    console.log(divIdsToMoveTo);
    return divIdsToMoveTo;
  };

  var userMove = {
    37: 'left',
    39: 'right',
    40: 'down',
    81: 'rotate_left',
    87: 'rotate_right'
  };

  return {
    init: init,
    updatePieces: updatePieces
  };

})();

// --------- Controller -----------

var controller = (function(){

  var gridSize = 200;
  var level = 1;

  init = function(){
    setDifficultyLevel();
    model.init();
    view.init(controller.gridSize);
    gameLoop();
  };

  var gameLoop = function(){
    window.gameLoop = window.setInterval(function(){
      view.updatePieces();
    }, 400 / level);
  };

  var setDifficultyLevel = function(){
    controller.level = prompt("Select difficulty: Enter 1 for easy, 2 for difficult");
  };

  return {
    init: init,
    gridSize: gridSize
  };

})();

$(document).ready(function(){controller.init();});
