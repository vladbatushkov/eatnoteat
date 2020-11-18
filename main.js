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

	/**_UNUSED/
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

	/**/
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

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
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

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


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



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


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

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
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

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
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


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
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
	if (region.aS._ === region.a7._)
	{
		return 'on line ' + region.aS._;
	}
	return 'on lines ' + region.aS._ + ' through ' + region.a7._;
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



/**_UNUSED/
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

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

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
		impl.bT,
		impl.b2,
		impl.b_,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
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


function _Platform_export(exports)
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


function _Platform_export_UNUSED(exports)
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

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
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

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
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
		E: func(record.E),
		aW: record.aW,
		aN: record.aN
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
		var message = !tag ? value : tag < 3 ? value.a : value.E;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.aW;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aN) && event.preventDefault(),
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
		impl.bT,
		impl.b2,
		impl.b_,
		function(sendToApp, initialModel) {
			var view = impl.b4;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
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
		impl.bT,
		impl.b2,
		impl.b_,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.aR && impl.aR(sendToApp)
			var view = impl.b4;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bJ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.b0) && (_VirtualDom_doc.title = title = doc.b0);
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
	var onUrlChange = impl.bV;
	var onUrlRequest = impl.bW;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		aR: function(sendToApp)
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
							&& curr.bq === next.bq
							&& curr.bd === next.bd
							&& curr.bm.a === next.bm.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bT: function(flags)
		{
			return A3(impl.bT, flags, _Browser_getUrl(), key);
		},
		b4: impl.b4,
		b2: impl.b2,
		b_: impl.b_
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
		? { bR: 'hidden', bK: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bR: 'mozHidden', bK: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bR: 'msHidden', bK: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bR: 'webkitHidden', bK: 'webkitvisibilitychange' }
		: { bR: 'hidden', bK: 'visibilitychange' };
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
		bu: _Browser_getScene(),
		bD: {
			bF: _Browser_window.pageXOffset,
			bG: _Browser_window.pageYOffset,
			bE: _Browser_doc.documentElement.clientWidth,
			bc: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		bE: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bc: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			bu: {
				bE: node.scrollWidth,
				bc: node.scrollHeight
			},
			bD: {
				bF: node.scrollLeft,
				bG: node.scrollTop,
				bE: node.clientWidth,
				bc: node.clientHeight
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
			bu: _Browser_getScene(),
			bD: {
				bF: x,
				bG: y,
				bE: _Browser_doc.documentElement.clientWidth,
				bc: _Browser_doc.documentElement.clientHeight
			},
			bN: {
				bF: x + rect.left,
				bG: y + rect.top,
				bE: rect.width,
				bc: rect.height
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
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
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
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
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
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
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
		return {$: 0, a: a, b: b, c: c, d: d};
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
	return {$: 1, a: a};
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
	return {$: 0, a: a};
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
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.b),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.b);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.b) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.b);
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
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, b: tail});
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
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
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
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {a9: fragment, bd: host, bj: path, bm: port_, bq: protocol, br: query};
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
					if (_v1.$ === 1) {
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
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
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
		var task = _v0;
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
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$BestResult = F2(
	function (heroId, score) {
		return {ai: heroId, z: score};
	});
var $author$project$Main$Model = F7(
	function (device, screen, hero, foodPanel, hp, score, bestResults) {
		return {ah: bestResults, l: device, h: foodPanel, t: hero, f: hp, z: score, ac: screen};
	});
var $author$project$Main$SelectHeroScreen = 0;
var $author$project$Main$Shuffle = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$Desserts = 4;
var $author$project$Main$Drinks = 3;
var $author$project$Main$Food = F4(
	function (id, name, tags, picture) {
		return {O: id, aa: name, C: picture, bB: tags};
	});
var $author$project$Main$Hpy = 0;
var $author$project$Main$Junk = 2;
var $author$project$Main$NotHpy = 1;
var $author$project$Main$allFood = _List_fromArray(
	[
		A4(
		$author$project$Main$Food,
		0,
		'Popcorn',
		_List_fromArray(
			[1]),
		'images/food/popcorn.png'),
		A4(
		$author$project$Main$Food,
		1,
		'Happy Meal',
		_List_fromArray(
			[1]),
		'images/food/happymeal.png'),
		A4(
		$author$project$Main$Food,
		2,
		'Pizza',
		_List_fromArray(
			[1]),
		'images/food/pizza.png'),
		A4(
		$author$project$Main$Food,
		3,
		'Tiramisu',
		_List_fromArray(
			[4]),
		'images/food/tiramisu.png'),
		A4(
		$author$project$Main$Food,
		4,
		'Salad',
		_List_fromArray(
			[0]),
		'images/food/salad.png'),
		A4(
		$author$project$Main$Food,
		5,
		'Apple Stump',
		_List_fromArray(
			[2]),
		'images/food/applestump.png'),
		A4(
		$author$project$Main$Food,
		6,
		'Empty Bottle',
		_List_fromArray(
			[2]),
		'images/food/bottle.png'),
		A4(
		$author$project$Main$Food,
		7,
		'Bread',
		_List_fromArray(
			[0]),
		'images/food/bread.png'),
		A4(
		$author$project$Main$Food,
		8,
		'Burgers',
		_List_fromArray(
			[1]),
		'images/food/burgers.png'),
		A4(
		$author$project$Main$Food,
		9,
		'Carrot',
		_List_fromArray(
			[0]),
		'images/food/carrot.png'),
		A4(
		$author$project$Main$Food,
		10,
		'Sode Water',
		_List_fromArray(
			[3]),
		'images/food/cola.png'),
		A4(
		$author$project$Main$Food,
		11,
		'Cheese',
		_List_fromArray(
			[0]),
		'images/food/cheese.png'),
		A4(
		$author$project$Main$Food,
		12,
		'Creamy',
		_List_fromArray(
			[4]),
		'images/food/creamy.png'),
		A4(
		$author$project$Main$Food,
		13,
		'Cucumber',
		_List_fromArray(
			[0]),
		'images/food/cucumber.png'),
		A4(
		$author$project$Main$Food,
		14,
		'Eggs',
		_List_fromArray(
			[0]),
		'images/food/eggs.png'),
		A4(
		$author$project$Main$Food,
		15,
		'Fallen Ice Cream',
		_List_fromArray(
			[2]),
		'images/food/icecream.png'),
		A4(
		$author$project$Main$Food,
		16,
		'Jar',
		_List_fromArray(
			[2]),
		'images/food/jar.png'),
		A4(
		$author$project$Main$Food,
		17,
		'Chicken Drumsticks',
		_List_fromArray(
			[1]),
		'images/food/kfc.png'),
		A4(
		$author$project$Main$Food,
		18,
		'Leftovers',
		_List_fromArray(
			[2]),
		'images/food/leftovers.png'),
		A4(
		$author$project$Main$Food,
		19,
		'Lemon',
		_List_fromArray(
			[0]),
		'images/food/lemon.png'),
		A4(
		$author$project$Main$Food,
		20,
		'Milk',
		_List_fromArray(
			[3]),
		'images/food/milk.png'),
		A4(
		$author$project$Main$Food,
		21,
		'Fruity Cake',
		_List_fromArray(
			[4]),
		'images/food/orangecake.png'),
		A4(
		$author$project$Main$Food,
		22,
		'Pepperoni',
		_List_fromArray(
			[1]),
		'images/food/pepperoni.png'),
		A4(
		$author$project$Main$Food,
		23,
		'Plastic Box',
		_List_fromArray(
			[2]),
		'images/food/plasticbox.png'),
		A4(
		$author$project$Main$Food,
		24,
		'Meat Ribs',
		_List_fromArray(
			[1]),
		'images/food/ribs.png'),
		A4(
		$author$project$Main$Food,
		25,
		'Salmon',
		_List_fromArray(
			[0]),
		'images/food/salmon.png'),
		A4(
		$author$project$Main$Food,
		26,
		'Sausage Plate',
		_List_fromArray(
			[1]),
		'images/food/sausageplate.png'),
		A4(
		$author$project$Main$Food,
		27,
		'Shawarma',
		_List_fromArray(
			[1]),
		'images/food/shawarma.png'),
		A4(
		$author$project$Main$Food,
		28,
		'Steak',
		_List_fromArray(
			[1]),
		'images/food/steak.png'),
		A4(
		$author$project$Main$Food,
		29,
		'Steak Plate',
		_List_fromArray(
			[1]),
		'images/food/steakplate.png'),
		A4(
		$author$project$Main$Food,
		30,
		'Tacos',
		_List_fromArray(
			[1]),
		'images/food/tacos.png'),
		A4(
		$author$project$Main$Food,
		31,
		'Tomatos',
		_List_fromArray(
			[0]),
		'images/food/tomatos.png'),
		A4(
		$author$project$Main$Food,
		32,
		'Wok',
		_List_fromArray(
			[1]),
		'images/food/wok.png'),
		A4(
		$author$project$Main$Food,
		33,
		'Strawberry Cake',
		_List_fromArray(
			[4]),
		'images/food/strawberrycake.png'),
		A4(
		$author$project$Main$Food,
		34,
		'Shake',
		_List_fromArray(
			[3]),
		'images/food/shake.png'),
		A4(
		$author$project$Main$Food,
		35,
		'Pepper',
		_List_fromArray(
			[0]),
		'images/food/redhotchilipepper.png'),
		A4(
		$author$project$Main$Food,
		36,
		'Sausages',
		_List_fromArray(
			[1]),
		'images/food/sausages.png')
	]);
var $author$project$Main$Hero = F6(
	function (id, name, desc, picture, goodTags, badTags) {
		return {a0: badTags, as: desc, bb: goodTags, O: id, aa: name, C: picture};
	});
var $author$project$Main$arnold = A6(
	$author$project$Main$Hero,
	1,
	'Arnold Trash',
	'Eats only leftovers and junk. Never touches normal food.',
	'images/hero/arnold.png',
	_List_fromArray(
		[2]),
	_List_fromArray(
		[0, 1, 3, 4]));
var $author$project$Main$Desktop = 1;
var $author$project$Main$DeviceSettings = F6(
	function (deviceType, scoreBottom, scoreSize, scoreFont, heroImageWidth, heartImageSize) {
		return {a6: deviceType, I: heartImageSize, aA: heroImageWidth, bv: scoreBottom, bw: scoreFont, aP: scoreSize};
	});
var $author$project$Main$Phone = 0;
var $surprisetalk$elm_bulma$Bulma$Elements$X128 = 6;
var $surprisetalk$elm_bulma$Bulma$Elements$X64 = 4;
var $author$project$Main$detectDevice = function (size) {
	return (size > 768) ? A6($author$project$Main$DeviceSettings, 1, '50px', '50px', '2.25rem', '130px', 4) : A6($author$project$Main$DeviceSettings, 0, '75px', '100px', '4rem', '250px', 6);
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
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
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
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
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
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
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $author$project$Main$FoodPanel = F2(
	function (foods, animationState) {
		return {e: animationState, Z: foods};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Spring = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_style_animation$Animation$initMotion = F2(
	function (position, unit) {
		return {
			P: $mdgriffith$elm_style_animation$Animation$Model$Spring(
				{a4: 26, bx: 170}),
			bU: $elm$core$Maybe$Nothing,
			bY: position,
			b$: position,
			b1: unit,
			b3: 0
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
var $mdgriffith$elm_style_animation$Animation$Model$Animation = $elm$core$Basics$identity;
var $mdgriffith$elm_style_animation$Animation$initialState = function (current) {
	return {
		aE: _List_Nil,
		ak: false,
		aV: _List_Nil,
		by: current,
		bC: {
			a3: $elm$time$Time$millisToPosix(0),
			bM: $elm$time$Time$millisToPosix(0)
		}
	};
};
var $mdgriffith$elm_style_animation$Animation$Model$Easing = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$pi = _Basics_pi;
var $mdgriffith$elm_style_animation$Animation$Model$AtSpeed = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_style_animation$Animation$speed = function (speedValue) {
	return $mdgriffith$elm_style_animation$Animation$Model$AtSpeed(speedValue);
};
var $mdgriffith$elm_style_animation$Animation$defaultInterpolationByProperty = function (prop) {
	var linear = function (duration) {
		return $mdgriffith$elm_style_animation$Animation$Model$Easing(
			{aw: duration, ax: $elm$core$Basics$identity, bp: 1, aS: 0});
	};
	var defaultSpring = $mdgriffith$elm_style_animation$Animation$Model$Spring(
		{a4: 26, bx: 170});
	switch (prop.$) {
		case 0:
			return defaultSpring;
		case 1:
			return linear(
				$elm$time$Time$millisToPosix(400));
		case 2:
			return defaultSpring;
		case 3:
			return defaultSpring;
		case 4:
			return defaultSpring;
		case 5:
			var name = prop.a;
			return (name === 'rotate3d') ? $mdgriffith$elm_style_animation$Animation$speed(
				{bk: $elm$core$Basics$pi}) : defaultSpring;
		case 6:
			return defaultSpring;
		case 7:
			return $mdgriffith$elm_style_animation$Animation$speed(
				{bk: $elm$core$Basics$pi});
		case 8:
			return defaultSpring;
		default:
			return defaultSpring;
	}
};
var $mdgriffith$elm_style_animation$Animation$Model$AngleProperty = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ColorProperty = F5(
	function (a, b, c, d, e) {
		return {$: 1, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ExactProperty = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Path = function (a) {
	return {$: 9, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Points = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Property2 = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property3 = F4(
	function (a, b, c, d) {
		return {$: 5, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property4 = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ShadowProperty = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc = function (a) {
	return {$: 17, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc = function (a) {
	return {$: 16, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Close = {$: 18};
var $mdgriffith$elm_style_animation$Animation$Model$Curve = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$CurveTo = function (a) {
	return {$: 9, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Horizontal = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Line = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$LineTo = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Move = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$MoveTo = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Quadratic = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo = function (a) {
	return {$: 11, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Smooth = function (a) {
	return {$: 14, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic = function (a) {
	return {$: 12, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo = function (a) {
	return {$: 13, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothTo = function (a) {
	return {$: 15, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Vertical = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$VerticalTo = function (a) {
	return {$: 7, a: a};
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
			case 0:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					fn(m1),
					fn(m2));
			case 1:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					fn(m1),
					fn(m2));
			case 2:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					fn(m1),
					fn(m2));
			case 3:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					fn(m1),
					fn(m2));
			case 4:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					fn(motion));
			case 5:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					fn(motion));
			case 6:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					fn(motion));
			case 7:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					fn(motion));
			case 8:
				var control1 = cmd.a.W;
				var control2 = cmd.a.X;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						W: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						X: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						y: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 9:
				var control1 = cmd.a.W;
				var control2 = cmd.a.X;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						W: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						X: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						y: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 10:
				var control = cmd.a.V;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						V: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						y: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 11:
				var control = cmd.a.V;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						V: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						y: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 12:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					mapCoords(coords));
			case 13:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					mapCoords(coords));
			case 14:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					mapCoords(coords));
			case 15:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					mapCoords(coords));
			case 16:
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					function () {
						var y = arc.bG;
						var x = arc.bF;
						var startAngle = arc.ad;
						var radius = arc.ab;
						var endAngle = arc.Y;
						return _Utils_update(
							arc,
							{
								Y: fn(endAngle),
								ab: fn(radius),
								ad: fn(startAngle),
								bF: fn(x),
								bG: fn(y)
							});
					}());
			case 17:
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					function () {
						var y = arc.bG;
						var x = arc.bF;
						var startAngle = arc.ad;
						var radius = arc.ab;
						var endAngle = arc.Y;
						return _Utils_update(
							arc,
							{
								Y: fn(endAngle),
								ab: fn(radius),
								ad: fn(startAngle),
								bF: fn(x),
								bG: fn(y)
							});
					}());
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$mapToMotion = F2(
	function (fn, prop) {
		switch (prop.$) {
			case 0:
				var name = prop.a;
				var value = prop.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 1:
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
			case 2:
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				var size = shadow.A;
				var red = shadow.q;
				var offsetY = shadow.w;
				var offsetX = shadow.v;
				var green = shadow.p;
				var blur = shadow.s;
				var blue = shadow.k;
				var alpha = shadow.j;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
					name,
					inset,
					{
						j: fn(alpha),
						k: fn(blue),
						s: fn(blur),
						p: fn(green),
						v: fn(offsetX),
						w: fn(offsetY),
						q: fn(red),
						A: fn(size)
					});
			case 3:
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Property,
					name,
					fn(m1));
			case 4:
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$Property2,
					name,
					fn(m1),
					fn(m2));
			case 5:
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
			case 6:
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
			case 7:
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
					name,
					fn(m1));
			case 8:
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
				{P: interp});
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
		case 0:
			var name = prop.a;
			return name;
		case 1:
			var name = prop.a;
			return name;
		case 2:
			var name = prop.a;
			return name;
		case 3:
			var name = prop.a;
			return name;
		case 4:
			var name = prop.a;
			return name;
		case 5:
			var name = prop.a;
			return name;
		case 6:
			var name = prop.a;
			return name;
		case 7:
			var name = prop.a;
			return name;
		case 8:
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
			if (_v1.$ === 1) {
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
var $author$project$Main$initFoodPanel = A2(
	$author$project$Main$FoodPanel,
	$author$project$Main$allFood,
	$mdgriffith$elm_style_animation$Animation$style(
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1)
			])));
var $author$project$Main$Hp = F2(
	function (value, animationState) {
		return {e: animationState, al: value};
	});
var $mdgriffith$elm_style_animation$Animation$Length = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Px = 1;
var $mdgriffith$elm_style_animation$Animation$px = function (myPx) {
	return A2($mdgriffith$elm_style_animation$Animation$Length, myPx, 1);
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
	switch (unit) {
		case 0:
			return '';
		case 1:
			return 'px';
		case 2:
			return '%';
		case 3:
			return 'rem';
		case 4:
			return 'em';
		case 5:
			return 'ex';
		case 6:
			return 'ch';
		case 7:
			return 'vh';
		case 8:
			return 'vw';
		case 9:
			return 'vmin';
		case 10:
			return 'vmax';
		case 11:
			return 'mm';
		case 12:
			return 'cm';
		case 13:
			return 'in';
		case 14:
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
var $author$project$Main$initHp = A2(
	$author$project$Main$Hp,
	3,
	$mdgriffith$elm_style_animation$Animation$style(
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1),
				A2(
				$mdgriffith$elm_style_animation$Animation$translate,
				$mdgriffith$elm_style_animation$Animation$px(0),
				$mdgriffith$elm_style_animation$Animation$px(0))
			])));
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
					{d: nodeList, a: nodeListSize, b: jsArray});
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
var $elm$core$Bitwise$and = _Bitwise_and;
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
		return function (seed0) {
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
		};
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$findFast = F2(
	function (id, dict) {
		findFast:
		while (true) {
			var _v0 = A2($elm$core$Dict$get, id, dict);
			if (_v0.$ === 1) {
				return id;
			} else {
				var cursor = _v0.a;
				if (_Utils_eq(id, cursor)) {
					return id;
				} else {
					var $temp$id = cursor,
						$temp$dict = dict;
					id = $temp$id;
					dict = $temp$dict;
					continue findFast;
				}
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$find = F2(
	function (id, _v0) {
		var dict = _v0.b;
		return A2($owanturist$elm_union_find$UnionFind$findFast, id, dict);
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
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
var $elm$core$Array$isEmpty = function (_v0) {
	var len = _v0.a;
	return !len;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $owanturist$elm_union_find$UnionFind$QuickUnionPathCompression = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $owanturist$elm_union_find$UnionFind$quickUnionPathCompression = A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, 0, $elm$core$Dict$empty);
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $owanturist$elm_union_find$UnionFind$findCompressed = F2(
	function (id, dict) {
		var _v0 = A2($elm$core$Dict$get, id, dict);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(
				id,
				A3($elm$core$Dict$insert, id, id, dict));
		} else {
			var cursor = _v0.a;
			if (_Utils_eq(id, cursor)) {
				return _Utils_Tuple2(id, dict);
			} else {
				var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, cursor, dict);
				var parent = _v1.a;
				var nextDict = _v1.b;
				return _Utils_Tuple2(
					parent,
					A3($elm$core$Dict$insert, id, parent, nextDict));
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$union = F3(
	function (left, right, _v0) {
		var count_ = _v0.a;
		var dict = _v0.b;
		var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, left, dict);
		var leftRoot = _v1.a;
		var leftDict = _v1.b;
		var _v2 = A2($owanturist$elm_union_find$UnionFind$findCompressed, right, leftDict);
		var rightRoot = _v2.a;
		var rightDict = _v2.b;
		return _Utils_eq(leftRoot, rightRoot) ? A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, count_, rightDict) : A2(
			$owanturist$elm_union_find$UnionFind$QuickUnionPathCompression,
			count_ + 1,
			A3($elm$core$Dict$insert, leftRoot, rightRoot, rightDict));
	});
var $elm_community$random_extra$Utils$selectUniqByIndexes = F2(
	function (values, randomIndexes) {
		var modByLength = $elm$core$Basics$modBy(
			$elm$core$Array$length(values));
		var step = F2(
			function (randomIndex, _v1) {
				var uf = _v1.a;
				var acc = _v1.b;
				var leaderOfElement = A2($owanturist$elm_union_find$UnionFind$find, randomIndex, uf);
				var leaderOfNextElement = A2(
					$owanturist$elm_union_find$UnionFind$find,
					modByLength(leaderOfElement + 1),
					uf);
				var _v0 = A2($elm$core$Array$get, leaderOfElement, values);
				if (_v0.$ === 1) {
					return _Utils_Tuple2(uf, acc);
				} else {
					var value = _v0.a;
					return _Utils_Tuple2(
						A3($owanturist$elm_union_find$UnionFind$union, leaderOfElement, leaderOfNextElement, uf),
						A2($elm$core$List$cons, value, acc));
				}
			});
		return $elm$core$Array$isEmpty(values) ? _List_Nil : A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2($owanturist$elm_union_find$UnionFind$quickUnionPathCompression, _List_Nil),
			randomIndexes).b;
	});
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	var values = $elm$core$Array$fromList(list);
	var length = $elm$core$Array$length(values);
	return A2(
		$elm$random$Random$map,
		$elm_community$random_extra$Utils$selectUniqByIndexes(values),
		A2(
			$elm$random$Random$list,
			length,
			A2($elm$random$Random$int, 0, length - 1)));
};
var $author$project$Main$init = function (size) {
	return _Utils_Tuple2(
		A7(
			$author$project$Main$Model,
			$author$project$Main$detectDevice(size),
			0,
			$author$project$Main$arnold,
			$author$project$Main$initFoodPanel,
			$author$project$Main$initHp,
			0,
			_List_fromArray(
				[
					A2($author$project$Main$BestResult, 1, 0),
					A2($author$project$Main$BestResult, 2, 0),
					A2($author$project$Main$BestResult, 3, 0)
				])),
		A2(
			$elm$random$Random$generate,
			$author$project$Main$Shuffle,
			$elm_community$random_extra$Random$List$shuffle($author$project$Main$allFood)));
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Main$Animate = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Main$FoodObject = 0;
var $author$project$Main$HpObject = 1;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $mdgriffith$elm_style_animation$Animation$Model$Tick = $elm$core$Basics$identity;
var $mdgriffith$elm_style_animation$Animation$isRunning = function (_v0) {
	var model = _v0;
	return model.ak;
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {aL: oldTime, bt: request, bz: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.bt;
		var oldTime = _v0.aL;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
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
		var subs = _v0.bz;
		var oldTime = _v0.aL;
		var send = function (sub) {
			if (!sub.$) {
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
	return {$: 1, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
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
			$elm$browser$Browser$Events$onAnimationFrame($elm$core$Basics$identity)) : $elm$core$Platform$Sub$none;
	});
var $author$project$Main$subscriptions = function (model) {
	var hpState = {ao: 1, aT: model.f.e};
	var foodState = {ao: 0, aT: model.h.e};
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_style_animation$Animation$subscription,
					$author$project$Main$Animate(x.ao),
					_List_fromArray(
						[x.aT]));
			},
			_List_fromArray(
				[hpState, foodState])));
};
var $author$project$Main$Damage = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$HpCheck = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$Idle = {$: 0};
var $author$project$Main$PlayScreen = 1;
var $author$project$Main$ShuffleFood = {$: 5};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$calcEat = F2(
	function (model, tags) {
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
				model.t.bb));
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
				model.t.a0)) ? 0 : 1;
		return _Utils_Tuple2(points, damage);
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $mdgriffith$elm_style_animation$Animation$queue = F2(
	function (steps, _v0) {
		var model = _v0;
		return _Utils_update(
			model,
			{
				ak: true,
				aV: _Utils_ap(model.aV, steps)
			});
	});
var $author$project$Main$mapBestResult = F2(
	function (a, b) {
		return _Utils_eq(a.ai, b.ai) ? ((_Utils_cmp(a.z, b.z) > 0) ? a : b) : a;
	});
var $author$project$Main$selectBestResults = F2(
	function (bestResults, newResult) {
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2($author$project$Main$mapBestResult, x, newResult);
			},
			bestResults);
	});
var $mdgriffith$elm_style_animation$Animation$Model$Send = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Messenger$send = function (msg) {
	return $mdgriffith$elm_style_animation$Animation$Model$Send(msg);
};
var $mdgriffith$elm_style_animation$Animation$Model$To = function (a) {
	return {$: 1, a: a};
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
		var dt = $elm$time$Time$posixToMillis(now) - $elm$time$Time$posixToMillis(timing.a3);
		return {
			a3: now,
			bM: ((dt > 34) || (!$elm$time$Time$posixToMillis(timing.a3))) ? $elm$time$Time$millisToPosix(
				$elm$core$Basics$round(16.666)) : $elm$time$Time$millisToPosix(dt)
		};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Loop = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Repeat = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Step = {$: 0};
var $mdgriffith$elm_style_animation$Animation$Model$Wait = function (a) {
	return {$: 4, a: a};
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
		return (!motion.b3) && _Utils_eq(motion.bY, motion.b$);
	};
	switch (cmd.$) {
		case 0:
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 1:
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 2:
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 3:
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 4:
			var motion = cmd.a;
			return motionDone(motion);
		case 5:
			var motion = cmd.a;
			return motionDone(motion);
		case 6:
			var motion = cmd.a;
			return motionDone(motion);
		case 7:
			var motion = cmd.a;
			return motionDone(motion);
		case 8:
			var control1 = cmd.a.W;
			var control2 = cmd.a.X;
			var point = cmd.a.y;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 9:
			var control1 = cmd.a.W;
			var control2 = cmd.a.X;
			var point = cmd.a.y;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 10:
			var control = cmd.a.V;
			var point = cmd.a.y;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 11:
			var control = cmd.a.V;
			var point = cmd.a.y;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 12:
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 13:
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v2) {
					var x = _v2.a;
					var y = _v2.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 14:
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 15:
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v4) {
					var x = _v4.a;
					var y = _v4.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 16:
			var arc = cmd.a;
			return motionDone(arc.bF) && (motionDone(arc.bG) && (motionDone(arc.ab) && (motionDone(arc.ad) && motionDone(arc.Y))));
		case 17:
			var arc = cmd.a;
			return motionDone(arc.bF) && (motionDone(arc.bG) && (motionDone(arc.ab) && (motionDone(arc.ad) && motionDone(arc.Y))));
		default:
			return true;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$isDone = function (property) {
	var motionDone = function (motion) {
		var runningInterpolation = A2($elm$core$Maybe$withDefault, motion.P, motion.bU);
		switch (runningInterpolation.$) {
			case 0:
				return (!motion.b3) && _Utils_eq(motion.bY, motion.b$);
			case 1:
				var eased = runningInterpolation.a;
				return (eased.bp === 1) || ((!eased.bp) && _Utils_eq(motion.bY, motion.b$));
			default:
				var speed = runningInterpolation.a;
				return _Utils_eq(motion.bY, motion.b$);
		}
	};
	switch (property.$) {
		case 0:
			return true;
		case 1:
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 2:
			var shadow = property.c;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[shadow.v, shadow.w, shadow.A, shadow.s, shadow.q, shadow.p, shadow.k, shadow.j]));
		case 3:
			var m1 = property.b;
			return motionDone(m1);
		case 4:
			var m1 = property.b;
			var m2 = property.c;
			return motionDone(m1) && motionDone(m2);
		case 5:
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3]));
		case 6:
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 7:
			var m1 = property.b;
			return motionDone(m1);
		case 8:
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
		if (!_v0.$) {
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
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
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
			if (_v0.$ === 1) {
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
				if (_v1.$ === 1) {
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
				var _v27 = motion.P;
				if (_v27.$ === 1) {
					var ease = _v27.a;
					return _Utils_update(
						motion,
						{
							P: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								_Utils_update(
									ease,
									{aS: motion.bY})),
							b$: targetMotion.bY
						});
				} else {
					return _Utils_update(
						motion,
						{b$: targetMotion.bY});
				}
			});
		switch (cmd.$) {
			case 0:
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (!targetCmd.$) {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Move,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 1:
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 1) {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 2:
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 2) {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Line,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 3:
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 3) {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$LineTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 4:
				var m1 = cmd.a;
				if (targetCmd.$ === 4) {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 5:
				var m1 = cmd.a;
				if (targetCmd.$ === 5) {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 6:
				var m1 = cmd.a;
				if (targetCmd.$ === 6) {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 7:
				var m1 = cmd.a;
				if (targetCmd.$ === 7) {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 8:
				var points = cmd.a;
				if (targetCmd.$ === 8) {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Curve(
						{
							W: _Utils_Tuple2(
								A2(setMotionTarget, points.W.a, targets.W.a),
								A2(setMotionTarget, points.W.b, targets.W.b)),
							X: _Utils_Tuple2(
								A2(setMotionTarget, points.X.a, targets.X.a),
								A2(setMotionTarget, points.X.b, targets.X.b)),
							y: _Utils_Tuple2(
								A2(setMotionTarget, points.y.a, targets.y.a),
								A2(setMotionTarget, points.y.b, targets.y.b))
						});
				} else {
					return cmd;
				}
			case 9:
				var points = cmd.a;
				if (targetCmd.$ === 9) {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
						{
							W: _Utils_Tuple2(
								A2(setMotionTarget, points.W.a, targets.W.a),
								A2(setMotionTarget, points.W.b, targets.W.b)),
							X: _Utils_Tuple2(
								A2(setMotionTarget, points.X.a, targets.X.a),
								A2(setMotionTarget, points.X.b, targets.X.b)),
							y: _Utils_Tuple2(
								A2(setMotionTarget, points.y.a, targets.y.a),
								A2(setMotionTarget, points.y.b, targets.y.b))
						});
				} else {
					return cmd;
				}
			case 10:
				var points = cmd.a;
				if (targetCmd.$ === 10) {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
						{
							V: _Utils_Tuple2(
								A2(setMotionTarget, points.V.a, targets.V.a),
								A2(setMotionTarget, points.V.b, targets.V.b)),
							y: _Utils_Tuple2(
								A2(setMotionTarget, points.y.a, targets.y.a),
								A2(setMotionTarget, points.y.b, targets.y.b))
						});
				} else {
					return cmd;
				}
			case 11:
				var points = cmd.a;
				if (targetCmd.$ === 11) {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
						{
							V: _Utils_Tuple2(
								A2(setMotionTarget, points.V.a, targets.V.a),
								A2(setMotionTarget, points.V.b, targets.V.b)),
							y: _Utils_Tuple2(
								A2(setMotionTarget, points.y.a, targets.y.a),
								A2(setMotionTarget, points.y.b, targets.y.b))
						});
				} else {
					return cmd;
				}
			case 12:
				var coords = cmd.a;
				if (targetCmd.$ === 12) {
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
			case 13:
				var coords = cmd.a;
				if (targetCmd.$ === 13) {
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
			case 14:
				var coords = cmd.a;
				if (targetCmd.$ === 14) {
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
			case 15:
				var coords = cmd.a;
				if (targetCmd.$ === 15) {
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
			case 16:
				var arc = cmd.a;
				if (targetCmd.$ === 16) {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
						function () {
							var y = arc.bG;
							var x = arc.bF;
							var startAngle = arc.ad;
							var radius = arc.ab;
							var endAngle = arc.Y;
							return _Utils_update(
								arc,
								{
									Y: A2(setMotionTarget, endAngle, target.Y),
									ab: A2(setMotionTarget, radius, target.ab),
									ad: A2(setMotionTarget, startAngle, target.ad),
									bF: A2(setMotionTarget, x, target.bF),
									bG: A2(setMotionTarget, y, target.bG)
								});
						}());
				} else {
					return cmd;
				}
			case 17:
				var arc = cmd.a;
				if (targetCmd.$ === 17) {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
						function () {
							var y = arc.bG;
							var x = arc.bF;
							var startAngle = arc.ad;
							var radius = arc.ab;
							var endAngle = arc.Y;
							return _Utils_update(
								arc,
								{
									Y: A2(setMotionTarget, endAngle, target.Y),
									ab: A2(setMotionTarget, radius, target.ab),
									ad: A2(setMotionTarget, startAngle, target.ad),
									bF: A2(setMotionTarget, x, target.bF),
									bG: A2(setMotionTarget, y, target.bG)
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
						bU: $elm$core$Maybe$Just(targetMotion.P)
					}) : motion;
				var _v13 = newMotion.bU;
				if (_v13.$ === 1) {
					var _v14 = newMotion.P;
					if (_v14.$ === 1) {
						var ease = _v14.a;
						return _Utils_update(
							newMotion,
							{
								P: $mdgriffith$elm_style_animation$Animation$Model$Easing(
									_Utils_update(
										ease,
										{bp: 0, aS: motion.bY})),
								b$: targetMotion.bY
							});
					} else {
						return _Utils_update(
							newMotion,
							{b$: targetMotion.bY});
					}
				} else {
					var override = _v13.a;
					if (override.$ === 1) {
						var ease = override.a;
						return _Utils_update(
							newMotion,
							{
								bU: $elm$core$Maybe$Just(
									$mdgriffith$elm_style_animation$Animation$Model$Easing(
										_Utils_update(
											ease,
											{bp: 0, aS: motion.bY}))),
								b$: targetMotion.bY
							});
					} else {
						return _Utils_update(
							newMotion,
							{b$: targetMotion.bY});
					}
				}
			});
		switch (current.$) {
			case 0:
				var name = current.a;
				var value = current.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 1:
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 1) {
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
			case 2:
				var name = current.a;
				var inset = current.b;
				var shadow = current.c;
				if (newTarget.$ === 2) {
					var targetShadow = newTarget.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							j: A2(setMotionTarget, shadow.j, targetShadow.j),
							k: A2(setMotionTarget, shadow.k, targetShadow.k),
							s: A2(setMotionTarget, shadow.s, targetShadow.s),
							p: A2(setMotionTarget, shadow.p, targetShadow.p),
							v: A2(setMotionTarget, shadow.v, targetShadow.v),
							w: A2(setMotionTarget, shadow.w, targetShadow.w),
							q: A2(setMotionTarget, shadow.q, targetShadow.q),
							A: A2(setMotionTarget, shadow.A, targetShadow.A)
						});
				} else {
					return current;
				}
			case 3:
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 3) {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 4:
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				if (newTarget.$ === 4) {
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
			case 5:
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				if (newTarget.$ === 5) {
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
			case 6:
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 6) {
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
			case 7:
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 7) {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 8:
				var currentPts = current.a;
				if (newTarget.$ === 8) {
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
				if (newTarget.$ === 9) {
					var targets = newTarget.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Path(
						A3($elm$core$List$map2, $mdgriffith$elm_style_animation$Animation$Model$setPathTarget, cmds, targets));
				} else {
					return current;
				}
		}
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
					if (_v3.$ === 1) {
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
				if (!propPair.b.$) {
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
		var interpolationToUse = A2($elm$core$Maybe$withDefault, motion.P, motion.bU);
		var dtms = $elm$time$Time$posixToMillis(posix);
		switch (interpolationToUse.$) {
			case 2:
				var perSecond = interpolationToUse.a.bk;
				var _v1 = function () {
					if (_Utils_cmp(motion.bY, motion.b$) < 0) {
						var _new = motion.bY + (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.b$) > -1);
					} else {
						var _new = motion.bY - (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.b$) < 1);
					}
				}();
				var newPos = _v1.a;
				var finished = _v1.b;
				return finished ? _Utils_update(
					motion,
					{bY: motion.b$, b3: 0.0}) : _Utils_update(
					motion,
					{bY: newPos, b3: perSecond * 1000});
			case 0:
				var stiffness = interpolationToUse.a.bx;
				var damping = interpolationToUse.a.a4;
				var fspring = stiffness * (motion.b$ - motion.bY);
				var fdamper = ((-1) * damping) * motion.b3;
				var dt = dtms / 1000;
				var a = fspring + fdamper;
				var newVelocity = motion.b3 + (a * dt);
				var newPos = motion.bY + (newVelocity * dt);
				var dx = $elm$core$Basics$abs(motion.b$ - newPos);
				return ((_Utils_cmp(dx, $mdgriffith$elm_style_animation$Animation$Model$tolerance) < 0) && (_Utils_cmp(
					$elm$core$Basics$abs(newVelocity),
					$mdgriffith$elm_style_animation$Animation$Model$vTolerance) < 0)) ? _Utils_update(
					motion,
					{bY: motion.b$, b3: 0.0}) : _Utils_update(
					motion,
					{bY: newPos, b3: newVelocity});
			default:
				var progress = interpolationToUse.a.bp;
				var duration = interpolationToUse.a.aw;
				var ease = interpolationToUse.a.ax;
				var start = interpolationToUse.a.aS;
				var durationMs = $elm$time$Time$posixToMillis(duration);
				var newProgress = (((dtms / durationMs) + progress) < 1) ? ((dtms / durationMs) + progress) : 1;
				var eased = ease(newProgress);
				var distance = motion.b$ - start;
				var newPos = ((((eased * distance) + start) * 10000) | 0) / 10000;
				var newVelocity = (newProgress === 1) ? 0 : ((newPos - motion.bY) / dtms);
				var _v2 = motion.bU;
				if (_v2.$ === 1) {
					return _Utils_update(
						motion,
						{
							P: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								{aw: duration, ax: ease, bp: newProgress, aS: start}),
							bY: newPos,
							b3: newVelocity
						});
				} else {
					var override = _v2.a;
					return _Utils_update(
						motion,
						{
							bU: $elm$core$Maybe$Just(
								$mdgriffith$elm_style_animation$Animation$Model$Easing(
									{aw: duration, ax: ease, bp: newProgress, aS: start})),
							bY: newPos,
							b3: newVelocity
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
			case 0:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 1:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 2:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 3:
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 4:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 5:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 6:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 7:
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 8:
				var control1 = cmd.a.W;
				var control2 = cmd.a.X;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						W: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						X: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						y: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 9:
				var control1 = cmd.a.W;
				var control2 = cmd.a.X;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						W: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						X: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						y: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 10:
				var control = cmd.a.V;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						V: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						y: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 11:
				var control = cmd.a.V;
				var point = cmd.a.y;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						V: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						y: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 12:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					stepCoords(coords));
			case 13:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					stepCoords(coords));
			case 14:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					stepCoords(coords));
			case 15:
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					stepCoords(coords));
			case 16:
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					_Utils_update(
						arc,
						{
							Y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.Y),
							ab: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.ab),
							ad: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.ad),
							bF: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.bF),
							bG: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.bG)
						}));
			case 17:
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					_Utils_update(
						arc,
						{
							Y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.Y),
							ab: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.ab),
							ad: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.ad),
							bF: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.bF),
							bG: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.bG)
						}));
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$step = F2(
	function (dt, props) {
		var stepProp = function (property) {
			switch (property.$) {
				case 0:
					var name = property.a;
					var value = property.b;
					return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
				case 3:
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 4:
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$Property2,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2));
				case 5:
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
				case 6:
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
				case 7:
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 1:
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
				case 2:
					var name = property.a;
					var inset = property.b;
					var shadow = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							j: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.j),
							k: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.k),
							s: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.s),
							p: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.p),
							v: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.v),
							w: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.w),
							q: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.q),
							A: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.A)
						});
				case 8:
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
			if (_v0.$ === 1) {
				return _Utils_Tuple3(currentStyle, _List_Nil, _List_Nil);
			} else {
				var currentStep = _v0.a;
				switch (currentStep.$) {
					case 4:
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
					case 5:
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
					case 1:
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
					case 2:
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
					case 3:
						var props = currentStep.a;
						var $temp$currentStyle = A2($mdgriffith$elm_style_animation$Animation$Model$replaceProps, currentStyle, props),
							$temp$steps = A2($elm$core$List$drop, 1, steps),
							$temp$dt = dt;
						currentStyle = $temp$currentStyle;
						steps = $temp$steps;
						dt = $temp$dt;
						continue resolveSteps;
					case 0:
						var stepped = A2($mdgriffith$elm_style_animation$Animation$Model$step, dt, currentStyle);
						return A2($elm$core$List$all, $mdgriffith$elm_style_animation$Animation$Model$isDone, stepped) ? _Utils_Tuple3(
							A2(
								$elm$core$List$map,
								$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
									function (m) {
										return _Utils_update(
											m,
											{bU: $elm$core$Maybe$Nothing});
									}),
								stepped),
							_List_Nil,
							A2($elm$core$List$drop, 1, steps)) : _Utils_Tuple3(stepped, _List_Nil, steps);
					case 7:
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
		var now = _v0;
		var model = _v1;
		var timing = A2($mdgriffith$elm_style_animation$Animation$Model$refreshTiming, now, model.bC);
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
							$elm$time$Time$posixToMillis(wait) - $elm$time$Time$posixToMillis(timing.bM)),
						mySteps);
				},
				model.aE));
		var readyInterruption = _v2.a;
		var queuedInterruptions = _v2.b;
		var _v5 = function () {
			var _v6 = $elm$core$List$head(readyInterruption);
			if (!_v6.$) {
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
									{bU: $elm$core$Maybe$Nothing});
							}),
						model.by));
			} else {
				return _Utils_Tuple2(model.aV, model.by);
			}
		}();
		var steps = _v5.a;
		var style = _v5.b;
		var _v8 = A3($mdgriffith$elm_style_animation$Animation$Model$resolveSteps, style, steps, timing.bM);
		var revisedStyle = _v8.a;
		var sentMessages = _v8.b;
		var revisedSteps = _v8.c;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					aE: queuedInterruptions,
					ak: (!(!$elm$core$List$length(revisedSteps))) || (!(!$elm$core$List$length(queuedInterruptions))),
					aV: revisedSteps,
					by: revisedStyle,
					bC: timing
				}),
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
var $mdgriffith$elm_style_animation$Animation$Messenger$update = F2(
	function (tick, animation) {
		return A2($mdgriffith$elm_style_animation$Animation$Model$updateAnimation, tick, animation);
	});
var $author$project$Main$update = F2(
	function (action, model) {
		switch (action.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var tags = action.a;
				var foodPanel = model.h;
				var _v1 = A2($author$project$Main$calcEat, model, tags);
				var points = _v1.a;
				var damage = _v1.b;
				var nextMsg = (damage > 0) ? $author$project$Main$Damage(damage) : $author$project$Main$Idle;
				var newAnimationState = A2(
					$mdgriffith$elm_style_animation$Animation$queue,
					_List_fromArray(
						[
							$mdgriffith$elm_style_animation$Animation$to(
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(0)
								])),
							$mdgriffith$elm_style_animation$Animation$Messenger$send($author$project$Main$ShuffleFood),
							$mdgriffith$elm_style_animation$Animation$Messenger$send(nextMsg),
							$mdgriffith$elm_style_animation$Animation$to(
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(1)
								]))
						]),
					model.h.e);
				var newFoodPanel = _Utils_update(
					foodPanel,
					{e: newAnimationState});
				var newScore = model.z + points;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newFoodPanel, z: newScore}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var points = action.a;
				var newHpState = A2(
					$mdgriffith$elm_style_animation$Animation$queue,
					_List_fromArray(
						[
							$mdgriffith$elm_style_animation$Animation$to(
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_style_animation$Animation$translate,
									$mdgriffith$elm_style_animation$Animation$px(0),
									$mdgriffith$elm_style_animation$Animation$px(100)),
									$mdgriffith$elm_style_animation$Animation$opacity(0)
								])),
							$mdgriffith$elm_style_animation$Animation$Messenger$send(
							$author$project$Main$HpCheck(points))
						]),
					model.f.e);
				var newHp = A2($author$project$Main$Hp, model.f.al, newHpState);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{f: newHp}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var points = action.a;
				var hpLeft = model.f.al - points;
				var newScreen = (!hpLeft) ? 0 : 1;
				if (!newScreen) {
					var newBestResults = A2(
						$author$project$Main$selectBestResults,
						model.ah,
						A2($author$project$Main$BestResult, model.t.O, model.z));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ah: newBestResults, f: $author$project$Main$initHp, z: 0, ac: newScreen}),
						$elm$core$Platform$Cmd$none);
				} else {
					var newHp = A2(
						$author$project$Main$Hp,
						hpLeft,
						$mdgriffith$elm_style_animation$Animation$style(
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(1),
									A2(
									$mdgriffith$elm_style_animation$Animation$translate,
									$mdgriffith$elm_style_animation$Animation$px(0),
									$mdgriffith$elm_style_animation$Animation$px(0))
								])));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{f: newHp, ac: newScreen}),
						$elm$core$Platform$Cmd$none);
				}
			case 4:
				var hero = action.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{t: hero, ac: 1}),
					$elm$core$Platform$Cmd$none);
			case 5:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$random$Random$generate,
						$author$project$Main$Shuffle,
						$elm_community$random_extra$Random$List$shuffle(model.h.Z)));
			case 6:
				var randomFoods = action.a;
				var foodPanel = model.h;
				var newFoodPanel = _Utils_update(
					foodPanel,
					{Z: randomFoods});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newFoodPanel}),
					$elm$core$Platform$Cmd$none);
			default:
				var aObj = action.a;
				var aMsg = action.b;
				if (aObj === 1) {
					var hp = model.f;
					var _v4 = A2($mdgriffith$elm_style_animation$Animation$Messenger$update, aMsg, model.f.e);
					var stateHp = _v4.a;
					var cmdHp = _v4.b;
					var newHp = _Utils_update(
						hp,
						{e: stateHp});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{f: newHp}),
						cmdHp);
				} else {
					var foodPanel = model.h;
					var _v5 = A2($mdgriffith$elm_style_animation$Animation$Messenger$update, aMsg, model.h.e);
					var stateFood = _v5.a;
					var cmdFood = _v5.b;
					var newFoodPanel = _Utils_update(
						foodPanel,
						{e: stateFood});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{h: newFoodPanel}),
						cmdFood);
				}
		}
	});
var $surprisetalk$elm_bulma$Bulma$Layout$NotSpaced = 0;
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
var $elm$html$Html$div = _VirtualDom_node('div');
var $surprisetalk$elm_bulma$Bulma$Columns$Gap2 = 2;
var $surprisetalk$elm_bulma$Bulma$Columns$MobileAndBeyond = 0;
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
	var widths = _v0.an;
	var offset = _v0.bh;
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$column,
				function () {
				var _v1 = widths.aI;
				if (!_v1.$) {
					switch (_v1.a) {
						case 0:
							var _v2 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 1:
							var _v3 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Mobile;
						case 2:
							var _v4 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Mobile;
						case 3:
							var _v5 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Mobile;
						case 4:
							var _v6 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Mobile;
						case 5:
							var _v7 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Mobile;
						case 6:
							var _v8 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Mobile;
						case 7:
							var _v9 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Mobile;
						case 8:
							var _v10 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Mobile;
						case 9:
							var _v11 = _v1.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Mobile;
						case 10:
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
				var _v14 = widths.aY;
				if (!_v14.$) {
					switch (_v14.a) {
						case 0:
							var _v15 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 1:
							var _v16 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Tablet;
						case 2:
							var _v17 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Tablet;
						case 3:
							var _v18 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Tablet;
						case 4:
							var _v19 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Tablet;
						case 5:
							var _v20 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Tablet;
						case 6:
							var _v21 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Tablet;
						case 7:
							var _v22 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Tablet;
						case 8:
							var _v23 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Tablet;
						case 9:
							var _v24 = _v14.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Tablet;
						case 10:
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
				var _v27 = widths.at;
				if (!_v27.$) {
					switch (_v27.a) {
						case 0:
							var _v28 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 1:
							var _v29 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Desktop;
						case 2:
							var _v30 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Desktop;
						case 3:
							var _v31 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Desktop;
						case 4:
							var _v32 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Desktop;
						case 5:
							var _v33 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Desktop;
						case 6:
							var _v34 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Desktop;
						case 7:
							var _v35 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Desktop;
						case 8:
							var _v36 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Desktop;
						case 9:
							var _v37 = _v27.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Desktop;
						case 10:
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
				var _v40 = widths.a_;
				if (!_v40.$) {
					switch (_v40.a) {
						case 0:
							var _v41 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 1:
							var _v42 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01Widescreen;
						case 2:
							var _v43 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02Widescreen;
						case 3:
							var _v44 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03Widescreen;
						case 4:
							var _v45 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04Widescreen;
						case 5:
							var _v46 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05Widescreen;
						case 6:
							var _v47 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06Widescreen;
						case 7:
							var _v48 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07Widescreen;
						case 8:
							var _v49 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08Widescreen;
						case 9:
							var _v50 = _v40.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09Widescreen;
						case 10:
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
				var _v53 = widths.ay;
				if (!_v53.$) {
					switch (_v53.a) {
						case 0:
							var _v54 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$none;
						case 1:
							var _v55 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is01FullHD;
						case 2:
							var _v56 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is02FullHD;
						case 3:
							var _v57 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is03FullHD;
						case 4:
							var _v58 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is04FullHD;
						case 5:
							var _v59 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is05FullHD;
						case 6:
							var _v60 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is06FullHD;
						case 7:
							var _v61 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is07FullHD;
						case 8:
							var _v62 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is08FullHD;
						case 9:
							var _v63 = _v53.a;
							return $surprisetalk$elm_bulma$Bulma$Classes$is09FullHD;
						case 10:
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
				switch (offset) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset01;
					case 2:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset02;
					case 3:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset03;
					case 4:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset04;
					case 5:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset05;
					case 6:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset06;
					case 7:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset07;
					case 8:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset08;
					case 9:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset09;
					case 10:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset10;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isOffset11;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Modifiers$Auto = 0;
var $surprisetalk$elm_bulma$Bulma$Columns$columnModifiers = {
	bh: 0,
	an: {
		at: $elm$core$Maybe$Just(0),
		ay: $elm$core$Maybe$Just(0),
		aI: $elm$core$Maybe$Just(0),
		aY: $elm$core$Maybe$Just(0),
		a_: $elm$core$Maybe$Just(0)
	}
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
	var centered = _v0.ar;
	var multiline = _v0.aJ;
	var gap = _v0.ba;
	var display = _v0.av;
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
				if (!gap) {
					return $surprisetalk$elm_bulma$Bulma$Classes$isGapless;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}(),
				function () {
				switch (gap) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$is0;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 2:
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 3:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 4:
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 5:
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					case 6:
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
					case 7:
						return $surprisetalk$elm_bulma$Bulma$Classes$is7;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is8;
				}
			}(),
				function () {
				switch (display) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$isMobile;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isDesktop;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Columns$Gap3 = 3;
var $surprisetalk$elm_bulma$Bulma$Columns$TabletAndBeyond = 1;
var $surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers = {ar: false, av: 1, ba: 3, aJ: false};
var $author$project$Main$Eat = function (a) {
	return {$: 1, a: a};
};
var $surprisetalk$elm_bulma$Bulma$Elements$H3 = 2;
var $surprisetalk$elm_bulma$Bulma$Elements$OneByOne = function (a) {
	return {$: 1, a: a};
};
var $surprisetalk$elm_bulma$Bulma$Elements$Unbounded = 7;
var $surprisetalk$elm_bulma$Bulma$Classes$box = $elm$html$Html$Attributes$class('box');
var $surprisetalk$elm_bulma$Bulma$Elements$box = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$box]));
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
					case 1:
						switch (shape.a) {
							case 7:
								var _v1 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is1by1;
							case 0:
								var _v2 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is16x16;
							case 1:
								var _v3 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is24x24;
							case 2:
								var _v4 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is32x32;
							case 3:
								var _v5 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is48x48;
							case 4:
								var _v6 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is64x64;
							case 5:
								var _v7 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is96x96;
							default:
								var _v8 = shape.a;
								return $surprisetalk$elm_bulma$Bulma$Classes$is128x128;
						}
					case 2:
						return $surprisetalk$elm_bulma$Bulma$Classes$is4by3;
					case 3:
						return $surprisetalk$elm_bulma$Bulma$Classes$is3by2;
					case 4:
						return $surprisetalk$elm_bulma$Bulma$Classes$is16by9;
					case 5:
						return $surprisetalk$elm_bulma$Bulma$Classes$is2by1;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}()
			]));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
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
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $surprisetalk$elm_bulma$Bulma$Classes$is3 = $elm$html$Html$Attributes$class('is-3');
var $surprisetalk$elm_bulma$Bulma$Classes$title = $elm$html$Html$Attributes$class('title');
var $surprisetalk$elm_bulma$Bulma$Elements$title = function (size) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		function () {
			switch (size) {
				case 0:
					return 'h1';
				case 1:
					return 'h2';
				case 2:
					return 'h3';
				case 3:
					return 'h4';
				case 4:
					return 'h5';
				default:
					return 'h6';
			}
		}(),
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$title,
				function () {
				switch (size) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 2:
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 3:
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 4:
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
				}
			}()
			]));
};
var $author$project$Main$foodCard = function (maybeFood) {
	if (maybeFood.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var food = maybeFood.a;
		return A2(
			$surprisetalk$elm_bulma$Bulma$Elements$box,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(
					$author$project$Main$Eat(food.bB))
				]),
			_List_fromArray(
				[
					A3(
					$surprisetalk$elm_bulma$Bulma$Elements$image,
					$surprisetalk$elm_bulma$Bulma$Elements$OneByOne(7),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(food.C),
									A2($elm$html$Html$Attributes$style, 'border-radius', '10px')
								]),
							_List_Nil)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Elements$title,
					2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('has-text-centered')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(food.aa)
						]))
				]));
	}
};
var $surprisetalk$elm_bulma$Bulma$Classes$hasTextCentered = $elm$html$Html$Attributes$class('has-text-centered');
var $surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered = $surprisetalk$elm_bulma$Bulma$Classes$hasTextCentered;
var $author$project$Main$foodPair = F3(
	function (foods, i, j) {
		return A3(
			$surprisetalk$elm_bulma$Bulma$Columns$columns,
			_Utils_update(
				$surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers,
				{ar: true, av: 0, ba: 2}),
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-6'),
							$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
						]),
					_List_fromArray(
						[
							$author$project$Main$foodCard(
							A2($elm$core$Array$get, i, foods))
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-6'),
							$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
						]),
					_List_fromArray(
						[
							$author$project$Main$foodCard(
							A2($elm$core$Array$get, j, foods))
						]))
				]));
	});
var $author$project$Main$foodRow = function (foods) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Columns$columns,
		_Utils_update(
			$surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers,
			{ar: true, av: 0, ba: 2}),
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Columns$column,
				$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-3'),
						$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
					]),
				_List_fromArray(
					[
						$author$project$Main$foodCard(
						A2($elm$core$Array$get, 0, foods))
					])),
				A3(
				$surprisetalk$elm_bulma$Bulma$Columns$column,
				$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-3'),
						$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
					]),
				_List_fromArray(
					[
						$author$project$Main$foodCard(
						A2($elm$core$Array$get, 1, foods))
					])),
				A3(
				$surprisetalk$elm_bulma$Bulma$Columns$column,
				$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-3'),
						$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
					]),
				_List_fromArray(
					[
						$author$project$Main$foodCard(
						A2($elm$core$Array$get, 2, foods))
					])),
				A3(
				$surprisetalk$elm_bulma$Bulma$Columns$column,
				$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-3'),
						$surprisetalk$elm_bulma$Bulma$Modifiers$Typography$textCentered
					]),
				_List_fromArray(
					[
						$author$project$Main$foodCard(
						A2($elm$core$Array$get, 3, foods))
					]))
			]));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
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
					return $elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY));
				},
				coords));
	};
	switch (cmd.$) {
		case 0:
			var x = cmd.a;
			var y = cmd.b;
			return 'm ' + ($elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY)));
		case 1:
			var x = cmd.a;
			var y = cmd.b;
			return 'M ' + ($elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY)));
		case 2:
			var x = cmd.a;
			var y = cmd.b;
			return 'l ' + ($elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY)));
		case 3:
			var x = cmd.a;
			var y = cmd.b;
			return 'L ' + ($elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY)));
		case 4:
			var a = cmd.a;
			return 'h ' + $elm$core$String$fromFloat(a.bY);
		case 5:
			var a = cmd.a;
			return 'H ' + $elm$core$String$fromFloat(a.bY);
		case 6:
			var a = cmd.a;
			return 'v ' + $elm$core$String$fromFloat(a.bY);
		case 7:
			var a = cmd.a;
			return 'V ' + $elm$core$String$fromFloat(a.bY);
		case 8:
			var control1 = cmd.a.W;
			var control2 = cmd.a.X;
			var point = cmd.a.y;
			var _v1 = point;
			var p1x = _v1.a;
			var p1y = _v1.b;
			var _v2 = control2;
			var c2x = _v2.a;
			var c2y = _v2.b;
			var _v3 = control1;
			var c1x = _v3.a;
			var c1y = _v3.b;
			return 'c ' + ($elm$core$String$fromFloat(c1x.bY) + (' ' + ($elm$core$String$fromFloat(c1y.bY) + (', ' + ($elm$core$String$fromFloat(c2x.bY) + (' ' + ($elm$core$String$fromFloat(c2y.bY) + (', ' + ($elm$core$String$fromFloat(p1x.bY) + (' ' + $elm$core$String$fromFloat(p1y.bY)))))))))));
		case 9:
			var control1 = cmd.a.W;
			var control2 = cmd.a.X;
			var point = cmd.a.y;
			var _v4 = point;
			var p1x = _v4.a;
			var p1y = _v4.b;
			var _v5 = control2;
			var c2x = _v5.a;
			var c2y = _v5.b;
			var _v6 = control1;
			var c1x = _v6.a;
			var c1y = _v6.b;
			return 'C ' + ($elm$core$String$fromFloat(c1x.bY) + (' ' + ($elm$core$String$fromFloat(c1y.bY) + (', ' + ($elm$core$String$fromFloat(c2x.bY) + (' ' + ($elm$core$String$fromFloat(c2y.bY) + (', ' + ($elm$core$String$fromFloat(p1x.bY) + (' ' + $elm$core$String$fromFloat(p1y.bY)))))))))));
		case 10:
			var control = cmd.a.V;
			var point = cmd.a.y;
			var _v7 = point;
			var p1x = _v7.a;
			var p1y = _v7.b;
			var _v8 = control;
			var c1x = _v8.a;
			var c1y = _v8.b;
			return 'q ' + ($elm$core$String$fromFloat(c1x.bY) + (' ' + ($elm$core$String$fromFloat(c1y.bY) + (', ' + ($elm$core$String$fromFloat(p1x.bY) + (' ' + $elm$core$String$fromFloat(p1y.bY)))))));
		case 11:
			var control = cmd.a.V;
			var point = cmd.a.y;
			var _v9 = point;
			var p1x = _v9.a;
			var p1y = _v9.b;
			var _v10 = control;
			var c1x = _v10.a;
			var c1y = _v10.b;
			return 'Q ' + ($elm$core$String$fromFloat(c1x.bY) + (' ' + ($elm$core$String$fromFloat(c1y.bY) + (', ' + ($elm$core$String$fromFloat(p1x.bY) + (' ' + $elm$core$String$fromFloat(p1y.bY)))))));
		case 12:
			var points = cmd.a;
			return 't ' + renderPoints(points);
		case 13:
			var points = cmd.a;
			return 'T ' + renderPoints(points);
		case 14:
			var points = cmd.a;
			return 's ' + renderPoints(points);
		case 15:
			var points = cmd.a;
			return 'S ' + renderPoints(points);
		case 16:
			var arc = cmd.a;
			var deltaAngle = arc.Y.bY - arc.ad.bY;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.ab.bY * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.ad.bY));
				var dx = arc.ab.bY * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.ad.bY));
				return 'A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.bF.bY - dx) + (',' + ($elm$core$String$fromFloat(arc.bG.bY - dy) + (' A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.bF.bY + dx) + (',' + $elm$core$String$fromFloat(arc.bG.bY + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (' 0 ' + (((deltaAngle >= 180) ? '1' : '0') + (' ' + ('1' + (' ' + ($elm$core$String$fromFloat(
					arc.bF.bY + (arc.ab.bY * $elm$core$Basics$cos(
						$elm$core$Basics$degrees(arc.Y.bY)))) + (',' + $elm$core$String$fromFloat(
					arc.bG.bY + (arc.ab.bY * $elm$core$Basics$sin(
						$elm$core$Basics$degrees(arc.Y.bY))))))))))))));
			}
		case 17:
			var arc = cmd.a;
			var deltaAngle = arc.Y.bY - arc.ad.bY;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.ab.bY * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.ad.bY));
				var dx = arc.ab.bY * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.ad.bY));
				return 'A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (',0,1,0,' + ($elm$core$String$fromFloat(arc.bF.bY - dx) + (',' + ($elm$core$String$fromFloat(arc.bG.bY - dy) + (' A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.bF.bY + dx) + (',' + $elm$core$String$fromFloat(arc.bG.bY + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.ab.bY) + (',' + ($elm$core$String$fromFloat(arc.ab.bY) + (' 0 ' + ((((arc.ad.bY - arc.Y.bY) >= 180) ? '1' : '0') + (' ' + ('0' + (' ' + ($elm$core$String$fromFloat(
					arc.bF.bY + (arc.ab.bY * $elm$core$Basics$cos(arc.Y.bY))) + (',' + $elm$core$String$fromFloat(
					arc.bG.bY + (arc.ab.bY * $elm$core$Basics$sin(arc.Y.bY)))))))))))));
			}
		default:
			return 'z';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$propertyValue = F2(
	function (prop, delim) {
		switch (prop.$) {
			case 0:
				var value = prop.b;
				return value;
			case 1:
				var r = prop.b;
				var g = prop.c;
				var b = prop.d;
				var a = prop.e;
				return 'rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(r.bY)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(g.bY)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(b.bY)) + (',' + ($elm$core$String$fromFloat(a.bY) + ')')))))));
			case 2:
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				return (inset ? 'inset ' : '') + ($elm$core$String$fromFloat(shadow.v.bY) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.w.bY) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.s.bY) + ('px' + (' ' + ((((name === 'text-shadow') || (name === 'drop-shadow')) ? '' : ($elm$core$String$fromFloat(shadow.A.bY) + ('px' + ' '))) + ('rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.q.bY)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.p.bY)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.k.bY)) + (', ' + ($elm$core$String$fromFloat(shadow.j.bY) + ')'))))))))))))))))));
			case 3:
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.bY),
					x.b1);
			case 4:
				var x = prop.b;
				var y = prop.c;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.bY),
					_Utils_ap(
						x.b1,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.bY),
								y.b1))));
			case 5:
				var x = prop.b;
				var y = prop.c;
				var z = prop.d;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.bY),
					_Utils_ap(
						x.b1,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.bY),
								_Utils_ap(
									y.b1,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(z.bY),
											z.b1)))))));
			case 6:
				var w = prop.b;
				var x = prop.c;
				var y = prop.d;
				var z = prop.e;
				return _Utils_ap(
					$elm$core$String$fromFloat(w.bY),
					_Utils_ap(
						w.b1,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(x.bY),
								_Utils_ap(
									x.b1,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(y.bY),
											_Utils_ap(
												y.b1,
												_Utils_ap(
													delim,
													_Utils_ap(
														$elm$core$String$fromFloat(z.bY),
														z.b1))))))))));
			case 7:
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.bY),
					x.b1);
			case 8:
				var coords = prop.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return $elm$core$String$fromFloat(x.bY) + (',' + $elm$core$String$fromFloat(y.bY));
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
			case 8:
				var pts = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$points(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 9:
				var cmds = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$d(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 3:
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
			case 6:
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
			case 8:
				return true;
			case 9:
				return true;
			case 3:
				var name = prop.a;
				return (name === 'cx') || ((name === 'cy') || ((name === 'x') || ((name === 'y') || ((name === 'rx') || ((name === 'ry') || ((name === 'r') || (name === 'offset')))))));
			case 6:
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
	if (prop.$ === 5) {
		var x = prop.b;
		var y = prop.c;
		var z = prop.d;
		return 'rotateX(' + ($elm$core$String$fromFloat(x.bY) + (x.b1 + (') rotateY(' + ($elm$core$String$fromFloat(y.bY) + (y.b1 + (') rotateZ(' + ($elm$core$String$fromFloat(z.bY) + (z.b1 + ')'))))))));
	} else {
		return '';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$renderValues = function (_v0) {
	var model = _v0;
	var _v1 = A2($elm$core$List$partition, $mdgriffith$elm_style_animation$Animation$Render$isAttr, model.by);
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
var $author$project$Main$foodGrid = function (model) {
	var foods = $elm$core$Array$fromList(
		A2($elm$core$List$take, 4, model.h.Z));
	return A2(
		$elm$html$Html$div,
		$mdgriffith$elm_style_animation$Animation$render(model.h.e),
		function () {
			var _v0 = model.l.a6;
			if (!_v0) {
				return _List_fromArray(
					[
						A3($author$project$Main$foodPair, foods, 0, 1),
						A3($author$project$Main$foodPair, foods, 2, 3)
					]);
			} else {
				return _List_fromArray(
					[
						$author$project$Main$foodRow(foods)
					]);
			}
		}());
};
var $author$project$Main$ChangeHero = function (a) {
	return {$: 4, a: a};
};
var $surprisetalk$elm_bulma$Bulma$Elements$H1 = 0;
var $surprisetalk$elm_bulma$Bulma$Elements$H2 = 1;
var $surprisetalk$elm_bulma$Bulma$Classes$card = $elm$html$Html$Attributes$class('card');
var $surprisetalk$elm_bulma$Bulma$Components$card = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$card]));
var $surprisetalk$elm_bulma$Bulma$Classes$cardContent = $elm$html$Html$Attributes$class('card-content');
var $surprisetalk$elm_bulma$Bulma$Components$cardContent = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$cardContent]));
var $author$project$Main$chuck = A6(
	$author$project$Main$Hero,
	2,
	'Chuck Muffin',
	'Fan of organic food and healthy drinks. Avoid unhealthy products, except desserts.',
	'images/hero/chuck.png',
	_List_fromArray(
		[0, 3, 4]),
	_List_fromArray(
		[2, 1]));
var $surprisetalk$elm_bulma$Bulma$Classes$media = $elm$html$Html$Attributes$class('media');
var $surprisetalk$elm_bulma$Bulma$Layout$media = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'article',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$media]));
var $surprisetalk$elm_bulma$Bulma$Classes$mediaContent = $elm$html$Html$Attributes$class('media-content');
var $surprisetalk$elm_bulma$Bulma$Layout$mediaContent = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$mediaContent]));
var $surprisetalk$elm_bulma$Bulma$Classes$mediaLeft = $elm$html$Html$Attributes$class('media-left');
var $surprisetalk$elm_bulma$Bulma$Layout$mediaLeft = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$mediaLeft]));
var $author$project$Main$circle = F3(
	function (color, ds, child) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
					A2($elm$html$Html$Attributes$style, 'background-color', color),
					A2($elm$html$Html$Attributes$style, 'position', 'relative'),
					A2($elm$html$Html$Attributes$style, 'width', ds.aP),
					A2($elm$html$Html$Attributes$style, 'height', ds.aP),
					A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
					A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
					A2($elm$html$Html$Attributes$style, 'bottom', ds.bv),
					A2($elm$html$Html$Attributes$style, 'left', '')
				]),
			_List_fromArray(
				[child]));
	});
var $author$project$Main$resultText = F2(
	function (heroId, brs) {
		var bestResults = A2(
			$elm$core$List$filter,
			function (x) {
				return _Utils_eq(x.ai, heroId);
			},
			brs);
		var br = A2(
			$elm$core$Array$get,
			0,
			$elm$core$Array$fromList(bestResults));
		if (br.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var val = br.a;
			return $elm$html$Html$text(
				$elm$core$String$fromInt(val.z));
		}
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Main$score = F3(
	function (heroId, results, model) {
		return A3(
			$author$project$Main$circle,
			'gold',
			model.l,
			A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', model.l.bw)
					]),
				_List_fromArray(
					[
						A2($author$project$Main$resultText, heroId, results)
					])));
	});
var $surprisetalk$elm_bulma$Bulma$Classes$subtitle = $elm$html$Html$Attributes$class('subtitle');
var $surprisetalk$elm_bulma$Bulma$Elements$subtitle = function (size) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		function () {
			switch (size) {
				case 0:
					return 'h1';
				case 1:
					return 'h2';
				case 2:
					return 'h3';
				case 3:
					return 'h4';
				case 4:
					return 'h5';
				default:
					return 'h6';
			}
		}(),
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$subtitle,
				function () {
				switch (size) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$is1;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$is2;
					case 2:
						return $surprisetalk$elm_bulma$Bulma$Classes$is3;
					case 3:
						return $surprisetalk$elm_bulma$Bulma$Classes$is4;
					case 4:
						return $surprisetalk$elm_bulma$Bulma$Classes$is5;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$is6;
				}
			}()
			]));
};
var $author$project$Main$terry = A6(
	$author$project$Main$Hero,
	3,
	'Terry Fatness',
	'Fast-food maniac and meat lover. Vomit on healthy food and desserts.',
	'images/hero/terry.png',
	_List_fromArray(
		[1]),
	_List_fromArray(
		[2, 0, 3, 4]));
var $author$project$Main$heroList = function (model) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return A2(
				$surprisetalk$elm_bulma$Bulma$Components$card,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$surprisetalk$elm_bulma$Bulma$Components$cardContent,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$surprisetalk$elm_bulma$Bulma$Layout$media,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Main$ChangeHero(x))
									]),
								_List_fromArray(
									[
										A2(
										$surprisetalk$elm_bulma$Bulma$Layout$mediaLeft,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', model.l.aA)
											]),
										_List_fromArray(
											[
												A3(
												$surprisetalk$elm_bulma$Bulma$Elements$image,
												$surprisetalk$elm_bulma$Bulma$Elements$OneByOne(7),
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$img,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$src(x.C),
																$elm$html$Html$Attributes$class('is-rounded')
															]),
														_List_Nil)
													])),
												A3($author$project$Main$score, x.O, model.ah, model)
											])),
										A2(
										$surprisetalk$elm_bulma$Bulma$Layout$mediaContent,
										_List_Nil,
										_List_fromArray(
											[
												A3(
												$surprisetalk$elm_bulma$Bulma$Elements$title,
												0,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(x.aa)
													])),
												A3(
												$surprisetalk$elm_bulma$Bulma$Elements$subtitle,
												1,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(x.as)
													]))
											]))
									]))
							]))
					]));
		},
		_List_fromArray(
			[$author$project$Main$arnold, $author$project$Main$chuck, $author$project$Main$terry]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$isActive = $elm$html$Html$Attributes$class('is-active');
var $surprisetalk$elm_bulma$Bulma$Classes$modal = $elm$html$Html$Attributes$class('modal');
var $surprisetalk$elm_bulma$Bulma$Components$modal = function (active) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'div',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$modal,
				function () {
				if (active) {
					return $surprisetalk$elm_bulma$Bulma$Classes$isActive;
				} else {
					return $surprisetalk$elm_bulma$Bulma$Classes$none;
				}
			}()
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$modalBackground = $elm$html$Html$Attributes$class('modal-background');
var $surprisetalk$elm_bulma$Bulma$Components$modalBackground = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$modalBackground]));
var $surprisetalk$elm_bulma$Bulma$Classes$modalContent = $elm$html$Html$Attributes$class('modal-content');
var $surprisetalk$elm_bulma$Bulma$Components$modalContent = A2(
	$surprisetalk$elm_bulma$Helpers$node,
	'div',
	_List_fromArray(
		[$surprisetalk$elm_bulma$Bulma$Classes$modalContent]));
var $author$project$Main$gameModal = function (model) {
	var isVisible = !model.ac;
	return A3(
		$surprisetalk$elm_bulma$Bulma$Components$modal,
		isVisible,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$surprisetalk$elm_bulma$Bulma$Components$modalBackground,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background-color', '#fff')
					]),
				_List_Nil),
				A2(
				$surprisetalk$elm_bulma$Bulma$Components$modalContent,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '90%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-centered')
							]),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '5rem')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('EatNotEat')
									])),
							$author$project$Main$heroList(model)))
					]))
			]));
};
var $author$project$Main$heart = function (size) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$surprisetalk$elm_bulma$Bulma$Elements$image,
				$surprisetalk$elm_bulma$Bulma$Elements$OneByOne(size),
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src('images/hero/heart.png')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Main$hpContainer = function (model) {
	var _v0 = model.f.al;
	switch (_v0) {
		case 1:
			return _List_fromArray(
				[
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-4'),
								A2($elm$html$Html$Attributes$style, 'opacity', '1')
							]),
						$mdgriffith$elm_style_animation$Animation$render(model.f.e)),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-8')
						]),
					_List_Nil)
				]);
		case 2:
			return _List_fromArray(
				[
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-4')
						]),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-4'),
								A2($elm$html$Html$Attributes$style, 'opacity', '1')
							]),
						$mdgriffith$elm_style_animation$Animation$render(model.f.e)),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-4')
						]),
					_List_Nil)
				]);
		case 3:
			return _List_fromArray(
				[
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-4')
						]),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('is-4')
						]),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						])),
					A3(
					$surprisetalk$elm_bulma$Bulma$Columns$column,
					$surprisetalk$elm_bulma$Bulma$Columns$columnModifiers,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-4'),
								A2($elm$html$Html$Attributes$style, 'opacity', '1')
							]),
						$mdgriffith$elm_style_animation$Animation$render(model.f.e)),
					_List_fromArray(
						[
							$author$project$Main$heart(model.l.I)
						]))
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$Main$hpPanel = function (model) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Columns$columns,
		_Utils_update(
			$surprisetalk$elm_bulma$Bulma$Columns$columnsModifiers,
			{ar: true, av: 0}),
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'text-align', '-webkit-center')
			]),
		$author$project$Main$hpContainer(model));
};
var $author$project$Main$heroPanel = function (model) {
	return A2(
		$surprisetalk$elm_bulma$Bulma$Components$card,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mt-3'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
			]),
		_List_fromArray(
			[
				A2(
				$surprisetalk$elm_bulma$Bulma$Components$cardContent,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$surprisetalk$elm_bulma$Bulma$Layout$media,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$surprisetalk$elm_bulma$Bulma$Layout$mediaLeft,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'width', model.l.aA)
									]),
								_List_fromArray(
									[
										A3(
										$surprisetalk$elm_bulma$Bulma$Elements$image,
										$surprisetalk$elm_bulma$Bulma$Elements$OneByOne(7),
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$img,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$src(model.t.C),
														$elm$html$Html$Attributes$class('is-rounded')
													]),
												_List_Nil)
											])),
										A3(
										$author$project$Main$score,
										model.t.O,
										_List_fromArray(
											[
												A2($author$project$Main$BestResult, model.t.O, model.z)
											]),
										model)
									])),
								A2(
								$surprisetalk$elm_bulma$Bulma$Layout$mediaContent,
								_List_Nil,
								_List_fromArray(
									[
										A3(
										$surprisetalk$elm_bulma$Bulma$Elements$title,
										0,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(model.t.aa)
											])),
										A3(
										$surprisetalk$elm_bulma$Bulma$Elements$subtitle,
										1,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(model.t.as)
											]))
									]))
							])),
						$author$project$Main$hpPanel(model)
					]))
			]));
};
var $surprisetalk$elm_bulma$Bulma$Classes$isLarge = $elm$html$Html$Attributes$class('is-large');
var $surprisetalk$elm_bulma$Bulma$Classes$isMedium = $elm$html$Html$Attributes$class('is-medium');
var $surprisetalk$elm_bulma$Bulma$Classes$section = $elm$html$Html$Attributes$class('section');
var $surprisetalk$elm_bulma$Bulma$Layout$section = function (spacing) {
	return A2(
		$surprisetalk$elm_bulma$Helpers$node,
		'section',
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$Classes$section,
				function () {
				switch (spacing) {
					case 0:
						return $surprisetalk$elm_bulma$Bulma$Classes$none;
					case 1:
						return $surprisetalk$elm_bulma$Bulma$Classes$isMedium;
					default:
						return $surprisetalk$elm_bulma$Bulma$Classes$isLarge;
				}
			}()
			]));
};
var $author$project$Main$body = function (model) {
	return A3(
		$surprisetalk$elm_bulma$Bulma$Layout$section,
		0,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding', '1rem'),
				A2($elm$html$Html$Attributes$style, 'font-family', 'Grandstander')
			]),
		_List_fromArray(
			[
				A2(
				$surprisetalk$elm_bulma$Bulma$Layout$container,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('has-text-centered')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '5rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('EatNotEat')
							])),
						$author$project$Main$foodGrid(model),
						$author$project$Main$heroPanel(model)
					])),
				$author$project$Main$gameModal(model)
			]));
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $author$project$Main$font = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://fonts.googleapis.com/css2?family=Grandstander:wght@300;500&display=swap')
		]),
	_List_Nil);
var $author$project$Main$imagesPreload = function (model) {
	var heroImages = _List_fromArray(
		[$author$project$Main$arnold.C, $author$project$Main$chuck.C, $author$project$Main$terry.C]);
	var foodImages = A2(
		$elm$core$List$map,
		function ($) {
			return $.C;
		},
		model.h.Z);
	var allImages = _Utils_ap(foodImages, heroImages);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(x),
							A2($elm$html$Html$Attributes$style, 'width', '0px'),
							A2($elm$html$Html$Attributes$style, 'height', '0px')
						]),
					_List_Nil);
			},
			allImages));
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
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
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', '#fff')
			]),
		_List_fromArray(
			[
				$surprisetalk$elm_bulma$Bulma$CDN$stylesheet,
				$author$project$Main$font,
				$author$project$Main$body(model),
				$author$project$Main$imagesPreload(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{bT: $author$project$Main$init, b_: $author$project$Main$subscriptions, b2: $author$project$Main$update, b4: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$int)(0)}});}(this));