var through = require('through2');
var falafel = require('falafel');

var bpb = function () {
	//var file = typeof arguments[0] == 'string' ? arguments[0] : null; // not currently needed
	var options = typeof arguments[0] == 'string' ? arguments[1] : arguments[0];
	var chunks = [];
	return through(function (buffer, encoding, next) {
		chunks.push(buffer.toString('utf8'));
		next();
	}, function (next) {
		this.push(transform(chunks.join(''), options));
		next()
	});
};

bpb.sync = transform;

function transform(source, options){
	options = options || {};
	options.ecmaVersion = options.ecmaVersion || 5;
	var emca_6 = options.ecmaVersion == 6;
	var occurrences = [];

	var f = falafel(source, options, function(node){
		if (isOccurrence(node)){
			occurrences.push(node);
		}
		if (isVarDecOverride(node)){
			getFunctionScope(node).$overridden = true;
		}
		if (emca_6 && isLetOrConstDecOverride(node)){
			if (((node.parent.type == 'ForStatement') && (node.parent.init == node))
					|| ((node.parent.type == 'ForInStatement') && (node.parent.left == node))){
				node.parent.body.$overridden = true;
			} else {
				getBlockScope(node).$overridden = true;
			}
		}
		if (isFuncDecOverride(node)){
			(emca_6 ? getBlockScope : getFunctionScope)(node).$overridden = true;
		}
		if (isFunctionOverride(node) || isBlockOverride(node)){
			node.$overridden = true;
		}
	});

	occurrences.forEach(function(occurrence){
		for (var scope = occurrence.parent; scope; scope = scope.parent){
			if (scope.$overridden){
				return;
			}
		}
		occurrence.update('true');
	});

	return String(f);
}

function isOccurrence(node){
	return (node.type == 'MemberExpression') && !node.computed
		&& (node.object.type == 'Identifier') && (node.object.name == 'process')
		&& (node.property.type == 'Identifier') && (node.property.name == 'browser');
}

function getFunctionScope(node){
	do {node = node.parent;}
	while (node && (node.type != 'FunctionDeclaration') && (node.type != 'FunctionExpression') && (node.type != 'Program'));
	return node;
}

function getBlockScope(node){
	do {node = node.parent;}
	while (node && (node.type != 'BlockStatement') && (node.type != 'Program'));
	return node;
}

function isVarDecOverride(node){
	if ((node.type == 'VariableDeclaration') && (node.kind == 'var')){
		for (var i = 0; i < node.declarations.length; i++){
			if (node.declarations[i].id.name == 'process'){
				return true;
			}
		}
	}
	return false;
}

function isLetOrConstDecOverride(node){
	if ((node.type == 'VariableDeclaration') && ((node.kind == 'let') || (node.kind == 'const'))){
		for (var i = 0; i < node.declarations.length; i++){
			if (node.declarations[i].id.name == 'process'){
				return true;
			}
		}
	}
	return false;
}

function isFuncDecOverride(node){
	return ((node.type == 'FunctionDeclaration') && (node.id.name == 'process'));
}

function isFunctionOverride(node){
	if ((node.type == 'FunctionDeclaration') || (node.type == 'FunctionExpression')){
		if (node.id && (node.id.name == 'process')){
			return true;
		}
		for (var i = 0; i < node.params.length; i++){
			if (node.params[i].name == 'process'){
				return true;
			}
		}
	}
	return false;
}

function isBlockOverride(node){
	return (node.type == 'BlockStatement') && (node.parent.type == 'CatchClause') && (node.parent.param.name == 'process');
}

module.exports = bpb;