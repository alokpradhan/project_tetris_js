
// --------- Model -----------

var pieceModel = (function(){

  var create = function(){
    var num = Math.floor(Math.random() * 7);
    // var num = Math.floor(Math.random() * 1);
    // var pieces = ["RightHandLFactory"];
    var pieces = [SquareFactory, LineFactory, TFactory,
                  RightHandLFactory, LeftHandLFactory,
                  LeftSFactory, RightSFactory];
    return new pieces[num]();
  };

  var addColor = function(){
    var colors = ['blue','red','green','yellow'];
    return colors[Math.floor(Math.random()*4)];
  };

    var SquareFactory = function(){
    this.positions = [5,6,15,16]; // id of element
    // this.shape = 'square';
    this.color = addColor();
    this.structure = [1,1,1,1];
    // this.pivot = 6;
    this.active = true;
  };

  var LeftSFactory = function(){
    this.positions = [5,15,16,26]; // id of element
    // this.shape = 'left_s';
    this.color = addColor();
    this.structure = [11,0,9,-2];
    this.reverse = [11,0,9,-2];
    this.rotated = false;
    this.pivot = 15;
    this.active = true;
  };

  var RightSFactory = function(){
    this.positions = [5,15,14,24]; // id of element
    // this.shape = 'right_s';
    this.color = addColor();
    this.structure = [9,0,11,2];
    this.reverse = [9,0,11,2];
    this.rotated = false;
    // this.pivot = 15;
    this.active = true;
  };

  var LineFactory = function(){
    this.positions = [5,6,7,8]; // id of element
    // this.shape = 'line';
    this.color = addColor();
    this.structure = [1,1,1,1];
    // this.pivot = 8;
    this.active = true;
  };

  var LeftHandLFactory = function(){
    this.positions = [5,6,7,17]; // id of element
    // this.shape = 'left_l';
    this.color = addColor();
    this.structure = [-18,-9,0,-11];
    // this.pivot = 7;
    this.active = true;
  };

  var RightHandLFactory = function(){
    this.positions = [15,5,6,7]; // id of element
    // this.shape = 'right_l';
    this.color = addColor();
    this.structure = [11,20,9,-2];
    this.reverse = [2,9,20,-9]; // [-10,-1,-10,19];
    this.rotated = false;
    // this.pivot = 5;
    this.active = true;
  };

  var TFactory = function(){
    this.positions = [5,6,7,16]; // id of element
    // this.shape = 't';
    this.color = addColor();
    this.structure = [1,1,1,1];
    // this.pivot = 6;
    this.active = true;
  };

  var rotate = function(piece, direction){
    console.log(piece);
    for(var i = 0; i < piece.positions.length; i++){
      if (!piece.rotated){
        piece.positions[i] += piece.structure[i];
      } else {
        piece.positions[i] -= piece.structure[i];
      }
    }
    piece.rotated = piece.rotated ? false : true;
  };

  return {
    create: create,
    rotate: rotate
  };

})();

var gameStateModel = (function(pieceModel, $){

  var gameboard =  {};
  var divsToDestroy = [];
  var currentPiece = '';
  // pieceQueue = [];
  // addPieceToQueue = function(){
  //   pieceModel.pieceQueue.push(pieceModel.createPiece());
  // },

  var init = function(){
    createGameboard();
  };

  var createGameboard = function(){
    for (var i = 0; i < controller.gridSize; i++){
      gameboard[i] = "";
    }
    currentPiece = pieceModel.create();
    currentPiece.positions.forEach(function(el){
      gameboard[el] = currentPiece;
    });
    gameboard[currentPiece.positons] = currentPiece;
  };

  var getGameboard = function(){
    return gameboard;
  };

  var setGameboard = function(position, piece){
    gameboard[position] = piece;
  };

  var getCurrentPiece = function(){
    return currentPiece;
  };

  var newCurrentPiece = function(){
    currentPiece = pieceModel.create();
    for(var i=0; i < currentPiece.positions; i++){
      gameboard[currentPiece.positons[i]] = currentPiece;
    }
  };

  var stopPieceMovement = function(){
    currentPiece.active = false;
    newCurrentPiece();
  };

  var checkAndDestroyLine = function(){
    var row_full = false;
    for(var i = controller.gridSize-1; i >= 0; i-=view.step){
      row_full = true;
      divsToDestroy = [];
      for(var j = i; j > i - view.step; j--){
        divsToDestroy.push(j);
        if (gameboard[j] === ''){row_full = false;}
      }
      if (row_full){destroyLine();}
    }
  };

  var destroyLine = function(){
      for(var i=0; i < view.step; i++){
        deleteDiv = divsToDestroy[i];
        while (deleteDiv-view.step > 0) {
          gameboard[deleteDiv] = gameboard[deleteDiv-view.step];
          deleteDiv = deleteDiv-view.step;
        }
      }
  };

  return {
    init: init,
    setGameboard: setGameboard,
    getGameboard: getGameboard,
    getCurrentPiece: getCurrentPiece,
    checkAndDestroyLine: checkAndDestroyLine,
    stopPieceMovement: stopPieceMovement,
  };

})(pieceModel, $);

