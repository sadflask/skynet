exports.format = function(percentage) {
  if (percentage>50) {
    return ":fire: "+percentage+"%\n";
  } else if (percentage < 0 || isNaN(percentage)) {
    return ":triangular_flag_on_post: "+(0-percentage)+"%\n";
  } else {
    return ":flag_white: "+percentage+"%\n";
  }
}
exports.formatChange = function(change) {
  if (change>0) {
    return " (+"+change+" uses) ";
  } else {
    return " ("+change+" uses) ";
  }
}
exports.longFormat = function(number, numPlaces) {
  let lessThanZero = (number < 0);

  let numberAsString = Math.abs(Math.round(number))+'';
  if(!isFinite(number)) {
    //if number is NaN it will be either infinite or 0/0
    if(number>50) { //Is infinite
      numberAsString = '∞';
    } else {
      numberAsString = '-';
    }
    //Pad with spaces
    let numSpaces = numPlaces-1;
    for(var i=0;i<numSpaces;i++) {
      numberAsString += " ";
    }
    return "\`"+numberAsString+"%\`";
  }
  //Pad with 0's

  let numZeros = numPlaces-numberAsString.length;
  if(lessThanZero) { numZeros--}
  for(var i=0;i<numZeros;i++) {
    numberAsString = "0"+numberAsString;
  }
  if(lessThanZero) {
    numberAsString = "-"+numberAsString;
  }
  return "\`"+numberAsString+"%\`";

}
exports.round = function(number) {

}
