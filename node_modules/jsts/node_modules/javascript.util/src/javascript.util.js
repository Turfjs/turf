var javascript = {};
javascript.util = {};
javascript.util.version = '0.10.0';

javascript.util.ArrayList = require('./ArrayList');
javascript.util.Arrays = require('./Arrays');
javascript.util.Collection = require('./Collection');
javascript.util.EmptyStackException = require('./EmptyStackException');
javascript.util.HashMap = require('./HashMap');
javascript.util.IndexOutOfBoundsException = require('./IndexOutOfBoundsException');
javascript.util.Iterator = require('./Iterator');
javascript.util.List = require('./List');
javascript.util.Map = require('./Map');
javascript.util.NoSuchElementException = require('./NoSuchElementException');
javascript.util.OperationNotSupported = require('./OperationNotSupported');
javascript.util.Set = require('./Set');
javascript.util.HashSet = require('./HashSet');
javascript.util.SortedMap = require('./SortedMap');
javascript.util.SortedSet = require('./SortedSet');
javascript.util.Stack = require('./Stack');
javascript.util.TreeMap = require('./TreeMap');
javascript.util.TreeSet = require('./TreeSet');

// assume this script is run in a function with context as first argument
this['javascript'] = javascript;
var g;
if (typeof window !== 'undefined') {
    g = window;
} else {
    g = global;
}
g.javascript = javascript;
