exports.format = function(percentage) {
  if (percentage>50) {
    return ":fire: "+percentage+"%\n";
  } else if (percentage < 0) {
    return ":triangular_flag_on_post: "+(0-percentage)+"%\n";
  } else {
    return ":flag_white: "+percentage+"%\n";
  }
}