// --------- View -----------

var view = (function(gameStateModel, $){

  var currentDirection = '';
  var step = 10;

  var init = function(gridSize){
    initializeGrid(gridSize);
    setPiece();
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

  var setPiece = function(){
    var currentPiece = gameStateModel.getCurrentPiece();
    for (var i = 0; i < currentPiece.positions.length; i++){
      $('#'+ currentPiece.positions[i]).addClass(currentPiece.color);
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
      if (gameStateModel.getGameboard()[i] !== ''){
        var piece = gameStateModel.getGameboard()[i];
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
    var piece = gameStateModel.getCurrentPiece();
    var gameboard = gameStateModel.getGameboard();
    for (var i = 0; i < piece.positions.length; i++){
      var currentID = gameStateModel.getCurrentPiece().positions[i];
      if (currentID + step > 199 ||
        testIfBrick(currentID + step) &&
        !(gameboard[currentID + step].active)
        ){
        gameStateModel.stopPieceMovement();
      } else {
        slowDownBeforeCollision(currentID, gameboard);
      }
    }
  };

  var slowDownBeforeCollision = function(currentID, gameboard){
    if (currentID + step + step > 199 ||
        testIfBrick(currentID + step + step) ||
        testIfBrick(currentID + step + 1) &&
        !(gameboard[currentID + step + 1].active) ||
        testIfBrick(currentID + step - 1) &&
        !(gameboard[currentID + step - 1].active)
        ) {
          currentDirection = '38';
        }
  };

  var removeClasses = function(){
    var piece = gameStateModel.getCurrentPiece();
    for (var i=0; i < piece.positions.length; i++) {
      $('#' + piece.positions[i]).removeClass(piece.color);
      gameStateModel.setGameboard(piece.positions[i], '');
    }
  };

  var addClasses = function(divIdsToMoveTo){
    var piece = gameStateModel.getCurrentPiece();
    for (var i=0; i < divIdsToMoveTo.length; i++) {
      $('#' + divIdsToMoveTo[i]).addClass(piece.color);
      gameStateModel.setGameboard(divIdsToMoveTo[i], piece);
    }
  };

  var makeMove = function(){
    removeClasses();
    var divIdsToMoveTo = newPieceDiv();
    addClasses(divIdsToMoveTo);
    gameStateModel.getCurrentPiece().positions = divIdsToMoveTo;
  };

  var destoryStaticPieces = function(){
    gameStateModel.checkAndDestroyLine();
    renderGameboard();
  };

  var setPieceDirection = function(event){
    currentDirection = userMove[event.which];
  };

  var newPieceDiv = function() {
    var divIdsToMoveTo = [];
    var piece = gameStateModel.getCurrentPiece();
    var moveID, currentDivID;

    switch (currentDirection) {
      case 'left':
        divIdsToMoveTo = leftRightMoveDivIDS(0, -1);
        break;

      case 'right':
        divIdsToMoveTo = leftRightMoveDivIDS(9, 1);
        break;

      case 'down':
        for (var j = 0; j < piece.positions.length; j++){
          moveID = piece.positions[j] + step*3;
          divIdsToMoveTo.push(moveID);
        }
        break;

      case 'rotate_left':
        pieceModel.rotate(piece);
        divIdsToMoveTo = piece.positions;
        break;

      case 'rotate_right':
        pieceModel.rotate(piece);
        divIdsToMoveTo = piece.positions;
        break;

      default:
        for (var k = 0; k < piece.positions.length; k++){
          moveID = piece.positions[k] + step;
          divIdsToMoveTo.push(moveID);
        }
    }
    currentDirection = '38';
    console.log(divIdsToMoveTo);
    return divIdsToMoveTo;
  };


  var leftRightMoveDivIDS = function(gridSideID, positionStep){
    var piece = gameStateModel.getCurrentPiece();
    var divIdsToMoveTo = [];
    var doNotMove = false;

    for (var t = 0; t < piece.positions.length; t++){
      currentDivID = piece.positions[t];
      if (currentDivID%10 === gridSideID){ doNotMove = true; }
    }
    if(!doNotMove) {
      for (var u = 0; u < piece.positions.length; u++){
        moveID = (piece.positions[u] + positionStep + step);
        divIdsToMoveTo.push(moveID);
      }
    } else {
      for (var q = 0; q < piece.positions.length; q++){
      moveID = piece.positions[q] + step;
      divIdsToMoveTo.push(moveID);
      }
    }
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

})(gameStateModel, $);

// --------- Controller -----------

var controller = (function(){

  var gridSize = 200;
  var level = 1;

  init = function(){
    setDifficultyLevel();
    gameStateModel.init();
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
