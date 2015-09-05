var Tetris = Tetris || {};

Tetris.View = (function(State, Piece, User, $){

  var _currentDirection = '';
  var _step = 10;
  var _gridSize = 0;

// ------ Initialize game view ------

  var init = function(gridSize){
    _initializeGrid(gridSize);
    _setPiece();
    _setDirectionListener();
    _setScore();
  };

  var _initializeGrid = function(size){
    for(var i=1; i <= size; i++){
      $('#gameboard').append('<div class="cell" id="'+(i-1)+'"></div>');
      if (i % 10 === 0){
        $('#gameboard').append('<br>');
      }
      if (i <= 40){
        $('.cell').addClass('transparent');
      }
    }
    _gridSize = size;
  };

  var _setScore = function(){
    $('#score').text(User.getScore());
  };

  var _setPiece = function(){
    var currentPiece = State.getCurrentPiece();
    for (var i = 0; i < currentPiece.positions.length; i++){
      $('#'+ currentPiece.positions[i]).addClass(currentPiece.color);
    }
  };

  var _setDirectionListener = function(){
    $(document).keydown(function(event){
      console.log('triggering listener');
      _setPieceDirection(event);
    });
  };

// ------ Update pieces in game ------

  var updatePieces = function(){
    _destoryStaticPieces();
    _moveActivePieces();
    _setScore();
  };

  var _moveActivePieces = function(){
    // _destoryStaticPieces();
    _checkMovements();
    _makeMove();
  };

  var _makeMove = function(){
    _removeClasses();
    var divIdsToMoveTo = _newPieceDiv();
    // console.log(divIdsToMoveTo);
    State.setCurrentPiece(divIdsToMoveTo);
    _addClasses(divIdsToMoveTo);
  };

  var _destoryStaticPieces = function(){
    State.checkAndDestroyLine(_step);
    _renderGameboard();
  };

  var _renderGameboard = function(){
    var gameboard = State.getGameboard();
    for (var i = 0; i < _gridSize; i++){
      if (gameboard[i] !== ''){
        $("#" + i).addClass(gameboard[i].color);
      } else {
        $("#" + i).removeClass('green blue yellow red');
      }
    }
  };

  var _removeClasses = function(){
    var piece = State.getCurrentPiece();
    for (var i=0; i < piece.positions.length; i++) {
      $('#' + piece.positions[i]).removeClass(piece.color);
      State.setGameboard(piece.positions[i], '');
    }
  };

  var _addClasses = function(divIdsToMoveTo){
    var piece = State.getCurrentPiece();
    for (var i=0; i < divIdsToMoveTo.length; i++) {
      $('#' + divIdsToMoveTo[i]).addClass(piece.color);
      State.setGameboard(divIdsToMoveTo[i], piece);
    }
  };

// ------ Move validations in game ------

  var _testIfBrick = function(div){
    return $('#' + (div)).hasClass("blue") || $('#' + (div)).hasClass("yellow") ||
           $('#' + (div)).hasClass("red")  || $('#' + (div)).hasClass("green");
  };

  var _checkMovements = function(){
    var piece = State.getCurrentPiece();
    var gameboard = State.getGameboard();
    for (var i = 0; i < piece.positions.length; i++){
      var currentID = State.getCurrentPiece().positions[i];
      if (currentID + _step > _gridSize ||
        _testIfBrick(currentID + _step) && !(gameboard[currentID + _step].active)
        // || _testIfBrick(currentID + 1) && !(gameboard[currentID + 1].active) ||
        // _testIfBrick(currentID - 1) && !(gameboard[currentID - 1].active)
        ){
        State.stopPieceMovement();
      } else {
        _slowDownBeforeCollision(currentID, gameboard);
      }
    }
  };

  var _slowDownBeforeCollision = function(currentID, gameboard){
    var piece = State.getCurrentPiece();
    if (currentID + _step*3 > _gridSize ||
        _testIfBrick(currentID + _step*3)   && !(gameboard[currentID + _step*3].active)   ||
        _testIfBrick(currentID + _step + 1) && !(gameboard[currentID + _step + 1].active) ||
        _testIfBrick(currentID + _step - 1) && !(gameboard[currentID + _step - 1].active)
        ) {
          _currentDirection = '38';
        }
  };


// ------ Get user input on direction ------

  var _setPieceDirection = function(event){
    _currentDirection = _userMove[event.which];
    // console.log(_currentDirection);
  };

  var _userMove = {
    37: 'left',
    39: 'right',
    40: 'down',
    81: 'rotate_left',
    87: 'rotate_right'
  };


// ------ Calculate divs to move to ------

  var _newPieceDiv = function() {
    var divIdsToMoveTo = [];
    var piece = State.getCurrentPiece();
    var moveID, currentDivID;

    switch (_currentDirection) {
      case 'left':
        divIdsToMoveTo = _leftRightMoveDivIDS(0, -1);
        break;
      case 'right':
        divIdsToMoveTo = _leftRightMoveDivIDS(9, 1);
        break;
      case 'down':
        for (var j = 0; j < piece.positions.length; j++){
          moveID = piece.positions[j] + _step*3;
          divIdsToMoveTo.push(moveID);
        }
        break;
      case 'rotate_left':
        console.log('rotating left');
        Piece.rotate(piece);
        divIdsToMoveTo = piece.positions;
        break;
      case 'rotate_right':
        console.log('rotating right');
        Piece.rotate(piece);
        divIdsToMoveTo = piece.positions;
        break;
      default:
        for (var k = 0; k < piece.positions.length; k++){
          moveID = piece.positions[k] + _step;
          divIdsToMoveTo.push(moveID);
        }
    }
    _currentDirection = '38';
    return divIdsToMoveTo;
  };

  var _leftRightMoveDivIDS = function(gridSideID, positionStep){
    var piece = State.getCurrentPiece();
    var divIdsToMoveTo = [];
    var doNotMove = false;

    for (var t = 0; t < piece.positions.length; t++){
      currentDivID = piece.positions[t];
      if (currentDivID%10 === gridSideID){ doNotMove = true; }
    }
    if(!doNotMove) {
      for (var u = 0; u < piece.positions.length; u++){
        moveID = (piece.positions[u] + positionStep + _step);
        divIdsToMoveTo.push(moveID);
      }
    } else {
      for (var q = 0; q < piece.positions.length; q++){
      moveID = piece.positions[q] + _step;
      divIdsToMoveTo.push(moveID);
      }
    }
    return divIdsToMoveTo;
  };

  return {
    init: init,
    updatePieces: updatePieces
  };

})(Tetris.State, Tetris.Piece, Tetris.User, $);