(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Model = F5(
	function (bestResult, score, hp, hero, food) {
		return {bestResult: bestResult, food: food, hero: hero, hp: hp, score: score};
	});
var $author$project$Main$Dessert = {$: 'Dessert'};
var $author$project$Main$FastFood = {$: 'FastFood'};
var $author$project$Main$Food = F5(
	function (id, name, tags, picture, widget) {
		return {id: id, name: name, picture: picture, tags: tags, widget: widget};
	});
var $author$project$Main$Healthy = {$: 'Healthy'};
var $author$project$Main$NotHealthy = {$: 'NotHealthy'};
var $author$project$Main$Sweets = {$: 'Sweets'};
var $author$project$Main$FadeOutFadeIn = function (a) {
	return {$: 'FadeOutFadeIn', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Property = F2(
	function (a, b) {
		return {$: 'Property', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Spring = function (a) {
	return {$: 'Spring', a: a};
};
var $mdgriffith$elm_style_animation$Animation$initMotion = F2(
	function (position, unit) {
		return {
			interpolation: $mdgriffith$elm_style_animation$Animation$Model$Spring(
				{damping: 26, stiffness: 170}),
			interpolationOverride: $elm$core$Maybe$Nothing,
			position: position,
			target: position,
			unit: unit,
			velocity: 0
		};
	});
var $mdgriffith$elm_style_animation$Animation$custom = F3(
	function (name, value, unit) {
		return A2(
			$mdgriffith$elm_style_animation$Animation$Model$Property,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, value, unit));
	});
var $mdgriffith$elm_style_animation$Animation$opacity = function (val) {
	return A3($mdgriffith$elm_style_animation$Animation$custom, 'opacity', val, '');
};
var $mdgriffith$elm_style_animation$Animation$Length = F2(
	function (a, b) {
		return {$: 'Length', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Px = {$: 'Px'};
var $mdgriffith$elm_style_animation$Animation$px = function (myPx) {
	return A2($mdgriffith$elm_style_animation$Animation$Length, myPx, $mdgriffith$elm_style_animation$Animation$Px);
};
var $mdgriffith$elm_style_animation$Animation$Model$Animation = function (a) {
	return {$: 'Animation', a: a};
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $mdgriffith$elm_style_animation$Animation$initialState = function (current) {
	return $mdgriffith$elm_style_animation$Animation$Model$Animation(
		{
			interruption: _List_Nil,
			running: false,
			steps: _List_Nil,
			style: current,
			timing: {
				current: $elm$time$Time$millisToPosix(0),
				dt: $elm$time$Time$millisToPosix(0)
			}
		});
};
var $mdgriffith$elm_style_animation$Animation$Model$Easing = function (a) {
	return {$: 'Easing', a: a};
};
var $elm$core$Basics$pi = _Basics_pi;
var $mdgriffith$elm_style_animation$Animation$Model$AtSpeed = function (a) {
	return {$: 'AtSpeed', a: a};
};
var $mdgriffith$elm_style_animation$Animation$speed = function (speedValue) {
	return $mdgriffith$elm_style_animation$Animation$Model$AtSpeed(speedValue);
};
var $mdgriffith$elm_style_animation$Animation$defaultInterpolationByProperty = function (prop) {
	var linear = function (duration) {
		return $mdgriffith$elm_style_animation$Animation$Model$Easing(
			{duration: duration, ease: $elm$core$Basics$identity, progress: 1, start: 0});
	};
	var defaultSpring = $mdgriffith$elm_style_animation$Animation$Model$Spring(
		{damping: 26, stiffness: 170});
	switch (prop.$) {
		case 'ExactProperty':
			return defaultSpring;
		case 'ColorProperty':
			return linear(
				$elm$time$Time$millisToPosix(400));
		case 'ShadowProperty':
			return defaultSpring;
		case 'Property':
			return defaultSpring;
		case 'Property2':
			return defaultSpring;
		case 'Property3':
			var name = prop.a;
			return (name === 'rotate3d') ? $mdgriffith$elm_style_animation$Animation$speed(
				{perSecond: $elm$core$Basics$pi}) : defaultSpring;
		case 'Property4':
			return defaultSpring;
		case 'AngleProperty':
			return $mdgriffith$elm_style_animation$Animation$speed(
				{perSecond: $elm$core$Basics$pi});
		case 'Points':
			return defaultSpring;
		default:
			return defaultSpring;
	}
};
var $mdgriffith$elm_style_animation$Animation$Model$AngleProperty = F2(
	function (a, b) {
		return {$: 'AngleProperty', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ColorProperty = F5(
	function (a, b, c, d, e) {
		return {$: 'ColorProperty', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ExactProperty = F2(
	function (a, b) {
		return {$: 'ExactProperty', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Path = function (a) {
	return {$: 'Path', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Points = function (a) {
	return {$: 'Points', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Property2 = F3(
	function (a, b, c) {
		return {$: 'Property2', a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property3 = F4(
	function (a, b, c, d) {
		return {$: 'Property3', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property4 = F5(
	function (a, b, c, d, e) {
		return {$: 'Property4', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ShadowProperty = F3(
	function (a, b, c) {
		return {$: 'ShadowProperty', a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc = function (a) {
	return {$: 'AntiClockwiseArc', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc = function (a) {
	return {$: 'ClockwiseArc', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Close = {$: 'Close'};
var $mdgriffith$elm_style_animation$Animation$Model$Curve = function (a) {
	return {$: 'Curve', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$CurveTo = function (a) {
	return {$: 'CurveTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Horizontal = function (a) {
	return {$: 'Horizontal', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo = function (a) {
	return {$: 'HorizontalTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Line = F2(
	function (a, b) {
		return {$: 'Line', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$LineTo = F2(
	function (a, b) {
		return {$: 'LineTo', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Move = F2(
	function (a, b) {
		return {$: 'Move', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$MoveTo = F2(
	function (a, b) {
		return {$: 'MoveTo', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Quadratic = function (a) {
	return {$: 'Quadratic', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo = function (a) {
	return {$: 'QuadraticTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Smooth = function (a) {
	return {$: 'Smooth', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic = function (a) {
	return {$: 'SmoothQuadratic', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo = function (a) {
	return {$: 'SmoothQuadraticTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothTo = function (a) {
	return {$: 'SmoothTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Vertical = function (a) {
	return {$: 'Vertical', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$VerticalTo = function (a) {
	return {$: 'VerticalTo', a: a};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $mdgriffith$elm_style_animation$Animation$Model$mapPathMotion = F2(
	function (fn, cmd) {
		var mapCoords = function (coords) {
			return A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return _Utils_Tuple2(
						fn(x),
						fn(y));
				},
				coords);
		};
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					fn(m1),
					fn(m2));
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					fn(m1),
					fn(m2));
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					fn(m1),
					fn(m2));
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					fn(m1),
					fn(m2));
			case 'Horizontal':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					fn(motion));
			case 'HorizontalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					fn(motion));
			case 'Vertical':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					fn(motion));
			case 'VerticalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					fn(motion));
			case 'Curve':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						control1: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						control2: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'CurveTo':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						control1: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						control2: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'Quadratic':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						control: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'QuadraticTo':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						control: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'SmoothQuadratic':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					mapCoords(coords));
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					mapCoords(coords));
			case 'Smooth':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					mapCoords(coords));
			case 'SmoothTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					mapCoords(coords));
			case 'ClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					function () {
						var y = arc.y;
						var x = arc.x;
						var startAngle = arc.startAngle;
						var radius = arc.radius;
						var endAngle = arc.endAngle;
						return _Utils_update(
							arc,
							{
								endAngle: fn(endAngle),
								radius: fn(radius),
								startAngle: fn(startAngle),
								x: fn(x),
								y: fn(y)
							});
					}());
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					function () {
						var y = arc.y;
						var x = arc.x;
						var startAngle = arc.startAngle;
						var radius = arc.radius;
						var endAngle = arc.endAngle;
						return _Utils_update(
							arc,
							{
								endAngle: fn(endAngle),
								radius: fn(radius),
								startAngle: fn(startAngle),
								x: fn(x),
								y: fn(y)
							});
					}());
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$mapToMotion = F2(
	function (fn, prop) {
		switch (prop.$) {
			case 'ExactProperty':
				var name = prop.a;
				var value = prop.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 'ColorProperty':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return A5(
					$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
					name,
					fn(m1),
					fn(m2),
					fn(m3),
					fn(m4));
			case 'ShadowProperty':
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				var size = shadow.size;
				var red = shadow.red;
				var offsetY = shadow.offsetY;
				var offsetX = shadow.offsetX;
				var green = shadow.green;
				var blur = shadow.blur;
				var blue = shadow.blue;
				var alpha = shadow.alpha;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
					name,
					inset,
					{
						alpha: fn(alpha),
						blue: fn(blue),
						blur: fn(blur),
						green: fn(green),
						offsetX: fn(offsetX),
						offsetY: fn(offsetY),
						red: fn(red),
						size: fn(size)
					});
			case 'Property':
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Property,
					name,
					fn(m1));
			case 'Property2':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$Property2,
					name,
					fn(m1),
					fn(m2));
			case 'Property3':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				return A4(
					$mdgriffith$elm_style_animation$Animation$Model$Property3,
					name,
					fn(m1),
					fn(m2),
					fn(m3));
			case 'Property4':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return A5(
					$mdgriffith$elm_style_animation$Animation$Model$Property4,
					name,
					fn(m1),
					fn(m2),
					fn(m3),
					fn(m4));
			case 'AngleProperty':
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
					name,
					fn(m1));
			case 'Points':
				var ms = prop.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Points(
					A2(
						$elm$core$List$map,
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return _Utils_Tuple2(
								fn(x),
								fn(y));
						},
						ms));
			default:
				var cmds = prop.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Path(
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_style_animation$Animation$Model$mapPathMotion(fn),
						cmds));
		}
	});
var $mdgriffith$elm_style_animation$Animation$setDefaultInterpolation = function (prop) {
	var interp = $mdgriffith$elm_style_animation$Animation$defaultInterpolationByProperty(prop);
	return A2(
		$mdgriffith$elm_style_animation$Animation$Model$mapToMotion,
		function (m) {
			return _Utils_update(
				m,
				{interpolation: interp});
		},
		prop);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $mdgriffith$elm_style_animation$Animation$Render$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					var $temp$predicate = predicate,
						$temp$list = xs;
					predicate = $temp$predicate;
					list = $temp$list;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Render$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				if (!list.b) {
					return $elm$core$List$reverse(memo);
				} else {
					var x = list.a;
					var xs = list.b;
					if (predicate(x)) {
						var $temp$memo = A2($elm$core$List$cons, x, memo),
							$temp$list = xs;
						memo = $temp$memo;
						list = $temp$list;
						continue takeWhileMemo;
					} else {
						return $elm$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(_List_Nil);
};
var $mdgriffith$elm_style_animation$Animation$Render$span = F2(
	function (p, xs) {
		return _Utils_Tuple2(
			A2($mdgriffith$elm_style_animation$Animation$Render$takeWhile, p, xs),
			A2($mdgriffith$elm_style_animation$Animation$Render$dropWhile, p, xs));
	});
var $mdgriffith$elm_style_animation$Animation$Render$groupWhile = F2(
	function (eq, xs_) {
		if (!xs_.b) {
			return _List_Nil;
		} else {
			var x = xs_.a;
			var xs = xs_.b;
			var _v1 = A2(
				$mdgriffith$elm_style_animation$Animation$Render$span,
				eq(x),
				xs);
			var ys = _v1.a;
			var zs = _v1.b;
			return A2(
				$elm$core$List$cons,
				A2($elm$core$List$cons, x, ys),
				A2($mdgriffith$elm_style_animation$Animation$Render$groupWhile, eq, zs));
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $mdgriffith$elm_style_animation$Animation$Model$propertyName = function (prop) {
	switch (prop.$) {
		case 'ExactProperty':
			var name = prop.a;
			return name;
		case 'ColorProperty':
			var name = prop.a;
			return name;
		case 'ShadowProperty':
			var name = prop.a;
			return name;
		case 'Property':
			var name = prop.a;
			return name;
		case 'Property2':
			var name = prop.a;
			return name;
		case 'Property3':
			var name = prop.a;
			return name;
		case 'Property4':
			var name = prop.a;
			return name;
		case 'AngleProperty':
			var name = prop.a;
			return name;
		case 'Points':
			return 'points';
		default:
			return 'path';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$isTransformation = function (prop) {
	return A2(
		$elm$core$List$member,
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
		_List_fromArray(
			['rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d', 'translate', 'translate3d', 'scale', 'scale3d']));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $mdgriffith$elm_style_animation$Animation$Render$warnForDoubleListedProperties = function (props) {
	var _v0 = A2(
		$elm$core$List$map,
		function (propGroup) {
			var _v1 = $elm$core$List$head(propGroup);
			if (_v1.$ === 'Nothing') {
				return '';
			} else {
				var name = _v1.a;
				return ($elm$core$List$length(propGroup) > 1) ? '' : '';
			}
		},
		A2(
			$mdgriffith$elm_style_animation$Animation$Render$groupWhile,
			$elm$core$Basics$eq,
			$elm$core$List$sort(
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName,
					A2(
						$elm$core$List$filter,
						function (prop) {
							return !$mdgriffith$elm_style_animation$Animation$Render$isTransformation(prop);
						},
						props)))));
	return props;
};
var $mdgriffith$elm_style_animation$Animation$style = function (props) {
	return $mdgriffith$elm_style_animation$Animation$initialState(
		A2(
			$elm$core$List$map,
			$mdgriffith$elm_style_animation$Animation$setDefaultInterpolation,
			$mdgriffith$elm_style_animation$Animation$Render$warnForDoubleListedProperties(props)));
};
var $mdgriffith$elm_style_animation$Animation$length2 = F3(
	function (name, _v0, _v1) {
		var val = _v0.a;
		var len = _v0.b;
		var val2 = _v1.a;
		var len2 = _v1.b;
		return A3(
			$mdgriffith$elm_style_animation$Animation$Model$Property2,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, val, len),
			A2($mdgriffith$elm_style_animation$Animation$initMotion, val2, len2));
	});
var $mdgriffith$elm_style_animation$Animation$lengthUnitName = function (unit) {
	switch (unit.$) {
		case 'NoUnit':
			return '';
		case 'Px':
			return 'px';
		case 'Percent':
			return '%';
		case 'Rem':
			return 'rem';
		case 'Em':
			return 'em';
		case 'Ex':
			return 'ex';
		case 'Ch':
			return 'ch';
		case 'Vh':
			return 'vh';
		case 'Vw':
			return 'vw';
		case 'Vmin':
			return 'vmin';
		case 'Vmax':
			return 'vmax';
		case 'Mm':
			return 'mm';
		case 'Cm':
			return 'cm';
		case 'In':
			return 'in';
		case 'Pt':
			return 'pt';
		default:
			return 'pc';
	}
};
var $mdgriffith$elm_style_animation$Animation$translate = F2(
	function (_v0, _v1) {
		var valX = _v0.a;
		var len1 = _v0.b;
		var valY = _v1.a;
		var len2 = _v1.b;
		return A3(
			$mdgriffith$elm_style_animation$Animation$length2,
			'translate',
			_Utils_Tuple2(
				valX,
				$mdgriffith$elm_style_animation$Animation$lengthUnitName(len1)),
			_Utils_Tuple2(
				valY,
				$mdgriffith$elm_style_animation$Animation$lengthUnitName(len2)));
	});
var $author$project$Main$wrapAnimation = function (i) {
	return {
		onClick: $author$project$Main$FadeOutFadeIn(i),
		state: $mdgriffith$elm_style_animation$Animation$style(
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_style_animation$Animation$translate,
					$mdgriffith$elm_style_animation$Animation$px(0),
					$mdgriffith$elm_style_animation$Animation$px(0)),
					$mdgriffith$elm_style_animation$Animation$opacity(1)
				]))
	};
};
var $author$project$Main$defaultFood = A5(
	$author$project$Main$Food,
	0,
	'Popcorn',
	_List_fromArray(
		[$author$project$Main$NotHealthy]),
	'../images/food/popcorn.png',
	$author$project$Main$wrapAnimation(0));
var $author$project$Main$allFood = _List_fromArray(
	[
		$author$project$Main$defaultFood,
		A5(
		$author$project$Main$Food,
		1,
		'Happy Meal',
		_List_fromArray(
			[$author$project$Main$FastFood, $author$project$Main$NotHealthy]),
		'../images/food/happymeal.png',
		$author$project$Main$wrapAnimation(1)),
		A5(
		$author$project$Main$Food,
		2,
		'Pizza',
		_List_fromArray(
			[$author$project$Main$NotHealthy]),
		'../images/food/pizza.png',
		$author$project$Main$wrapAnimation(2)),
		A5(
		$author$project$Main$Food,
		3,
		'Tiramisu',
		_List_fromArray(
			[$author$project$Main$Dessert, $author$project$Main$Sweets]),
		'../images/food/chocolatecake.png',
		$author$project$Main$wrapAnimation(3)),
		A5(
		$author$project$Main$Food,
		4,
		'Salad',
		_List_fromArray(
			[$author$project$Main$Healthy]),
		'../images/food/salad.png',
		$author$project$Main$wrapAnimation(4))
	]);
var $author$project$Main$Hero = F6(
	function (id, name, desc, picture, goodTags, badTags) {
		return {badTags: badTags, desc: desc, goodTags: goodTags, id: id, name: name, picture: picture};
	});
var $author$project$Main$Junk = {$: 'Junk'};
var $author$project$Main$arnold = A6(
	$author$project$Main$Hero,
	1,
	'Arnold',
	'Eat all the trash and junk. Never touch normal food.',
	'../images/hero/arnold.png',
	_List_fromArray(
		[$author$project$Main$Junk]),
	_List_fromArray(
		[$author$project$Main$Healthy]));
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		A5($author$project$Main$Model, $elm$core$Maybe$Nothing, 0, 3, $author$project$Main$arnold, $author$project$Main$allFood),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$Animate = function (a) {
	return {$: 'Animate', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $mdgriffith$elm_style_animation$Animation$isRunning = function (_v0) {
	var model = _v0.a;
	return model.running;
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $mdgriffith$elm_style_animation$Animation$subscription = F2(
	function (msg, states) {
		return A2($elm$core$List$any, $mdgriffith$elm_style_animation$Animation$isRunning, states) ? A2(
			$elm$core$Platform$Sub$map,
			msg,
			$elm$browser$Browser$Events$onAnimationFrame($mdgriffith$elm_style_animation$Animation$Model$Tick)) : $elm$core$Platform$Sub$none;
	});
var $author$project$Main$subscriptions = function (model) {
	return A2(
		$mdgriffith$elm_style_animation$Animation$subscription,
		$author$project$Main$Animate,
		A2(
			$elm$core$List$map,
			function ($) {
				return $.state;
			},
			A2(
				$elm$core$List$map,
				function ($) {
					return $.widget;
				},
				model.food)));
};
var $author$project$Main$BestResult = F2(
	function (name, score) {
		return {name: name, score: score};
	});
var $author$project$Main$Eat = function (a) {
	return {$: 'Eat', a: a};
};
var $author$project$Main$GameOver = {$: 'GameOver'};
var $author$project$Main$KeepPlaying = {$: 'KeepPlaying'};
var $author$project$Main$Shuffle = function (a) {
	return {$: 'Shuffle', a: a};
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$calcEat = F2(
	function (model, tags) {
		var h = model.hero;
		var points = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (a) {
					return A2(
						$elm$core$List$any,
						function (b) {
							return _Utils_eq(b, a);
						},
						tags);
				},
				h.goodTags));
		var damage = $elm$core$List$isEmpty(
			A2(
				$elm$core$List$filter,
				function (a) {
					return A2(
						$elm$core$List$any,
						function (b) {
							return _Utils_eq(b, a);
						},
						tags);
				},
				h.badTags)) ? 0 : 1;
		return _Utils_Tuple2(points, damage);
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$extractInitialWait = function (steps) {
	var _v0 = $elm$core$List$head(steps);
	if (_v0.$ === 'Nothing') {
		return _Utils_Tuple2(
			$elm$time$Time$millisToPosix(0),
			_List_Nil);
	} else {
		var step = _v0.a;
		if (step.$ === 'Wait') {
			var till = step.a;
			var _v2 = $mdgriffith$elm_style_animation$Animation$extractInitialWait(
				A2($elm$core$List$drop, 1, steps));
			var additionalTime = _v2.a;
			var remainingSteps = _v2.b;
			return _Utils_Tuple2(
				$elm$time$Time$millisToPosix(
					$elm$time$Time$posixToMillis(till) + $elm$time$Time$posixToMillis(additionalTime)),
				remainingSteps);
		} else {
			return _Utils_Tuple2(
				$elm$time$Time$millisToPosix(0),
				steps);
		}
	}
};
var $mdgriffith$elm_style_animation$Animation$interrupt = F2(
	function (steps, _v0) {
		var model = _v0.a;
		return $mdgriffith$elm_style_animation$Animation$Model$Animation(
			_Utils_update(
				model,
				{
					interruption: A2(
						$elm$core$List$cons,
						$mdgriffith$elm_style_animation$Animation$extractInitialWait(steps),
						model.interruption),
					running: true
				}));
	});
var $author$project$Main$Dairy = {$: 'Dairy'};
var $author$project$Main$Eggs = {$: 'Eggs'};
var $author$project$Main$Fruits = {$: 'Fruits'};
var $author$project$Main$Meat = {$: 'Meat'};
var $author$project$Main$chuck = A6(
	$author$project$Main$Hero,
	3,
	'Chuck',
	'Eat plant-based foods and dairy products, but not eggs.',
	'../images/hero/chuck.png',
	_List_fromArray(
		[$author$project$Main$Healthy, $author$project$Main$Dairy, $author$project$Main$Fruits]),
	_List_fromArray(
		[$author$project$Main$Meat, $author$project$Main$FastFood, $author$project$Main$Eggs]));
var $author$project$Main$terry = A6(
	$author$project$Main$Hero,
	2,
	'Terry',
	'Fast-food and unheathly food lover. Vomit for desserts.',
	'../images/hero/terry.png',
	_List_fromArray(
		[$author$project$Main$Meat, $author$project$Main$FastFood, $author$project$Main$NotHealthy]),
	_List_fromArray(
		[$author$project$Main$Dessert, $author$project$Main$Sweets]));
var $author$project$Main$nextHero = function (hero) {
	var _v0 = hero.id;
	switch (_v0) {
		case 1:
			return $author$project$Main$terry;
		case 2:
			return $author$project$Main$chuck;
		default:
			return $author$project$Main$arnold;
	}
};
var $author$project$Main$onState = F2(
	function (stateFn, food) {
		var widget = food.widget;
		return _Utils_update(
			food,
			{
				widget: _Utils_update(
					widget,
					{
						state: stateFn(widget.state)
					})
			});
	});
var $author$project$Main$onWidgetsState = F2(
	function (model, fn) {
		return _Utils_update(
			model,
			{
				food: A2(
					$elm$core$List$map,
					$author$project$Main$onState(fn),
					model.food)
			});
	});
var $author$project$Main$selectBestResult = F2(
	function (current, next) {
		if (current.$ === 'Just') {
			var br = current.a;
			return (_Utils_cmp(br.score, next.score) > 0) ? $elm$core$Maybe$Just(br) : $elm$core$Maybe$Just(next);
		} else {
			return (!next.score) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(next);
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$Send = function (a) {
	return {$: 'Send', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Messenger$send = function (msg) {
	return $mdgriffith$elm_style_animation$Animation$Model$Send(msg);
};
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				var _v1 = genA(seed);
				var result = _v1.a;
				var newSeed = _v1.b;
				var _v2 = callback(result);
				var genB = _v2.a;
				return genB(newSeed);
			});
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $author$project$Main$extractValueHelper = F3(
	function (values, index, accumulator) {
		var _v0 = _Utils_Tuple2(index, values);
		if (!_v0.b.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!_v0.a) {
				var _v1 = _v0.b;
				var head = _v1.a;
				var tail = _v1.b;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(
						head,
						A2(
							$elm$core$List$append,
							$elm$core$List$reverse(accumulator),
							tail)));
			} else {
				var _v2 = _v0.b;
				var head = _v2.a;
				var tail = _v2.b;
				return A3(
					$author$project$Main$extractValueHelper,
					tail,
					index - 1,
					A2($elm$core$List$cons, head, accumulator));
			}
		}
	});
var $author$project$Main$extractValue = F2(
	function (values, index) {
		return A3($author$project$Main$extractValueHelper, values, index, _List_Nil);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var seed1 = $elm$random$Random$next(seed0);
				var range = $elm$core$Basics$abs(b - a);
				var n1 = $elm$random$Random$peel(seed1);
				var n0 = $elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					$elm$random$Random$next(seed1));
			});
	});
var $elm$random$Random$getByWeight = F3(
	function (_v0, others, countdown) {
		getByWeight:
		while (true) {
			var weight = _v0.a;
			var value = _v0.b;
			if (!others.b) {
				return value;
			} else {
				var second = others.a;
				var otherOthers = others.b;
				if (_Utils_cmp(
					countdown,
					$elm$core$Basics$abs(weight)) < 1) {
					return value;
				} else {
					var $temp$_v0 = second,
						$temp$others = otherOthers,
						$temp$countdown = countdown - $elm$core$Basics$abs(weight);
					_v0 = $temp$_v0;
					others = $temp$others;
					countdown = $temp$countdown;
					continue getByWeight;
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$random$Random$weighted = F2(
	function (first, others) {
		var normalize = function (_v0) {
			var weight = _v0.a;
			return $elm$core$Basics$abs(weight);
		};
		var total = normalize(first) + $elm$core$List$sum(
			A2($elm$core$List$map, normalize, others));
		return A2(
			$elm$random$Random$map,
			A2($elm$random$Random$getByWeight, first, others),
			A2($elm$random$Random$float, 0, total));
	});
var $author$project$Main$shuffle = F2(
	function (defaultA, values) {
		if (!values.b) {
			return A2(
				$elm$random$Random$map,
				function (_v1) {
					return _List_Nil;
				},
				A2(
					$elm$random$Random$weighted,
					_Utils_Tuple2(80, true),
					_List_fromArray(
						[
							_Utils_Tuple2(20, false)
						])));
		} else {
			var vals = values;
			var randomIndexGenerator = A2(
				$elm$random$Random$int,
				0,
				$elm$core$List$length(vals) - 1);
			var extractAndRecurse = function (index) {
				var _v2 = function () {
					var _v3 = A2($author$project$Main$extractValue, vals, index);
					if (_v3.$ === 'Nothing') {
						return _Utils_Tuple2(defaultA, _List_Nil);
					} else {
						var a = _v3.a;
						return a;
					}
				}();
				var randomHead = _v2.a;
				var remainder = _v2.b;
				var remainderGen = A2($author$project$Main$shuffle, defaultA, remainder);
				return A2(
					$elm$random$Random$map,
					function (randomTail) {
						return A2($elm$core$List$cons, randomHead, randomTail);
					},
					remainderGen);
			};
			return A2($elm$random$Random$andThen, extractAndRecurse, randomIndexGenerator);
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$To = function (a) {
	return {$: 'To', a: a};
};
var $mdgriffith$elm_style_animation$Animation$to = function (props) {
	return $mdgriffith$elm_style_animation$Animation$Model$To(props);
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_style_animation$Animation$Model$refreshTiming = F2(
	function (now, timing) {
		var dt = $elm$time$Time$posixToMillis(now) - $elm$time$Time$posixToMillis(timing.current);
		return {
			current: now,
			dt: ((dt > 34) || (!$elm$time$Time$posixToMillis(timing.current))) ? $elm$time$Time$millisToPosix(
				$elm$core$Basics$round(16.666)) : $elm$time$Time$millisToPosix(dt)
		};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Repeat = F2(
	function (a, b) {
		return {$: 'Repeat', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Step = {$: 'Step'};
var $mdgriffith$elm_style_animation$Animation$Model$Wait = function (a) {
	return {$: 'Wait', a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $mdgriffith$elm_style_animation$Animation$Model$isCmdDone = function (cmd) {
	var motionDone = function (motion) {
		return (!motion.velocity) && _Utils_eq(motion.position, motion.target);
	};
	switch (cmd.$) {
		case 'Move':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'MoveTo':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'Line':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'LineTo':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'Horizontal':
			var motion = cmd.a;
			return motionDone(motion);
		case 'HorizontalTo':
			var motion = cmd.a;
			return motionDone(motion);
		case 'Vertical':
			var motion = cmd.a;
			return motionDone(motion);
		case 'VerticalTo':
			var motion = cmd.a;
			return motionDone(motion);
		case 'Curve':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 'CurveTo':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 'Quadratic':
			var control = cmd.a.control;
			var point = cmd.a.point;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 'QuadraticTo':
			var control = cmd.a.control;
			var point = cmd.a.point;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 'SmoothQuadratic':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'SmoothQuadraticTo':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v2) {
					var x = _v2.a;
					var y = _v2.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'Smooth':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'SmoothTo':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v4) {
					var x = _v4.a;
					var y = _v4.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'ClockwiseArc':
			var arc = cmd.a;
			return motionDone(arc.x) && (motionDone(arc.y) && (motionDone(arc.radius) && (motionDone(arc.startAngle) && motionDone(arc.endAngle))));
		case 'AntiClockwiseArc':
			var arc = cmd.a;
			return motionDone(arc.x) && (motionDone(arc.y) && (motionDone(arc.radius) && (motionDone(arc.startAngle) && motionDone(arc.endAngle))));
		default:
			return true;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$isDone = function (property) {
	var motionDone = function (motion) {
		var runningInterpolation = A2($elm$core$Maybe$withDefault, motion.interpolation, motion.interpolationOverride);
		switch (runningInterpolation.$) {
			case 'Spring':
				return (!motion.velocity) && _Utils_eq(motion.position, motion.target);
			case 'Easing':
				var eased = runningInterpolation.a;
				return (eased.progress === 1) || ((!eased.progress) && _Utils_eq(motion.position, motion.target));
			default:
				var speed = runningInterpolation.a;
				return _Utils_eq(motion.position, motion.target);
		}
	};
	switch (property.$) {
		case 'ExactProperty':
			return true;
		case 'ColorProperty':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 'ShadowProperty':
			var shadow = property.c;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[shadow.offsetX, shadow.offsetY, shadow.size, shadow.blur, shadow.red, shadow.green, shadow.blue, shadow.alpha]));
		case 'Property':
			var m1 = property.b;
			return motionDone(m1);
		case 'Property2':
			var m1 = property.b;
			var m2 = property.c;
			return motionDone(m1) && motionDone(m2);
		case 'Property3':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3]));
		case 'Property4':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 'AngleProperty':
			var m1 = property.b;
			return motionDone(m1);
		case 'Points':
			var ms = property.a;
			return A2(
				$elm$core$List$all,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return motionDone(x) && motionDone(y);
				},
				ms);
		default:
			var cmds = property.a;
			return A2($elm$core$List$all, $mdgriffith$elm_style_animation$Animation$Model$isCmdDone, cmds);
	}
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $mdgriffith$elm_style_animation$Animation$Model$matchPoints = F2(
	function (points1, points2) {
		var diff = $elm$core$List$length(points1) - $elm$core$List$length(points2);
		if (diff > 0) {
			var _v0 = $elm$core$List$head(
				$elm$core$List$reverse(points2));
			if (_v0.$ === 'Nothing') {
				return _Utils_Tuple2(points1, points2);
			} else {
				var last2 = _v0.a;
				return _Utils_Tuple2(
					points1,
					_Utils_ap(
						points2,
						A2(
							$elm$core$List$repeat,
							$elm$core$Basics$abs(diff),
							last2)));
			}
		} else {
			if (diff < 0) {
				var _v1 = $elm$core$List$head(
					$elm$core$List$reverse(points1));
				if (_v1.$ === 'Nothing') {
					return _Utils_Tuple2(points1, points2);
				} else {
					var last1 = _v1.a;
					return _Utils_Tuple2(
						_Utils_ap(
							points1,
							A2(
								$elm$core$List$repeat,
								$elm$core$Basics$abs(diff),
								last1)),
						points2);
				}
			} else {
				return _Utils_Tuple2(points1, points2);
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$setPathTarget = F2(
	function (cmd, targetCmd) {
		var setMotionTarget = F2(
			function (motion, targetMotion) {
				var _v27 = motion.interpolation;
				if (_v27.$ === 'Easing') {
					var ease = _v27.a;
					return _Utils_update(
						motion,
						{
							interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								_Utils_update(
									ease,
									{start: motion.position})),
							target: targetMotion.position
						});
				} else {
					return _Utils_update(
						motion,
						{target: targetMotion.position});
				}
			});
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'Move') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Move,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'MoveTo') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'Line') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Line,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'LineTo') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$LineTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'Horizontal':
				var m1 = cmd.a;
				if (targetCmd.$ === 'Horizontal') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'HorizontalTo':
				var m1 = cmd.a;
				if (targetCmd.$ === 'HorizontalTo') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'Vertical':
				var m1 = cmd.a;
				if (targetCmd.$ === 'Vertical') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'VerticalTo':
				var m1 = cmd.a;
				if (targetCmd.$ === 'VerticalTo') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'Curve':
				var points = cmd.a;
				if (targetCmd.$ === 'Curve') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Curve(
						{
							control1: _Utils_Tuple2(
								A2(setMotionTarget, points.control1.a, targets.control1.a),
								A2(setMotionTarget, points.control1.b, targets.control1.b)),
							control2: _Utils_Tuple2(
								A2(setMotionTarget, points.control2.a, targets.control2.a),
								A2(setMotionTarget, points.control2.b, targets.control2.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'CurveTo':
				var points = cmd.a;
				if (targetCmd.$ === 'CurveTo') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
						{
							control1: _Utils_Tuple2(
								A2(setMotionTarget, points.control1.a, targets.control1.a),
								A2(setMotionTarget, points.control1.b, targets.control1.b)),
							control2: _Utils_Tuple2(
								A2(setMotionTarget, points.control2.a, targets.control2.a),
								A2(setMotionTarget, points.control2.b, targets.control2.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'Quadratic':
				var points = cmd.a;
				if (targetCmd.$ === 'Quadratic') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
						{
							control: _Utils_Tuple2(
								A2(setMotionTarget, points.control.a, targets.control.a),
								A2(setMotionTarget, points.control.b, targets.control.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'QuadraticTo':
				var points = cmd.a;
				if (targetCmd.$ === 'QuadraticTo') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
						{
							control: _Utils_Tuple2(
								A2(setMotionTarget, points.control.a, targets.control.a),
								A2(setMotionTarget, points.control.b, targets.control.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'SmoothQuadratic':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothQuadratic') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v14, _v15) {
									var x1 = _v14.a;
									var y1 = _v14.b;
									var x2 = _v15.a;
									var y2 = _v15.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothQuadraticTo') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v17, _v18) {
									var x1 = _v17.a;
									var y1 = _v17.b;
									var x2 = _v18.a;
									var y2 = _v18.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'Smooth':
				var coords = cmd.a;
				if (targetCmd.$ === 'Smooth') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v20, _v21) {
									var x1 = _v20.a;
									var y1 = _v20.b;
									var x2 = _v21.a;
									var y2 = _v21.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'SmoothTo':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothTo') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v23, _v24) {
									var x1 = _v23.a;
									var y1 = _v23.b;
									var x2 = _v24.a;
									var y2 = _v24.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'ClockwiseArc':
				var arc = cmd.a;
				if (targetCmd.$ === 'ClockwiseArc') {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
						function () {
							var y = arc.y;
							var x = arc.x;
							var startAngle = arc.startAngle;
							var radius = arc.radius;
							var endAngle = arc.endAngle;
							return _Utils_update(
								arc,
								{
									endAngle: A2(setMotionTarget, endAngle, target.endAngle),
									radius: A2(setMotionTarget, radius, target.radius),
									startAngle: A2(setMotionTarget, startAngle, target.startAngle),
									x: A2(setMotionTarget, x, target.x),
									y: A2(setMotionTarget, y, target.y)
								});
						}());
				} else {
					return cmd;
				}
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				if (targetCmd.$ === 'AntiClockwiseArc') {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
						function () {
							var y = arc.y;
							var x = arc.x;
							var startAngle = arc.startAngle;
							var radius = arc.radius;
							var endAngle = arc.endAngle;
							return _Utils_update(
								arc,
								{
									endAngle: A2(setMotionTarget, endAngle, target.endAngle),
									radius: A2(setMotionTarget, radius, target.radius),
									startAngle: A2(setMotionTarget, startAngle, target.startAngle),
									x: A2(setMotionTarget, x, target.x),
									y: A2(setMotionTarget, y, target.y)
								});
						}());
				} else {
					return cmd;
				}
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$setTarget = F3(
	function (overrideInterpolation, current, newTarget) {
		var setMotionTarget = F2(
			function (motion, targetMotion) {
				var newMotion = overrideInterpolation ? _Utils_update(
					motion,
					{
						interpolationOverride: $elm$core$Maybe$Just(targetMotion.interpolation)
					}) : motion;
				var _v13 = newMotion.interpolationOverride;
				if (_v13.$ === 'Nothing') {
					var _v14 = newMotion.interpolation;
					if (_v14.$ === 'Easing') {
						var ease = _v14.a;
						return _Utils_update(
							newMotion,
							{
								interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
									_Utils_update(
										ease,
										{progress: 0, start: motion.position})),
								target: targetMotion.position
							});
					} else {
						return _Utils_update(
							newMotion,
							{target: targetMotion.position});
					}
				} else {
					var override = _v13.a;
					if (override.$ === 'Easing') {
						var ease = override.a;
						return _Utils_update(
							newMotion,
							{
								interpolationOverride: $elm$core$Maybe$Just(
									$mdgriffith$elm_style_animation$Animation$Model$Easing(
										_Utils_update(
											ease,
											{progress: 0, start: motion.position}))),
								target: targetMotion.position
							});
					} else {
						return _Utils_update(
							newMotion,
							{target: targetMotion.position});
					}
				}
			});
		switch (current.$) {
			case 'ExactProperty':
				var name = current.a;
				var value = current.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 'ColorProperty':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 'ColorProperty') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					var t4 = newTarget.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3),
						A2(setMotionTarget, m4, t4));
				} else {
					return current;
				}
			case 'ShadowProperty':
				var name = current.a;
				var inset = current.b;
				var shadow = current.c;
				if (newTarget.$ === 'ShadowProperty') {
					var targetShadow = newTarget.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							alpha: A2(setMotionTarget, shadow.alpha, targetShadow.alpha),
							blue: A2(setMotionTarget, shadow.blue, targetShadow.blue),
							blur: A2(setMotionTarget, shadow.blur, targetShadow.blur),
							green: A2(setMotionTarget, shadow.green, targetShadow.green),
							offsetX: A2(setMotionTarget, shadow.offsetX, targetShadow.offsetX),
							offsetY: A2(setMotionTarget, shadow.offsetY, targetShadow.offsetY),
							red: A2(setMotionTarget, shadow.red, targetShadow.red),
							size: A2(setMotionTarget, shadow.size, targetShadow.size)
						});
				} else {
					return current;
				}
			case 'Property':
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 'Property') {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 'Property2':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				if (newTarget.$ === 'Property2') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$Property2,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return current;
				}
			case 'Property3':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				if (newTarget.$ === 'Property3') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					return A4(
						$mdgriffith$elm_style_animation$Animation$Model$Property3,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3));
				} else {
					return current;
				}
			case 'Property4':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 'Property4') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					var t4 = newTarget.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$Property4,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3),
						A2(setMotionTarget, m4, t4));
				} else {
					return current;
				}
			case 'AngleProperty':
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 'AngleProperty') {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 'Points':
				var currentPts = current.a;
				if (newTarget.$ === 'Points') {
					var targetPts = newTarget.a;
					var _v9 = A2($mdgriffith$elm_style_animation$Animation$Model$matchPoints, currentPts, targetPts);
					var m1s = _v9.a;
					var m2s = _v9.b;
					return $mdgriffith$elm_style_animation$Animation$Model$Points(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v10, _v11) {
									var x1 = _v10.a;
									var y1 = _v10.b;
									var x2 = _v11.a;
									var y2 = _v11.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							m1s,
							m2s));
				} else {
					return current;
				}
			default:
				var cmds = current.a;
				if (newTarget.$ === 'Path') {
					var targets = newTarget.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Path(
						A3($elm$core$List$map2, $mdgriffith$elm_style_animation$Animation$Model$setPathTarget, cmds, targets));
				} else {
					return current;
				}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$zipPropertiesGreedy = F2(
	function (initialProps, newTargetProps) {
		var propertyMatch = F2(
			function (prop1, prop2) {
				return _Utils_eq(
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop1),
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop2));
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, _v2) {
					var stackA = _v2.a;
					var stackB = _v2.b;
					var result = _v2.c;
					var _v3 = $elm$core$List$head(stackA);
					if (_v3.$ === 'Nothing') {
						return _Utils_Tuple3(stackA, stackB, result);
					} else {
						var a = _v3.a;
						var _v4 = A2(
							$elm$core$List$partition,
							propertyMatch(a),
							stackB);
						var matchingBs = _v4.a;
						var nonMatchingBs = _v4.b;
						return _Utils_Tuple3(
							A2($elm$core$List$drop, 1, stackA),
							function () {
								if (!matchingBs.b) {
									return nonMatchingBs;
								} else {
									var b = matchingBs.a;
									var remainingBs = matchingBs.b;
									return _Utils_ap(remainingBs, nonMatchingBs);
								}
							}(),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									a,
									$elm$core$List$head(matchingBs)),
								result));
					}
				}),
			_Utils_Tuple3(initialProps, newTargetProps, _List_Nil),
			A2(
				$elm$core$List$repeat,
				$elm$core$List$length(initialProps),
				0));
		var warnings = _v0.b;
		var props = _v0.c;
		var _v6 = warnings;
		return $elm$core$List$reverse(props);
	});
var $mdgriffith$elm_style_animation$Animation$Model$startTowards = F3(
	function (overrideInterpolation, current, target) {
		return A2(
			$elm$core$List$filterMap,
			function (propPair) {
				if (propPair.b.$ === 'Just') {
					var cur = propPair.a;
					var to = propPair.b.a;
					return $elm$core$Maybe$Just(
						A3($mdgriffith$elm_style_animation$Animation$Model$setTarget, overrideInterpolation, cur, to));
				} else {
					var prop = propPair.a;
					var _v1 = propPair.b;
					return $elm$core$Maybe$Just(prop);
				}
			},
			A2($mdgriffith$elm_style_animation$Animation$Model$zipPropertiesGreedy, current, target));
	});
var $mdgriffith$elm_style_animation$Animation$Model$tolerance = 0.01;
var $elm$core$Basics$truncate = _Basics_truncate;
var $mdgriffith$elm_style_animation$Animation$Model$vTolerance = 0.1;
var $mdgriffith$elm_style_animation$Animation$Model$stepInterpolation = F2(
	function (posix, motion) {
		var interpolationToUse = A2($elm$core$Maybe$withDefault, motion.interpolation, motion.interpolationOverride);
		var dtms = $elm$time$Time$posixToMillis(posix);
		switch (interpolationToUse.$) {
			case 'AtSpeed':
				var perSecond = interpolationToUse.a.perSecond;
				var _v1 = function () {
					if (_Utils_cmp(motion.position, motion.target) < 0) {
						var _new = motion.position + (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.target) > -1);
					} else {
						var _new = motion.position - (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.target) < 1);
					}
				}();
				var newPos = _v1.a;
				var finished = _v1.b;
				return finished ? _Utils_update(
					motion,
					{position: motion.target, velocity: 0.0}) : _Utils_update(
					motion,
					{position: newPos, velocity: perSecond * 1000});
			case 'Spring':
				var stiffness = interpolationToUse.a.stiffness;
				var damping = interpolationToUse.a.damping;
				var fspring = stiffness * (motion.target - motion.position);
				var fdamper = ((-1) * damping) * motion.velocity;
				var dt = dtms / 1000;
				var a = fspring + fdamper;
				var newVelocity = motion.velocity + (a * dt);
				var newPos = motion.position + (newVelocity * dt);
				var dx = $elm$core$Basics$abs(motion.target - newPos);
				return ((_Utils_cmp(dx, $mdgriffith$elm_style_animation$Animation$Model$tolerance) < 0) && (_Utils_cmp(
					$elm$core$Basics$abs(newVelocity),
					$mdgriffith$elm_style_animation$Animation$Model$vTolerance) < 0)) ? _Utils_update(
					motion,
					{position: motion.target, velocity: 0.0}) : _Utils_update(
					motion,
					{position: newPos, velocity: newVelocity});
			default:
				var progress = interpolationToUse.a.progress;
				var duration = interpolationToUse.a.duration;
				var ease = interpolationToUse.a.ease;
				var start = interpolationToUse.a.start;
				var durationMs = $elm$time$Time$posixToMillis(duration);
				var newProgress = (((dtms / durationMs) + progress) < 1) ? ((dtms / durationMs) + progress) : 1;
				var eased = ease(newProgress);
				var distance = motion.target - start;
				var newPos = ((((eased * distance) + start) * 10000) | 0) / 10000;
				var newVelocity = (newProgress === 1) ? 0 : ((newPos - motion.position) / dtms);
				var _v2 = motion.interpolationOverride;
				if (_v2.$ === 'Nothing') {
					return _Utils_update(
						motion,
						{
							interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								{duration: duration, ease: ease, progress: newProgress, start: start}),
							position: newPos,
							velocity: newVelocity
						});
				} else {
					var override = _v2.a;
					return _Utils_update(
						motion,
						{
							interpolationOverride: $elm$core$Maybe$Just(
								$mdgriffith$elm_style_animation$Animation$Model$Easing(
									{duration: duration, ease: ease, progress: newProgress, start: start})),
							position: newPos,
							velocity: newVelocity
						});
				}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$stepPath = F2(
	function (dt, cmd) {
		var stepCoords = function (coords) {
			return A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return _Utils_Tuple2(
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, x),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, y));
				},
				coords);
		};
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'Horizontal':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'HorizontalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'Vertical':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'VerticalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'Curve':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						control1: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						control2: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'CurveTo':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						control1: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						control2: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'Quadratic':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						control: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'QuadraticTo':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						control: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'SmoothQuadratic':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					stepCoords(coords));
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					stepCoords(coords));
			case 'Smooth':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					stepCoords(coords));
			case 'SmoothTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					stepCoords(coords));
			case 'ClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					_Utils_update(
						arc,
						{
							endAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.endAngle),
							radius: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.radius),
							startAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.startAngle),
							x: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.x),
							y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.y)
						}));
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					_Utils_update(
						arc,
						{
							endAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.endAngle),
							radius: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.radius),
							startAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.startAngle),
							x: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.x),
							y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.y)
						}));
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$step = F2(
	function (dt, props) {
		var stepProp = function (property) {
			switch (property.$) {
				case 'ExactProperty':
					var name = property.a;
					var value = property.b;
					return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
				case 'Property':
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 'Property2':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$Property2,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2));
				case 'Property3':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					var motion3 = property.d;
					return A4(
						$mdgriffith$elm_style_animation$Animation$Model$Property3,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion3));
				case 'Property4':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					var motion3 = property.d;
					var motion4 = property.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$Property4,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion3),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion4));
				case 'AngleProperty':
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 'ColorProperty':
					var name = property.a;
					var red = property.b;
					var green = property.c;
					var blue = property.d;
					var alpha = property.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, red),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, green),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, blue),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, alpha));
				case 'ShadowProperty':
					var name = property.a;
					var inset = property.b;
					var shadow = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							alpha: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.alpha),
							blue: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.blue),
							blur: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.blur),
							green: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.green),
							offsetX: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.offsetX),
							offsetY: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.offsetY),
							red: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.red),
							size: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.size)
						});
				case 'Points':
					var points = property.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Points(
						A2(
							$elm$core$List$map,
							function (_v1) {
								var x = _v1.a;
								var y = _v1.b;
								return _Utils_Tuple2(
									A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, x),
									A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, y));
							},
							points));
				default:
					var cmds = property.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Path(
						A2(
							$elm$core$List$map,
							$mdgriffith$elm_style_animation$Animation$Model$stepPath(dt),
							cmds));
			}
		};
		return A2($elm$core$List$map, stepProp, props);
	});
var $mdgriffith$elm_style_animation$Animation$Model$alreadyThere = F2(
	function (current, target) {
		return A2(
			$elm$core$List$all,
			$mdgriffith$elm_style_animation$Animation$Model$isDone,
			A2(
				$mdgriffith$elm_style_animation$Animation$Model$step,
				$elm$time$Time$millisToPosix(0),
				A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, false, current, target)));
	});
var $mdgriffith$elm_style_animation$Animation$Model$replaceProps = F2(
	function (props, replacements) {
		var replacementNames = A2($elm$core$List$map, $mdgriffith$elm_style_animation$Animation$Model$propertyName, replacements);
		var removed = A2(
			$elm$core$List$filter,
			function (prop) {
				return !A2(
					$elm$core$List$member,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
					replacementNames);
			},
			props);
		return _Utils_ap(removed, replacements);
	});
var $mdgriffith$elm_style_animation$Animation$Model$resolveSteps = F3(
	function (currentStyle, steps, dt) {
		resolveSteps:
		while (true) {
			var _v0 = $elm$core$List$head(steps);
			if (_v0.$ === 'Nothing') {
				return _Utils_Tuple3(currentStyle, _List_Nil, _List_Nil);
			} else {
				var currentStep = _v0.a;
				switch (currentStep.$) {
					case 'Wait':
						var n = currentStep.a;
						if ($elm$time$Time$posixToMillis(n) <= 0) {
							var $temp$currentStyle = currentStyle,
								$temp$steps = A2($elm$core$List$drop, 1, steps),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						} else {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_style_animation$Animation$Model$Wait(
										$elm$time$Time$millisToPosix(
											$elm$time$Time$posixToMillis(n) - $elm$time$Time$posixToMillis(dt))),
									A2($elm$core$List$drop, 1, steps)));
						}
					case 'Send':
						var msg = currentStep.a;
						var _v2 = A3(
							$mdgriffith$elm_style_animation$Animation$Model$resolveSteps,
							currentStyle,
							A2($elm$core$List$drop, 1, steps),
							dt);
						var newStyle = _v2.a;
						var msgs = _v2.b;
						var remainingSteps = _v2.c;
						return _Utils_Tuple3(
							newStyle,
							A2($elm$core$List$cons, msg, msgs),
							remainingSteps);
					case 'To':
						var target = currentStep.a;
						if (A2($mdgriffith$elm_style_animation$Animation$Model$alreadyThere, currentStyle, target)) {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2($elm$core$List$drop, 1, steps));
						} else {
							var $temp$currentStyle = A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, false, currentStyle, target),
								$temp$steps = A2(
								$elm$core$List$cons,
								$mdgriffith$elm_style_animation$Animation$Model$Step,
								A2($elm$core$List$drop, 1, steps)),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
					case 'ToWith':
						var target = currentStep.a;
						if (A2($mdgriffith$elm_style_animation$Animation$Model$alreadyThere, currentStyle, target)) {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2($elm$core$List$drop, 1, steps));
						} else {
							var $temp$currentStyle = A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, true, currentStyle, target),
								$temp$steps = A2(
								$elm$core$List$cons,
								$mdgriffith$elm_style_animation$Animation$Model$Step,
								A2($elm$core$List$drop, 1, steps)),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
					case 'Set':
						var props = currentStep.a;
						var $temp$currentStyle = A2($mdgriffith$elm_style_animation$Animation$Model$replaceProps, currentStyle, props),
							$temp$steps = A2($elm$core$List$drop, 1, steps),
							$temp$dt = dt;
						currentStyle = $temp$currentStyle;
						steps = $temp$steps;
						dt = $temp$dt;
						continue resolveSteps;
					case 'Step':
						var stepped = A2($mdgriffith$elm_style_animation$Animation$Model$step, dt, currentStyle);
						return A2($elm$core$List$all, $mdgriffith$elm_style_animation$Animation$Model$isDone, stepped) ? _Utils_Tuple3(
							A2(
								$elm$core$List$map,
								$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
									function (m) {
										return _Utils_update(
											m,
											{interpolationOverride: $elm$core$Maybe$Nothing});
									}),
								stepped),
							_List_Nil,
							A2($elm$core$List$drop, 1, steps)) : _Utils_Tuple3(stepped, _List_Nil, steps);
					case 'Loop':
						var substeps = currentStep.a;
						var $temp$currentStyle = currentStyle,
							$temp$steps = _Utils_ap(
							substeps,
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$Model$Loop(substeps)
								])),
							$temp$dt = dt;
						currentStyle = $temp$currentStyle;
						steps = $temp$steps;
						dt = $temp$dt;
						continue resolveSteps;
					default:
						var n = currentStep.a;
						var substeps = currentStep.b;
						if (n <= 0) {
							var $temp$currentStyle = currentStyle,
								$temp$steps = A2($elm$core$List$drop, 1, steps),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						} else {
							var $temp$currentStyle = currentStyle,
								$temp$steps = _Utils_ap(
								substeps,
								_Utils_ap(
									_List_fromArray(
										[
											A2($mdgriffith$elm_style_animation$Animation$Model$Repeat, n - 1, substeps)
										]),
									A2($elm$core$List$drop, 1, steps))),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
				}
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$updateAnimation = F2(
	function (_v0, _v1) {
		var now = _v0.a;
		var model = _v1.a;
		var timing = A2($mdgriffith$elm_style_animation$Animation$Model$refreshTiming, now, model.timing);
		var _v2 = A2(
			$elm$core$List$partition,
			function (_v4) {
				var wait = _v4.a;
				var mySteps = _v4.b;
				return $elm$time$Time$posixToMillis(wait) <= 0;
			},
			A2(
				$elm$core$List$map,
				function (_v3) {
					var wait = _v3.a;
					var mySteps = _v3.b;
					return _Utils_Tuple2(
						$elm$time$Time$millisToPosix(
							$elm$time$Time$posixToMillis(wait) - $elm$time$Time$posixToMillis(timing.dt)),
						mySteps);
				},
				model.interruption));
		var readyInterruption = _v2.a;
		var queuedInterruptions = _v2.b;
		var _v5 = function () {
			var _v6 = $elm$core$List$head(readyInterruption);
			if (_v6.$ === 'Just') {
				var _v7 = _v6.a;
				var wait = _v7.a;
				var interrupt = _v7.b;
				return _Utils_Tuple2(
					interrupt,
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
							function (m) {
								return _Utils_update(
									m,
									{interpolationOverride: $elm$core$Maybe$Nothing});
							}),
						model.style));
			} else {
				return _Utils_Tuple2(model.steps, model.style);
			}
		}();
		var steps = _v5.a;
		var style = _v5.b;
		var _v8 = A3($mdgriffith$elm_style_animation$Animation$Model$resolveSteps, style, steps, timing.dt);
		var revisedStyle = _v8.a;
		var sentMessages = _v8.b;
		var revisedSteps = _v8.c;
		return _Utils_Tuple2(
			$mdgriffith$elm_style_animation$Animation$Model$Animation(
				_Utils_update(
					model,
					{
						interruption: queuedInterruptions,
						running: (!(!$elm$core$List$length(revisedSteps))) || (!(!$elm$core$List$length(queuedInterruptions))),
						steps: revisedSteps,
						style: revisedStyle,
						timing: timing
					})),
			$elm$core$Platform$Cmd$batch(
				A2(
					$elm$core$List$map,
					function (m) {
						return A2(
							$elm$core$Task$perform,
							$elm$core$Basics$identity,
							$elm$core$Task$succeed(m));
					},
					sentMessages)));
	});
var $mdgriffith$elm_style_animation$Animation$update = F2(
	function (tick, animation) {
		return A2($mdgriffith$elm_style_animation$Animation$Model$updateAnimation, tick, animation).a;
	});
var $author$project$Main$update = F2(
	function (action, model) {
		switch (action.$) {
			case 'Eat':
				var tags = action.a;
				var hero = model.hero;
				var result = A2(
					$author$project$Main$selectBestResult,
					model.bestResult,
					A2($author$project$Main$BestResult, hero.name, model.score));
				var _v1 = A2($author$project$Main$calcEat, model, tags);
				var points = _v1.a;
				var damage = _v1.b;
				var newHp = model.hp - damage;
				var gameState = (!newHp) ? $author$project$Main$GameOver : $author$project$Main$KeepPlaying;
				if (gameState.$ === 'GameOver') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bestResult: result, hp: 3, score: 0}),
						A2(
							$elm$random$Random$generate,
							$author$project$Main$Shuffle,
							A2($author$project$Main$shuffle, $author$project$Main$defaultFood, model.food)));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{hp: newHp, score: model.score + points}),
						A2(
							$elm$random$Random$generate,
							$author$project$Main$Shuffle,
							A2($author$project$Main$shuffle, $author$project$Main$defaultFood, model.food)));
				}
			case 'Shuffle':
				var randomFood = action.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{food: randomFood}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeHero':
				var hero = model.hero;
				var result = A2(
					$author$project$Main$selectBestResult,
					model.bestResult,
					A2($author$project$Main$BestResult, hero.name, model.score));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bestResult: result,
							hero: $author$project$Main$nextHero(model.hero),
							hp: 3,
							score: 0
						}),
					A2(
						$elm$random$Random$generate,
						$author$project$Main$Shuffle,
						A2($author$project$Main$shuffle, $author$project$Main$defaultFood, model.food)));
			case 'FadeOutFadeIn':
				var i = action.a;
				var tags = function () {
					var _v3 = A2(
						$elm$core$Array$get,
						i,
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$map,
								function ($) {
									return $.tags;
								},
								$author$project$Main$allFood)));
					if (_v3.$ === 'Just') {
						var t = _v3.a;
						return t;
					} else {
						return _List_Nil;
					}
				}();
				return _Utils_Tuple2(
					A2(
						$author$project$Main$onWidgetsState,
						model,
						$mdgriffith$elm_style_animation$Animation$interrupt(
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$to(
									_List_fromArray(
										[
											$mdgriffith$elm_style_animation$Animation$opacity(0)
										])),
									$mdgriffith$elm_style_animation$Animation$Messenger$send(
									$author$project$Main$Eat(tags)),
									$mdgriffith$elm_style_animation$Animation$to(
									_List_fromArray(
										[
											$mdgriffith$elm_style_animation$Animation$opacity(1)
										]))
								]))),
					$elm$core$Platform$Cmd$none);
			default:
				var aMsg = action.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							food: A2(
								$elm$core$List$map,
								$author$project$Main$onState(
									$mdgriffith$elm_style_animation$Animation$update(aMsg)),
								model.food)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $surprisetalk$elm_bulma$Bulma$Modifiers$Large = {$: 'Large'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Light = {$: 'Light'};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $surprisetalk$elm_bulma$Bulma$Classes$container = $elm$html$Html$Attributes$class('container');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $surprisetalk$elm_bulma$Helpers$node = F3(
	function (tag, attrs_, attrs) {
		return A2(
			$elm$html$Html$node,
			tag,
			_Utils_ap(attrs, attrs_));
	});
var $surprisetalk$elm_bulma$Bulma$Layout$container = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$container]));
var $surprisetalk$elm_bulma$Bulma$Columns$Gap3 = {$: 'Gap3'};
var $surprisetalk$elm_bulma$Bulma$Elements$OneByOne = function (a) {
	return {$: 'OneByOne', a: a};
};
var $surprisetalk$elm_bulma$Bulma$Elements$Unbounded = {$: 'Unbounded'};
var $surprisetalk$elm_bulma$Bulma$Classes$column = $elm$html$Html$Attributes$class('column');
var $surprisetalk$elm_bulma$Bulma$Classes$is01Desktop = $elm$html$Html$Attributes$class('is-1-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is01FullHD = $elm$html$Html$Attributes$class('is-1-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is01Mobile = $elm$html$Html$Attributes$class('is-1-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is01Tablet = $elm$html$Html$Attributes$class('is-1-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is01Widescreen = $elm$html$Html$Attributes$class('is-1-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is02Desktop = $elm$html$Html$Attributes$class('is-2-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is02FullHD = $elm$html$Html$Attributes$class('is-2-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is02Mobile = $elm$html$Html$Attributes$class('is-2-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is02Tablet = $elm$html$Html$Attributes$class('is-2-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is02Widescreen = $elm$html$Html$Attributes$class('is-2-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is03Desktop = $elm$html$Html$Attributes$class('is-3-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is03FullHD = $elm$html$Html$Attributes$class('is-3-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is03Mobile = $elm$html$Html$Attributes$class('is-3-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is03Tablet = $elm$html$Html$Attributes$class('is-3-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is03Widescreen = $elm$html$Html$Attributes$class('is-3-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is04Desktop = $elm$html$Html$Attributes$class('is-4-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is04FullHD = $elm$html$Html$Attributes$class('is-4-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is04Mobile = $elm$html$Html$Attributes$class('is-4-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is04Tablet = $elm$html$Html$Attributes$class('is-4-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is04Widescreen = $elm$html$Html$Attributes$class('is-4-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is05Desktop = $elm$html$Html$Attributes$class('is-5-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is05FullHD = $elm$html$Html$Attributes$class('is-5-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is05Mobile = $elm$html$Html$Attributes$class('is-5-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is05Tablet = $elm$html$Html$Attributes$class('is-5-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is05Widescreen = $elm$html$Html$Attributes$class('is-5-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is06Desktop = $elm$html$Html$Attributes$class('is-6-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is06FullHD = $elm$html$Html$Attributes$class('is-6-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is06Mobile = $elm$html$Html$Attributes$class('is-6-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is06Tablet = $elm$html$Html$Attributes$class('is-6-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is06Widescreen = $elm$html$Html$Attributes$class('is-6-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is07Desktop = $elm$html$Html$Attributes$class('is-7-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is07FullHD = $elm$html$Html$Attributes$class('is-7-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is07Mobile = $elm$html$Html$Attributes$class('is-7-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is07Tablet = $elm$html$Html$Attributes$class('is-7-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is07Widescreen = $elm$html$Html$Attributes$class('is-7-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is08Desktop = $elm$html$Html$Attributes$class('is-8-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is08FullHD = $elm$html$Html$Attributes$class('is-8-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is08Mobile = $elm$html$Html$Attributes$class('is-8-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is08Tablet = $elm$html$Html$Attributes$class('is-8-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is08Widescreen = $elm$html$Html$Attributes$class('is-8-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is09Desktop = $elm$html$Html$Attributes$class('is-9-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is09FullHD = $elm$html$Html$Attributes$class('is-9-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is09Mobile = $elm$html$Html$Attributes$class('is-9-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is09Tablet = $elm$html$Html$Attributes$class('is-9-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is09Widescreen = $elm$html$Html$Attributes$class('is-9-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is10Desktop = $elm$html$Html$Attributes$class('is-10-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is10FullHD = $elm$html$Html$Attributes$class('is-10-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is10Mobile = $elm$html$Html$Attributes$class('is-10-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is10Tablet = $elm$html$Html$Attributes$class('is-10-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is10Widescreen = $elm$html$Html$Attributes$class('is-10-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$is11Desktop = $elm$html$Html$Attributes$class('is-11-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$is11FullHD = $elm$html$Html$Attributes$class('is-11-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$is11Mobile = $elm$html$Html$Attributes$class('is-11-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$is11Tablet = $elm$html$Html$Attributes$class('is-11-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$is11Widescreen = $elm$html$Html$Attributes$class('is-11-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$isNarrowDesktop = $elm$html$Html$Attributes$class('is-narrow-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$isNarrowFullHD = $elm$html$Html$Attributes$class('is-narrow-fullhd');
var $surprisetalk$elm_bulma$Bulma$Classes$isNarrowMobile = $elm$html$Html$Attributes$class('is-narrow-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$isNarrowTablet = $elm$html$Html$Attributes$class('is-narrow-tablet');
var $surprisetalk$elm_bulma$Bulma$Classes$isNarrowWidescreen = $elm$html$Html$Attributes$class('is-narrow-widescreen');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset01 = $elm$html$Html$Attributes$class('is-offset-1');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset02 = $elm$html$Html$Attributes$class('is-offset-2');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset03 = $elm$html$Html$Attributes$class('is-offset-3');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset04 = $elm$html$Html$Attributes$class('is-offset-4');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset05 = $elm$html$Html$Attributes$class('is-offset-5');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset06 = $elm$html$Html$Attributes$class('is-offset-6');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset07 = $elm$html$Html$Attributes$class('is-offset-7');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset08 = $elm$html$Html$Attributes$class('is-offset-8');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset09 = $elm$html$Html$Attributes$class('is-offset-9');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset10 = $elm$html$Html$Attributes$class('is-offset-10');
var $surprisetalk$elm_bulma$Bulma$Classes$isOffset11 = $elm$html$Html$Attributes$class('is-offset-11');
var $surprisetalk$elm_bulma$Bulma$Classes$none = $elm$html$Html$Attributes$class('');
var $surprisetalk$elm_bulma$Bulma$Columns$column = function (_v0) {
	var widths = _v0.widths;
	var offset = _v0.offset;
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$column,
				function () {
				var _v1 = widths.mobile;
				if (_v1.$ === 'Just') {
					switch (_v1.a.$) {
						case 'Auto':
							var _v2 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Width1':
							var _v3 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Mobile;
						case 'Width2':
							var _v4 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Mobile;
						case 'Width3':
							var _v5 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Mobile;
						case 'Width4':
							var _v6 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Mobile;
						case 'Width5':
							var _v7 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Mobile;
						case 'Width6':
							var _v8 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Mobile;
						case 'Width7':
							var _v9 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Mobile;
						case 'Width8':
							var _v10 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Mobile;
						case 'Width9':
							var _v11 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Mobile;
						case 'Width10':
							var _v12 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is10Mobile;
						default:
							var _v13 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is11Mobile;
					}
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$isNarrowMobile;
				}
			}(),
				function () {
				var _v14 = widths.tablet;
				if (_v14.$ === 'Just') {
					switch (_v14.a.$) {
						case 'Auto':
							var _v15 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Width1':
							var _v16 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Tablet;
						case 'Width2':
							var _v17 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Tablet;
						case 'Width3':
							var _v18 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Tablet;
						case 'Width4':
							var _v19 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Tablet;
						case 'Width5':
							var _v20 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Tablet;
						case 'Width6':
							var _v21 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Tablet;
						case 'Width7':
							var _v22 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Tablet;
						case 'Width8':
							var _v23 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Tablet;
						case 'Width9':
							var _v24 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Tablet;
						case 'Width10':
							var _v25 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is10Tablet;
						default:
							var _v26 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is11Tablet;
					}
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$isNarrowTablet;
				}
			}(),
				function () {
				var _v27 = widths.desktop;
				if (_v27.$ === 'Just') {
					switch (_v27.a.$) {
						case 'Auto':
							var _v28 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Width1':
							var _v29 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Desktop;
						case 'Width2':
							var _v30 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Desktop;
						case 'Width3':
							var _v31 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Desktop;
						case 'Width4':
							var _v32 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Desktop;
						case 'Width5':
							var _v33 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Desktop;
						case 'Width6':
							var _v34 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Desktop;
						case 'Width7':
							var _v35 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Desktop;
						case 'Width8':
							var _v36 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Desktop;
						case 'Width9':
							var _v37 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Desktop;
						case 'Width10':
							var _v38 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is10Desktop;
						default:
							var _v39 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is11Desktop;
					}
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$isNarrowDesktop;
				}
			}(),
				function () {
				var _v40 = widths.widescreen;
				if (_v40.$ === 'Just') {
					switch (_v40.a.$) {
						case 'Auto':
							var _v41 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Width1':
							var _v42 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Widescreen;
						case 'Width2':
							var _v43 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Widescreen;
						case 'Width3':
							var _v44 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Widescreen;
						case 'Width4':
							var _v45 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Widescreen;
						case 'Width5':
							var _v46 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Widescreen;
						case 'Width6':
							var _v47 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Widescreen;
						case 'Width7':
							var _v48 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Widescreen;
						case 'Width8':
							var _v49 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Widescreen;
						case 'Width9':
							var _v50 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Widescreen;
						case 'Width10':
							var _v51 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is10Widescreen;
						default:
							var _v52 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is11Widescreen;
					}
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$isNarrowWidescreen;
				}
			}(),
				function () {
				var _v53 = widths.fullHD;
				if (_v53.$ === 'Just') {
					switch (_v53.a.$) {
						case 'Auto':
							var _v54 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Width1':
							var _v55 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01FullHD;
						case 'Width2':
							var _v56 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02FullHD;
						case 'Width3':
							var _v57 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03FullHD;
						case 'Width4':
							var _v58 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04FullHD;
						case 'Width5':
							var _v59 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05FullHD;
						case 'Width6':
							var _v60 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06FullHD;
						case 'Width7':
							var _v61 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07FullHD;
						case 'Width8':
							var _v62 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08FullHD;
						case 'Width9':
							var _v63 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09FullHD;
						case 'Width10':
							var _v64 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is10FullHD;
						default:
							var _v65 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is11FullHD;
					}
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$isNarrowFullHD;
				}
			}(),
				function () {
				switch (offset.$) {
					case 'Auto':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Width1':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset01;
					case 'Width2':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset02;
					case 'Width3':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset03;
					case 'Width4':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset04;
					case 'Width5':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset05;
					case 'Width6':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset06;
					case 'Width7':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset07;
					case 'Width8':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset08;
					case 'Width9':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset09;
					case 'Width10':
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset10;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset11;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Auto = {$: 'Auto'};
var $surprisetalk$elm_bulma$Bulma$Columns$columnModifiers = {
	offset: $surprisetalk$elm_bulma$Bulma$Modifiers$Auto,
	widths: {
		desktop: $elm$core$Maybe$Just($surprisetalk$elm_bulma$Bulma$Modifiers$Auto),
		fullHD: $elm$core$Maybe$Just($surprisetalk$elm_bulma$Bulma$Modifiers$Auto),
		mobile: $elm$core$Maybe$Just($surprisetalk$elm_bulma$Bulma$Modifiers$Auto),
		tablet: $elm$core$Maybe$Just($surprisetalk$elm_bulma$Bulma$Modifiers$Auto),
		widescreen: $elm$core$Maybe$Just($surprisetalk$elm_bulma$Bulma$Modifiers$Auto)
	}
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $surprisetalk$elm_bulma$Bulma$Classes$image = $elm$html$Html$Attributes$class('image');
var $surprisetalk$elm_bulma$Bulma$Classes$is128x128 = $elm$html$Html$Attributes$class('is-128x128');
var $surprisetalk$elm_bulma$Bulma$Classes$is16by9 = $elm$html$Html$Attributes$class('is-16by9');
var $surprisetalk$elm_bulma$Bulma$Classes$is16x16 = $elm$html$Html$Attributes$class('is-16x16');
var $surprisetalk$elm_bulma$Bulma$Classes$is1by1 = $elm$html$Html$Attributes$class('is-1by1');
var $surprisetalk$elm_bulma$Bulma$Classes$is24x24 = $elm$html$Html$Attributes$class('is-24x24');
var $surprisetalk$elm_bulma$Bulma$Classes$is2by1 = $elm$html$Html$Attributes$class('is-2by1');
var $surprisetalk$elm_bulma$Bulma$Classes$is32x32 = $elm$html$Html$Attributes$class('is-32x32');
var $surprisetalk$elm_bulma$Bulma$Classes$is3by2 = $elm$html$Html$Attributes$class('is-3by2');
var $surprisetalk$elm_bulma$Bulma$Classes$is48x48 = $elm$html$Html$Attributes$class('is-48x48');
var $surprisetalk$elm_bulma$Bulma$Classes$is4by3 = $elm$html$Html$Attributes$class('is-4by3');
var $surprisetalk$elm_bulma$Bulma$Classes$is64x64 = $elm$html$Html$Attributes$class('is-64x64');
var $surprisetalk$elm_bulma$Bulma$Classes$is96x96 = $elm$html$Html$Attributes$class('is-96x96');
var $surprisetalk$elm_bulma$Bulma$Elements$image = function (shape) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'figure',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$image,
				function () {
				switch (shape.$) {
					case 'OneByOne':
						switch (shape.a.$) {
							case 'Unbounded':
								var _v1 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is1by1;
							case 'X16':
								var _v2 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is16x16;
							case 'X24':
								var _v3 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is24x24;
							case 'X32':
								var _v4 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is32x32;
							case 'X48':
								var _v5 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is48x48;
							case 'X64':
								var _v6 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is64x64;
							case 'X96':
								var _v7 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is96x96;
							default:
								var _v8 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is128x128;
						}
					case 'FourByThree':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4by3;
					case 'ThreeByTwo':
						return $surprisetalk$elm_bulma$Bulma$Classes$is3by2;
					case 'SixteenByNine':
						return $surprisetalk$elm_bulma$Bulma$Classes$is16by9;
					case 'TwoByOne':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2by1;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}()
			]));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $mdgriffith$elm_style_animation$Animation$Render$iePrefix = '-ms-';
var $mdgriffith$elm_style_animation$Animation$Render$webkitPrefix = '-webkit-';
var $mdgriffith$elm_style_animation$Animation$Render$prefix = function (stylePair) {
	var propValue = stylePair.b;
	var propName = stylePair.a;
	switch (propName) {
		case 'transform':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		case 'transform-origin':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		case 'filter':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		default:
			return _List_fromArray(
				[stylePair]);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$offset = _VirtualDom_attribute('offset');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$core$Basics$sin = _Basics_sin;
var $mdgriffith$elm_style_animation$Animation$Render$pathCmdValue = function (cmd) {
	var renderPoints = function (coords) {
		return A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function (_v11) {
					var x = _v11.a;
					var y = _v11.b;
					return $elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position));
				},
				coords));
	};
	switch (cmd.$) {
		case 'Move':
			var x = cmd.a;
			var y = cmd.b;
			return 'm ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'MoveTo':
			var x = cmd.a;
			var y = cmd.b;
			return 'M ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'Line':
			var x = cmd.a;
			var y = cmd.b;
			return 'l ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'LineTo':
			var x = cmd.a;
			var y = cmd.b;
			return 'L ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'Horizontal':
			var a = cmd.a;
			return 'h ' + $elm$core$String$fromFloat(a.position);
		case 'HorizontalTo':
			var a = cmd.a;
			return 'H ' + $elm$core$String$fromFloat(a.position);
		case 'Vertical':
			var a = cmd.a;
			return 'v ' + $elm$core$String$fromFloat(a.position);
		case 'VerticalTo':
			var a = cmd.a;
			return 'V ' + $elm$core$String$fromFloat(a.position);
		case 'Curve':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			var _v1 = point;
			var p1x = _v1.a;
			var p1y = _v1.b;
			var _v2 = control2;
			var c2x = _v2.a;
			var c2y = _v2.b;
			var _v3 = control1;
			var c1x = _v3.a;
			var c1y = _v3.b;
			return 'c ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(c2x.position) + (' ' + ($elm$core$String$fromFloat(c2y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))))))));
		case 'CurveTo':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			var _v4 = point;
			var p1x = _v4.a;
			var p1y = _v4.b;
			var _v5 = control2;
			var c2x = _v5.a;
			var c2y = _v5.b;
			var _v6 = control1;
			var c1x = _v6.a;
			var c1y = _v6.b;
			return 'C ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(c2x.position) + (' ' + ($elm$core$String$fromFloat(c2y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))))))));
		case 'Quadratic':
			var control = cmd.a.control;
			var point = cmd.a.point;
			var _v7 = point;
			var p1x = _v7.a;
			var p1y = _v7.b;
			var _v8 = control;
			var c1x = _v8.a;
			var c1y = _v8.b;
			return 'q ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))));
		case 'QuadraticTo':
			var control = cmd.a.control;
			var point = cmd.a.point;
			var _v9 = point;
			var p1x = _v9.a;
			var p1y = _v9.b;
			var _v10 = control;
			var c1x = _v10.a;
			var c1y = _v10.b;
			return 'Q ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))));
		case 'SmoothQuadratic':
			var points = cmd.a;
			return 't ' + renderPoints(points);
		case 'SmoothQuadraticTo':
			var points = cmd.a;
			return 'T ' + renderPoints(points);
		case 'Smooth':
			var points = cmd.a;
			return 's ' + renderPoints(points);
		case 'SmoothTo':
			var points = cmd.a;
			return 'S ' + renderPoints(points);
		case 'ClockwiseArc':
			var arc = cmd.a;
			var deltaAngle = arc.endAngle.position - arc.startAngle.position;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.radius.position * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.startAngle.position));
				var dx = arc.radius.position * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.startAngle.position));
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position - dx) + (',' + ($elm$core$String$fromFloat(arc.y.position - dy) + (' A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position + dx) + (',' + $elm$core$String$fromFloat(arc.y.position + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (' 0 ' + (((deltaAngle >= 180) ? '1' : '0') + (' ' + ('1' + (' ' + ($elm$core$String$fromFloat(
					arc.x.position + (arc.radius.position * $elm$core$Basics$cos(
						$elm$core$Basics$degrees(arc.endAngle.position)))) + (',' + $elm$core$String$fromFloat(
					arc.y.position + (arc.radius.position * $elm$core$Basics$sin(
						$elm$core$Basics$degrees(arc.endAngle.position))))))))))))));
			}
		case 'AntiClockwiseArc':
			var arc = cmd.a;
			var deltaAngle = arc.endAngle.position - arc.startAngle.position;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.radius.position * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.startAngle.position));
				var dx = arc.radius.position * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.startAngle.position));
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,0,' + ($elm$core$String$fromFloat(arc.x.position - dx) + (',' + ($elm$core$String$fromFloat(arc.y.position - dy) + (' A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position + dx) + (',' + $elm$core$String$fromFloat(arc.y.position + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (' 0 ' + ((((arc.startAngle.position - arc.endAngle.position) >= 180) ? '1' : '0') + (' ' + ('0' + (' ' + ($elm$core$String$fromFloat(
					arc.x.position + (arc.radius.position * $elm$core$Basics$cos(arc.endAngle.position))) + (',' + $elm$core$String$fromFloat(
					arc.y.position + (arc.radius.position * $elm$core$Basics$sin(arc.endAngle.position)))))))))))));
			}
		default:
			return 'z';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$propertyValue = F2(
	function (prop, delim) {
		switch (prop.$) {
			case 'ExactProperty':
				var value = prop.b;
				return value;
			case 'ColorProperty':
				var r = prop.b;
				var g = prop.c;
				var b = prop.d;
				var a = prop.e;
				return 'rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(r.position)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(g.position)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(b.position)) + (',' + ($elm$core$String$fromFloat(a.position) + ')')))))));
			case 'ShadowProperty':
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				return (inset ? 'inset ' : '') + ($elm$core$String$fromFloat(shadow.offsetX.position) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.offsetY.position) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.blur.position) + ('px' + (' ' + ((((name === 'text-shadow') || (name === 'drop-shadow')) ? '' : ($elm$core$String$fromFloat(shadow.size.position) + ('px' + ' '))) + ('rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.red.position)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.green.position)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.blue.position)) + (', ' + ($elm$core$String$fromFloat(shadow.alpha.position) + ')'))))))))))))))))));
			case 'Property':
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					x.unit);
			case 'Property2':
				var x = prop.b;
				var y = prop.c;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					_Utils_ap(
						x.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.position),
								y.unit))));
			case 'Property3':
				var x = prop.b;
				var y = prop.c;
				var z = prop.d;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					_Utils_ap(
						x.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.position),
								_Utils_ap(
									y.unit,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(z.position),
											z.unit)))))));
			case 'Property4':
				var w = prop.b;
				var x = prop.c;
				var y = prop.d;
				var z = prop.e;
				return _Utils_ap(
					$elm$core$String$fromFloat(w.position),
					_Utils_ap(
						w.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(x.position),
								_Utils_ap(
									x.unit,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(y.position),
											_Utils_ap(
												y.unit,
												_Utils_ap(
													delim,
													_Utils_ap(
														$elm$core$String$fromFloat(z.position),
														z.unit))))))))));
			case 'AngleProperty':
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					x.unit);
			case 'Points':
				var coords = prop.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return $elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position));
						},
						coords));
			default:
				var cmds = prop.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $mdgriffith$elm_style_animation$Animation$Render$pathCmdValue, cmds));
		}
	});
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $mdgriffith$elm_style_animation$Animation$Render$renderAttrs = function (prop) {
	if (A2(
		$elm$core$String$startsWith,
		'attr:',
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop))) {
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$Attributes$attribute,
				A2(
					$elm$core$String$dropLeft,
					5,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop)),
				A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
	} else {
		switch (prop.$) {
			case 'Points':
				var pts = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$points(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 'Path':
				var cmds = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$d(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 'Property':
				var name = prop.a;
				var m1 = prop.b;
				switch (name) {
					case 'x':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$x(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'y':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$y(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'cx':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$cx(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'cy':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$cy(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'rx':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$rx(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'ry':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$ry(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'r':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$r(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'offset':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$offset(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					default:
						return $elm$core$Maybe$Nothing;
				}
			case 'Property4':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return (name === 'viewBox') ? $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$viewBox(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' '))) : $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$isAttr = function (prop) {
	return A2(
		$elm$core$String$startsWith,
		'attr:',
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop)) || function () {
		switch (prop.$) {
			case 'Points':
				return true;
			case 'Path':
				return true;
			case 'Property':
				var name = prop.a;
				return (name === 'cx') || ((name === 'cy') || ((name === 'x') || ((name === 'y') || ((name === 'rx') || ((name === 'ry') || ((name === 'r') || (name === 'offset')))))));
			case 'Property4':
				var name = prop.a;
				return name === 'viewBox';
			default:
				return false;
		}
	}();
};
var $mdgriffith$elm_style_animation$Animation$Render$isFilter = function (prop) {
	return A2(
		$elm$core$List$member,
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
		_List_fromArray(
			['filter-url', 'blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia', 'drop-shadow']));
};
var $mdgriffith$elm_style_animation$Animation$Render$render3dRotation = function (prop) {
	if (prop.$ === 'Property3') {
		var x = prop.b;
		var y = prop.c;
		var z = prop.d;
		return 'rotateX(' + ($elm$core$String$fromFloat(x.position) + (x.unit + (') rotateY(' + ($elm$core$String$fromFloat(y.position) + (y.unit + (') rotateZ(' + ($elm$core$String$fromFloat(z.position) + (z.unit + ')'))))))));
	} else {
		return '';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$renderValues = function (_v0) {
	var model = _v0.a;
	var _v1 = A2($elm$core$List$partition, $mdgriffith$elm_style_animation$Animation$Render$isAttr, model.style);
	var attrProps = _v1.a;
	var styleProps = _v1.b;
	var _v2 = A3(
		$elm$core$List$foldl,
		F2(
			function (prop, _v3) {
				var myStyle = _v3.a;
				var myTransforms = _v3.b;
				var myFilters = _v3.c;
				return $mdgriffith$elm_style_animation$Animation$Render$isTransformation(prop) ? _Utils_Tuple3(
					myStyle,
					_Utils_ap(
						myTransforms,
						_List_fromArray(
							[prop])),
					myFilters) : ($mdgriffith$elm_style_animation$Animation$Render$isFilter(prop) ? _Utils_Tuple3(
					myStyle,
					myTransforms,
					_Utils_ap(
						myFilters,
						_List_fromArray(
							[prop]))) : _Utils_Tuple3(
					_Utils_ap(
						myStyle,
						_List_fromArray(
							[prop])),
					myTransforms,
					myFilters));
			}),
		_Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil),
		styleProps);
	var style = _v2.a;
	var transforms = _v2.b;
	var filters = _v2.c;
	var renderedFilters = $elm$core$List$isEmpty(filters) ? _List_Nil : _List_fromArray(
		[
			_Utils_Tuple2(
			'filter',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (prop) {
						var name = $mdgriffith$elm_style_animation$Animation$Model$propertyName(prop);
						return (name === 'filter-url') ? ('url(\"' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + '\")')) : ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) + ('(' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + ')')));
					},
					filters)))
		]);
	var renderedStyle = A2(
		$elm$core$List$map,
		function (prop) {
			return _Utils_Tuple2(
				$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
				A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' '));
		},
		style);
	var renderedTransforms = $elm$core$List$isEmpty(transforms) ? _List_Nil : _List_fromArray(
		[
			_Utils_Tuple2(
			'transform',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (prop) {
						return ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) === 'rotate3d') ? $mdgriffith$elm_style_animation$Animation$Render$render3dRotation(prop) : ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) + ('(' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + ')')));
					},
					transforms)))
		]);
	return _Utils_Tuple2(
		_Utils_ap(
			renderedTransforms,
			_Utils_ap(renderedFilters, renderedStyle)),
		attrProps);
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $mdgriffith$elm_style_animation$Animation$Render$render = function (animation) {
	var _v0 = $mdgriffith$elm_style_animation$Animation$Render$renderValues(animation);
	var style = _v0.a;
	var attrProps = _v0.b;
	var otherAttrs = A2($elm$core$List$filterMap, $mdgriffith$elm_style_animation$Animation$Render$renderAttrs, attrProps);
	var styleAttr = A2(
		$elm$core$List$map,
		function (_v1) {
			var prop = _v1.a;
			var val = _v1.b;
			return A2($elm$html$Html$Attributes$style, prop, val);
		},
		A2($elm$core$List$concatMap, $mdgriffith$elm_style_animation$Animation$Render$prefix, style));
	return _Utils_ap(styleAttr, otherAttrs);
};
var $mdgriffith$elm_style_animation$Animation$render = $mdgriffith$elm_style_animation$Animation$Render$render;
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Main$styleBold = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'font-family', 'font'),
		A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
	]);
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$card = function (model) {
	var widget = model.widget;
	return A3(
		$surprisetalk$elm_bulma$Bulma$Columns$column,
		$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
		_Utils_ap(
			$mdgriffith$elm_style_animation$Animation$render(widget.state),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(widget.onClick)
				])),
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Elements$image,
				$surprisetalk$elm_bulma$Bulma$Elements$OneByOne($surprisetalk$elm_bulma$Bulma$Elements$Unbounded),
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(widget.state),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
						])),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.picture),
								A2($elm$html$Html$Attributes$style, 'border-radius', '10px')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$append,
					$author$project$Main$styleBold,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'position', 'relative'),
							A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
							A2($elm$html$Html$Attributes$style, 'font-size', '220%')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(model.name)
					]))
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$columns = $elm$html$Html$Attributes$class('columns');
var $surprisetalk$elm_bulma$Bulma$Classes$is0 = $elm$html$Html$Attributes$class('is-0');
var $surprisetalk$elm_bulma$Bulma$Classes$is1 = $elm$html$Html$Attributes$class('is-1');
var $surprisetalk$elm_bulma$Bulma$Classes$is2 = $elm$html$Html$Attributes$class('is-2');
var $surprisetalk$elm_bulma$Bulma$Classes$is4 = $elm$html$Html$Attributes$class('is-4');
var $surprisetalk$elm_bulma$Bulma$Classes$is5 = $elm$html$Html$Attributes$class('is-5');
var $surprisetalk$elm_bulma$Bulma$Classes$is6 = $elm$html$Html$Attributes$class('is-6');
var $surprisetalk$elm_bulma$Bulma$Classes$is7 = $elm$html$Html$Attributes$class('is-7');
var $surprisetalk$elm_bulma$Bulma$Classes$is8 = $elm$html$Html$Attributes$class('is-8');
var $surprisetalk$elm_bulma$Bulma$Classes$isCentered = $elm$html$Html$Attributes$class('is-centered');
var $surprisetalk$elm_bulma$Bulma$Classes$isDesktop = $elm$html$Html$Attributes$class('is-desktop');
var $surprisetalk$elm_bulma$Bulma$Classes$isGapless = $elm$html$Html$Attributes$class('is-gapless');
var $surprisetalk$elm_bulma$Bulma$Classes$isMobile = $elm$html$Html$Attributes$class('is-mobile');
var $surprisetalk$elm_bulma$Bulma$Classes$isMultiline = $elm$html$Html$Attributes$class('is-multiline');
var $surprisetalk$elm_bulma$Bulma$Columns$columns = function (_v0) {
	var centered = _v0.centered;
	var multiline = _v0.multiline;
	var gap = _v0.gap;
	var display = _v0.display;
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$columns,
				function () {
				if (centered) {
					return $surprisetalk$elm_bulma$Bulma$Classes$isCentered;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}(),
				function () {
				if (multiline) {
					return $surprisetalk$elm_bulma$Bulma$Classes$isMultiline;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}(),
				function () {
				if (gap.$ === 'Gap0') {
					return $surprisetalk$elm_bulma$Bulma$Classes$isGapless;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}(),
				function () {
				switch (gap.$) {
					case 'Gap0':
						return $surprisetalk$elm_bulma$Bulma$Classes$is0;
					case 'Gap1':
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 'Gap2':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 'Gap3':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Gap4':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 'Gap5':
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					case 'Gap6':
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
					case 'Gap7':
						return $surprisetalk$elm_bulma$Bulma$Classes$is7;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is8;
				}
			}(),
				function () {
				switch (display.$) {
					case 'MobileAndBeyond':
						return $surprisetalk$elm_bulma$Bulma$Classes$isMobile;
					case 'TabletAndBeyond':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isDesktop;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Columns$TabletAndBeyond = {$: 'TabletAndBeyond'};
var $surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers = {centered: false, display: $surprisetalk$elm_bulma$Bulma$Columns$TabletAndBeyond, gap: $surprisetalk$elm_bulma$Bulma$Columns$Gap3, multiline: false};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$deck = function (model) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Columns$columns,
		_Utils_update(
			$surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers,
			{gap: $surprisetalk$elm_bulma$Bulma$Columns$Gap3}),
		_List_Nil,
		A2(
			$elm$core$List$take,
			5,
			A2($elm$core$List$map, $author$project$Main$card, model.food)));
};
var $surprisetalk$elm_bulma$Bulma$Classes$hero = $elm$html$Html$Attributes$class('hero');
var $surprisetalk$elm_bulma$Bulma$Classes$isBlack = $elm$html$Html$Attributes$class('is-black');
var $surprisetalk$elm_bulma$Bulma$Classes$isBold = $elm$html$Html$Attributes$class('is-bold');
var $surprisetalk$elm_bulma$Bulma$Classes$isDanger = $elm$html$Html$Attributes$class('is-danger');
var $surprisetalk$elm_bulma$Bulma$Classes$isDark = $elm$html$Html$Attributes$class('is-dark');
var $surprisetalk$elm_bulma$Bulma$Classes$isFullHeight = $elm$html$Html$Attributes$class('is-fullheight');
var $surprisetalk$elm_bulma$Bulma$Classes$isInfo = $elm$html$Html$Attributes$class('is-info');
var $surprisetalk$elm_bulma$Bulma$Classes$isLarge = $elm$html$Html$Attributes$class('is-large');
var $surprisetalk$elm_bulma$Bulma$Classes$isLight = $elm$html$Html$Attributes$class('is-light');
var $surprisetalk$elm_bulma$Bulma$Classes$isLink = $elm$html$Html$Attributes$class('is-link');
var $surprisetalk$elm_bulma$Bulma$Classes$isMedium = $elm$html$Html$Attributes$class('is-medium');
var $surprisetalk$elm_bulma$Bulma$Classes$isPrimary = $elm$html$Html$Attributes$class('is-primary');
var $surprisetalk$elm_bulma$Bulma$Classes$isSuccess = $elm$html$Html$Attributes$class('is-success');
var $surprisetalk$elm_bulma$Bulma$Classes$isWarning = $elm$html$Html$Attributes$class('is-warning');
var $surprisetalk$elm_bulma$Bulma$Classes$isWhite = $elm$html$Html$Attributes$class('is-white');
var $surprisetalk$elm_bulma$Bulma$Layout$hero = function (_v0) {
	var bold = _v0.bold;
	var size = _v0.size;
	var color = _v0.color;
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'section',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$hero,
				function () {
				if (bold) {
					return $surprisetalk$elm_bulma$Bulma$Classes$isBold;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}(),
				function () {
				switch (size.$) {
					case 'Small':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Standard':
						return $surprisetalk$elm_bulma$Bulma$Classes$isMedium;
					case 'Medium':
						return $surprisetalk$elm_bulma$Bulma$Classes$isLarge;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isFullHeight;
				}
			}(),
				function () {
				switch (color.$) {
					case 'Default':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'White':
						return $surprisetalk$elm_bulma$Bulma$Classes$isWhite;
					case 'Black':
						return $surprisetalk$elm_bulma$Bulma$Classes$isBlack;
					case 'Light':
						return $surprisetalk$elm_bulma$Bulma$Classes$isLight;
					case 'Dark':
						return $surprisetalk$elm_bulma$Bulma$Classes$isDark;
					case 'Primary':
						return $surprisetalk$elm_bulma$Bulma$Classes$isPrimary;
					case 'Info':
						return $surprisetalk$elm_bulma$Bulma$Classes$isInfo;
					case 'Success':
						return $surprisetalk$elm_bulma$Bulma$Classes$isSuccess;
					case 'Warning':
						return $surprisetalk$elm_bulma$Bulma$Classes$isWarning;
					case 'Danger':
						return $surprisetalk$elm_bulma$Bulma$Classes$isDanger;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isLink;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$heroBody = $elm$html$Html$Attributes$class('hero-body');
var $surprisetalk$elm_bulma$Bulma$Layout$heroBody = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$heroBody]));
var $surprisetalk$elm_bulma$Bulma$Modifiers$Default = {$: 'Default'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Small = {$: 'Small'};
var $surprisetalk$elm_bulma$Bulma$Layout$heroModifiers = {bold: false, color: $surprisetalk$elm_bulma$Bulma$Modifiers$Default, size: $surprisetalk$elm_bulma$Bulma$Modifiers$Small};
var $author$project$Main$ChangeHero = {$: 'ChangeHero'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Primary = {$: 'Primary'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Width2 = {$: 'Width2'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Width3 = {$: 'Width3'};
var $surprisetalk$elm_bulma$Bulma$Classes$button = $elm$html$Html$Attributes$class('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $surprisetalk$elm_bulma$Bulma$Classes$icon = $elm$html$Html$Attributes$class('icon');
var $surprisetalk$elm_bulma$Bulma$Classes$isSmall = $elm$html$Html$Attributes$class('is-small');
var $surprisetalk$elm_bulma$Bulma$Elements$icon = function (size) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'span',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$icon,
				function () {
				switch (size.$) {
					case 'Small':
						return $surprisetalk$elm_bulma$Bulma$Classes$isSmall;
					case 'Standard':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Medium':
						return $surprisetalk$elm_bulma$Bulma$Classes$isMedium;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isLarge;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$isActive = $elm$html$Html$Attributes$class('is-active');
var $surprisetalk$elm_bulma$Bulma$Classes$isFocused = $elm$html$Html$Attributes$class('is-focused');
var $surprisetalk$elm_bulma$Bulma$Classes$isHovered = $elm$html$Html$Attributes$class('is-hovered');
var $surprisetalk$elm_bulma$Bulma$Classes$isInverted = $elm$html$Html$Attributes$class('is-inverted');
var $surprisetalk$elm_bulma$Bulma$Classes$isLoading = $elm$html$Html$Attributes$class('is-loading');
var $surprisetalk$elm_bulma$Bulma$Classes$isOutlined = $elm$html$Html$Attributes$class('is-outlined');
var $surprisetalk$elm_bulma$Bulma$Classes$isRounded = $elm$html$Html$Attributes$class('is-rounded');
var $surprisetalk$elm_bulma$Bulma$Classes$isSelected = $elm$html$Html$Attributes$class('is-selected');
var $surprisetalk$elm_bulma$Bulma$Classes$isStatic = $elm$html$Html$Attributes$class('is-static');
var $elm$html$Html$span = _VirtualDom_node('span');
var $surprisetalk$elm_bulma$Bulma$Elements$button = F3(
	function (_v0, attrs, htmls) {
		var disabled = _v0.disabled;
		var outlined = _v0.outlined;
		var inverted = _v0.inverted;
		var rounded = _v0.rounded;
		var size = _v0.size;
		var state = _v0.state;
		var color = _v0.color;
		var _static = _v0._static;
		var iconLeft = _v0.iconLeft;
		var iconRight = _v0.iconRight;
		var iconRight_ = function () {
			if (iconRight.$ === 'Just') {
				var _v13 = iconRight.a;
				var size_ = _v13.a;
				var attrs_ = _v13.b;
				var body = _v13.c;
				return _List_fromArray(
					[
						A3(
						$surprisetalk$elm_bulma$Bulma$Elements$icon,
						size_,
						attrs_,
						_List_fromArray(
							[body]))
					]);
			} else {
				return _List_Nil;
			}
		}();
		var iconLeft_ = function () {
			if (iconLeft.$ === 'Just') {
				var _v11 = iconLeft.a;
				var size_ = _v11.a;
				var attrs_ = _v11.b;
				var body = _v11.c;
				return _List_fromArray(
					[
						A3(
						$surprisetalk$elm_bulma$Bulma$Elements$icon,
						size_,
						attrs_,
						_List_fromArray(
							[body]))
					]);
			} else {
				return _List_Nil;
			}
		}();
		var htmls_ = function () {
			if (!htmls.b) {
				return _Utils_ap(iconLeft_, iconRight_);
			} else {
				var htmls__ = htmls;
				return _Utils_ap(
					iconLeft_,
					_Utils_ap(
						_List_fromArray(
							[
								A2($elm$html$Html$span, _List_Nil, htmls__)
							]),
						iconRight_));
			}
		}();
		return A4(
			$surprisetalk$elm_bulma$Helpers$node,
			'a',
			_List_fromArray(
				[
					$elm$html$Html$Attributes$disabled(disabled),
					$surprisetalk$elm_bulma$Bulma$Classes$button,
					function () {
					if (_static) {
						return $surprisetalk$elm_bulma$Bulma$Classes$isStatic;
					} else {
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					}
				}(),
					function () {
					if (outlined) {
						return $surprisetalk$elm_bulma$Bulma$Classes$isOutlined;
					} else {
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					}
				}(),
					function () {
					if (inverted) {
						return $surprisetalk$elm_bulma$Bulma$Classes$isInverted;
					} else {
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					}
				}(),
					function () {
					if (rounded) {
						return $surprisetalk$elm_bulma$Bulma$Classes$isRounded;
					} else {
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					}
				}(),
					function () {
					if (color.$ === 'Default') {
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					} else {
						return $surprisetalk$elm_bulma$Bulma$Classes$isSelected;
					}
				}(),
					function () {
					switch (color.$) {
						case 'Default':
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'White':
							return $surprisetalk$elm_bulma$Bulma$Classes$isWhite;
						case 'Light':
							return $surprisetalk$elm_bulma$Bulma$Classes$isLight;
						case 'Dark':
							return $surprisetalk$elm_bulma$Bulma$Classes$isDark;
						case 'Black':
							return $surprisetalk$elm_bulma$Bulma$Classes$isBlack;
						case 'Primary':
							return $surprisetalk$elm_bulma$Bulma$Classes$isPrimary;
						case 'Link':
							return $surprisetalk$elm_bulma$Bulma$Classes$isLink;
						case 'Info':
							return $surprisetalk$elm_bulma$Bulma$Classes$isInfo;
						case 'Success':
							return $surprisetalk$elm_bulma$Bulma$Classes$isSuccess;
						case 'Warning':
							return $surprisetalk$elm_bulma$Bulma$Classes$isWarning;
						default:
							return $surprisetalk$elm_bulma$Bulma$Classes$isDanger;
					}
				}(),
					function () {
					switch (size.$) {
						case 'Small':
							return $surprisetalk$elm_bulma$Bulma$Classes$isSmall;
						case 'Standard':
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Medium':
							return $surprisetalk$elm_bulma$Bulma$Classes$isMedium;
						default:
							return $surprisetalk$elm_bulma$Bulma$Classes$isLarge;
					}
				}(),
					function () {
					switch (state.$) {
						case 'Blur':
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 'Hover':
							return $surprisetalk$elm_bulma$Bulma$Classes$isHovered;
						case 'Focus':
							return $surprisetalk$elm_bulma$Bulma$Classes$isFocused;
						case 'Active':
							return $surprisetalk$elm_bulma$Bulma$Classes$isActive;
						default:
							return $surprisetalk$elm_bulma$Bulma$Classes$isLoading;
					}
				}()
				]),
			attrs,
			htmls_);
	});
var $surprisetalk$elm_bulma$Bulma$Modifiers$Blur = {$: 'Blur'};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Standard = {$: 'Standard'};
var $surprisetalk$elm_bulma$Bulma$Elements$buttonModifiers = {color: $surprisetalk$elm_bulma$Bulma$Modifiers$Default, disabled: false, iconLeft: $elm$core$Maybe$Nothing, iconRight: $elm$core$Maybe$Nothing, inverted: false, outlined: false, rounded: false, size: $surprisetalk$elm_bulma$Bulma$Modifiers$Standard, state: $surprisetalk$elm_bulma$Bulma$Modifiers$Blur, _static: false};
var $surprisetalk$elm_bulma$Bulma$Elements$X64 = {$: 'X64'};
var $author$project$Main$heart = A3(
	$surprisetalk$elm_bulma$Bulma$Elements$image,
	$surprisetalk$elm_bulma$Bulma$Elements$OneByOne($surprisetalk$elm_bulma$Bulma$Elements$X64),
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src('../images/hero/heart.png')
				]),
			_List_Nil)
		]));
var $surprisetalk$elm_bulma$Bulma$Elements$X128 = {$: 'X128'};
var $author$project$Main$styleNormal = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'font-family', 'font')
	]);
var $author$project$Main$profile = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'text-align', '-webkit-center')
			]),
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Elements$image,
				$surprisetalk$elm_bulma$Bulma$Elements$OneByOne($surprisetalk$elm_bulma$Bulma$Elements$X128),
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.picture),
								$elm$html$Html$Attributes$class('is-rounded')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$append,
					$author$project$Main$styleBold,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '250%')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(model.name)
					])),
				A2(
				$elm$html$Html$span,
				A2(
					$elm$core$List$append,
					$author$project$Main$styleNormal,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '180%')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(model.desc)
					]))
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$is10 = $elm$html$Html$Attributes$class('is-10');
var $surprisetalk$elm_bulma$Bulma$Classes$is11 = $elm$html$Html$Attributes$class('is-11');
var $surprisetalk$elm_bulma$Bulma$Classes$is3 = $elm$html$Html$Attributes$class('is-3');
var $surprisetalk$elm_bulma$Bulma$Classes$is9 = $elm$html$Html$Attributes$class('is-9');
var $surprisetalk$elm_bulma$Bulma$Classes$isAncestor = $elm$html$Html$Attributes$class('is-ancestor');
var $surprisetalk$elm_bulma$Bulma$Classes$tile = $elm$html$Html$Attributes$class('tile');
var $surprisetalk$elm_bulma$Bulma$Layout$tileAncestor = function (width) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$tile,
				$surprisetalk$elm_bulma$Bulma$Classes$isAncestor,
				function () {
				switch (width.$) {
					case 'Auto':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Width1':
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 'Width2':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 'Width3':
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 'Width4':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 'Width5':
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					case 'Width6':
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
					case 'Width7':
						return $surprisetalk$elm_bulma$Bulma$Classes$is7;
					case 'Width8':
						return $surprisetalk$elm_bulma$Bulma$Classes$is8;
					case 'Width9':
						return $surprisetalk$elm_bulma$Bulma$Classes$is9;
					case 'Width10':
						return $surprisetalk$elm_bulma$Bulma$Classes$is10;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is11;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$isChild = $elm$html$Html$Attributes$class('is-child');
var $surprisetalk$elm_bulma$Bulma$Layout$tileChild = function (width) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$tile,
				$surprisetalk$elm_bulma$Bulma$Classes$isChild,
				function () {
				switch (width.$) {
					case 'Auto':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Width1':
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 'Width2':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 'Width3':
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 'Width4':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 'Width5':
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					case 'Width6':
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
					case 'Width7':
						return $surprisetalk$elm_bulma$Bulma$Classes$is7;
					case 'Width8':
						return $surprisetalk$elm_bulma$Bulma$Classes$is8;
					case 'Width9':
						return $surprisetalk$elm_bulma$Bulma$Classes$is9;
					case 'Width10':
						return $surprisetalk$elm_bulma$Bulma$Classes$is10;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is11;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$isParent = $elm$html$Html$Attributes$class('is-parent');
var $surprisetalk$elm_bulma$Bulma$Layout$tileParent = function (width) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$tile,
				$surprisetalk$elm_bulma$Bulma$Classes$isParent,
				function () {
				switch (width.$) {
					case 'Auto':
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 'Width1':
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 'Width2':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 'Width3':
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 'Width4':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 'Width5':
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					case 'Width6':
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
					case 'Width7':
						return $surprisetalk$elm_bulma$Bulma$Classes$is7;
					case 'Width8':
						return $surprisetalk$elm_bulma$Bulma$Classes$is8;
					case 'Width9':
						return $surprisetalk$elm_bulma$Bulma$Classes$is9;
					case 'Width10':
						return $surprisetalk$elm_bulma$Bulma$Classes$is10;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is11;
				}
			}()
			]));
};
var $author$project$Main$panel = function (model) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Layout$tileAncestor,
		$surprisetalk$elm_bulma$Bulma$Modifiers$Auto,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Layout$tileParent,
				$surprisetalk$elm_bulma$Bulma$Modifiers$Width2,
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$surprisetalk$elm_bulma$Bulma$Layout$tileChild,
						$surprisetalk$elm_bulma$Bulma$Modifiers$Auto,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center')
							]),
						_List_fromArray(
							[
								$author$project$Main$profile(model.hero),
								A3(
								$surprisetalk$elm_bulma$Bulma$Elements$button,
								_Utils_update(
									$surprisetalk$elm_bulma$Bulma$Elements$buttonModifiers,
									{color: $surprisetalk$elm_bulma$Bulma$Modifiers$Primary, outlined: true, size: $surprisetalk$elm_bulma$Bulma$Modifiers$Small}),
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$ChangeHero)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Change Hero')
									]))
							]))
					])),
				A3(
				$surprisetalk$elm_bulma$Bulma$Layout$tileParent,
				$surprisetalk$elm_bulma$Bulma$Modifiers$Width3,
				_List_Nil,
				A2(
					$elm$core$List$repeat,
					model.hp,
					A3(
						$surprisetalk$elm_bulma$Bulma$Layout$tileChild,
						$surprisetalk$elm_bulma$Bulma$Modifiers$Auto,
						_List_Nil,
						_List_fromArray(
							[$author$project$Main$heart]))))
			]));
};
var $surprisetalk$elm_bulma$Bulma$Elements$H1 = {$: 'H1'};
var $surprisetalk$elm_bulma$Bulma$Elements$H2 = {$: 'H2'};
var $surprisetalk$elm_bulma$Bulma$Elements$H3 = {$: 'H3'};
var $surprisetalk$elm_bulma$Bulma$Classes$title = $elm$html$Html$Attributes$class('title');
var $surprisetalk$elm_bulma$Bulma$Elements$title = function (size) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		function () {
			switch (size.$) {
				case 'H1':
					return 'h1';
				case 'H2':
					return 'h2';
				case 'H3':
					return 'h3';
				case 'H4':
					return 'h4';
				case 'H5':
					return 'h5';
				default:
					return 'h6';
			}
		}(),
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$title,
				function () {
				switch (size.$) {
					case 'H1':
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 'H2':
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 'H3':
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 'H4':
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 'H5':
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
				}
			}()
			]));
};
var $author$project$Main$bestResult = function (result) {
	if (result.$ === 'Nothing') {
		return A3(
			$surprisetalk$elm_bulma$Bulma$Elements$title,
			$surprisetalk$elm_bulma$Bulma$Elements$H3,
			A2(
				$elm$core$List$append,
				$author$project$Main$styleNormal,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text('No results yet')
				]));
	} else {
		var br = result.a;
		return A3(
			$surprisetalk$elm_bulma$Bulma$Elements$title,
			$surprisetalk$elm_bulma$Bulma$Elements$H3,
			A2(
				$elm$core$List$append,
				$author$project$Main$styleNormal,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text(
					'Best result made with ' + (br.name + (': ' + $elm$core$String$fromInt(br.score))))
				]));
	}
};
var $author$project$Main$styleTitle = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'font-family', 'font'),
		A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
		A2($elm$html$Html$Attributes$style, 'font-size', '500%')
	]);
