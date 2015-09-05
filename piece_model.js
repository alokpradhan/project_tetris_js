var Tetris = Tetris || {};

Tetris.Piece = (function(){

// ------ Generate pieces randomly ------

  var create = function(){
    var num = Math.floor(Math.random() * 7);
    // var num = Math.floor(Math.random() * 1);
    // var pieces = [_T];
    var pieces = [_Square, _Line, _T,
                  _RightL, _LeftL,
                  _LeftS, _RightS];
    return new pieces[num]();
  };

  var addColor = function(){
    var colors = ['blue','red','green','yellow'];
    return colors[Math.floor(Math.random()*4)];
  };

// ------ Piece constructors ------

    var _Square = function(){
    this.positions = [5,6,15,16]; // id of element
    this.color = addColor();
    this.structure = [0,0,0,0];
    this.rotated = false;
    this.active = true;
  };

  var _LeftS = function(){
    this.positions = [5,15,16,26]; // id of element
    this.color = addColor();
    this.structure = [11,0,9,-2];
    this.reverse = [-11,0,-9,2];
    this.rotated = false;
    this.active = true;
  };

  var _RightS = function(){
    this.positions = [5,15,14,24]; // id of element
    this.color = addColor();
    this.structure = [9,0,11,2];
    this.reverse = [-9,0,-11,-2];
    this.rotated = false;
    this.active = true;
  };

  var _Line = function(){
    this.positions = [5,6,7,8]; // id of element
    this.color = addColor();
    this.structure = [-9,0,9,18];
    this.reverse = [9,0,-9,-18];
    this.rotated = false;
    this.active = true;
  };

  var _LeftL = function(){
    this.positions = [5,6,7,17]; // id of element
    this.color = addColor();
    this.structure = [-18,-9,0,-11];
    this.reverse = [18,9,0,11];
    this.rotated = false;
    this.active = true;
  };

  var _RightL = function(){
    this.positions = [15,5,6,7]; // id of element
    this.color = addColor();
    this.structure = [2,11,0,-11]; // [11,20,9,-2];
    this.reverse = [-2,-11,0,11]; // [-10,-1,-10,19];
    this.rotated = false;
    this.active = true;
  };

  var _T = function(){
    this.positions = [5,6,7,16]; // id of element
    this.color = addColor();
    this.structure = [2,11,20,0];
    this.reverse = [-2,-11,-20,0];
    this.left_rotate = [20,9,-2,0];
    this.left_reverse = [-20,-9,2,0];
    this.rotated = false;
    this.active = true;
  };

  var rotate = function(piece, direction){
    console.log(piece);
    for(var i = 0; i < piece.positions.length; i++){
      if (!piece.rotated){
        piece.positions[i] += piece.structure[i];
        console.log('rotating');
      } else {
        piece.positions[i] += piece.reverse[i];
        console.log('reversing');

      }
    }
    piece.rotated = piece.rotated ? false : true;
  };

  return {
    create: create,
    rotate: rotate
  };

})();