const capitaliseFirstLetter = string => {
  if (!string || string === undefined) return 'None';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.CFL = capitaliseFirstLetter;
