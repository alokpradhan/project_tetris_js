var Tetris = Tetris || {};

Tetris.User = (function(){

  var score = 0;
  var level = 0;
  var allFinalScores = [];

  var getPosition = function(){
    allFinalScores.sort(function(a,b){return b-a;});
    allFinalScores.indexof(score);
  };

  var setFinalScore = function(){
    setFinalScore.push(score);
  };

  var getScore = function(){
    return score;
  };

  var setScore = function(){
    score+=10;
  };

  var getLevel = function(){
    return level;
  };

  var setLevel = function(input){
    level = input;
  };

  return {
    getScore: getScore,
    setScore: setScore,
    getLevel: getLevel,
    setLevel: setLevel
  };

})();