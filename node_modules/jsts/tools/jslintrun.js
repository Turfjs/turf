load('json2.js');
load('jslint.js');

var input=read(path);

var result = JSLINT(input);

if (result) quit();

print('----- FILE  :  '+ path +' -----');
for (key in JSLINT.errors) {
  if (!JSLINT.errors.hasOwnProperty(key)) continue;
  var error = JSLINT.errors[key];
  if (error === null) continue;
  if (error.reason === 'Use a named parameter.') continue;
  /*
  line      : The line (relative to 0) at which the lint was found
  character : The character (relative to 0) at which the lint was found
  reason    : The problem
  evidence  : The text line in which the problem occurred
  raw       : The raw message before the details were inserted
  a         : The first detail
  b         : The second detail
  c         : The third detail
  d         : The fourth detail
  */
  print('Line: ' + error.line + ' Char: ' + error.character + ' Reason: ' + error.reason);
}