var $surprisetalk$elm_bulma$Bulma$Classes$hasTextCentered = $elm$html$Html$Attributes$class('has-text-centered');
var $surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered = $surprisetalk$elm_bulma$Bulma$Classes$hasTextCentered;
var $author$project$Main$score = function (model) {
	return A2(
		$surprisetalk$elm_bulma$Bulma$Layout$container,
		_List_fromArray(
			[$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered]),
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Elements$title,
				$surprisetalk$elm_bulma$Bulma$Elements$H1,
				A2(
					$elm$core$List$append,
					$author$project$Main$styleTitle,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text('Chew Paper Box')
					])),
				A3(
				$surprisetalk$elm_bulma$Bulma$Elements$title,
				$surprisetalk$elm_bulma$Bulma$Elements$H2,
				A2(
					$elm$core$List$append,
					$author$project$Main$styleNormal,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Score: ' + $elm$core$String$fromInt(model.score))
					])),
				$author$project$Main$bestResult(model.bestResult)
			]));
};
var $author$project$Main$body = function (model) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Layout$hero,
		_Utils_update(
			$surprisetalk$elm_bulma$Bulma$Layout$heroModifiers,
			{bold: true, color: $surprisetalk$elm_bulma$Bulma$Modifiers$Light, size: $surprisetalk$elm_bulma$Bulma$Modifiers$Large}),
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$surprisetalk$elm_bulma$Bulma$Layout$heroBody,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$surprisetalk$elm_bulma$Bulma$Layout$container,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Main$score(model),
								$author$project$Main$deck(model),
								$author$project$Main$panel(model)
							]))
					]))
			]));
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $surprisetalk$elm_bulma$Bulma$CDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css')
		]),
	_List_Nil);
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_Nil,
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$CDN$stylesheet,
				$author$project$Main$body(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));