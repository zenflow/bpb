var through = require('through2');
var falafel = require('falafel');

var bpb = function () {
	//var file = typeof arguments[0] == 'string' ? arguments[0] : null; // not currently used
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

function transform(source, options){
	options = options || {};

	var occurrences = [];

	var f = falafel(source, options, function(node){
		if (isOccurrence(node)){
			occurrences.push(node);
		}
		if (isDeclarationOverride(node)){
			getScope(node).$overridden = true;
		}
		if (isFunctionOverride(node)){
			node.$overridden = true;
		}
	});

	occurrences.forEach(function(occurrence){
		for (var scope = getScope(occurrence); scope; scope = getScope(scope)){
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

function getScope(node){
	do {node = node.parent;}
	while (node && (node.type != 'FunctionDeclaration') && (node.type != 'FunctionExpression') && (node.type != 'Program'));
	return node;
}

function isDeclarationOverride(node){
	return ((node.type == 'VariableDeclarator') && (node.id.type == 'Identifier') && (node.id.name == 'process'))
		|| ((node.type == 'FunctionDeclaration') && (node.id.type == 'Identifier') && (node.id.name == 'process'));
}

function isFunctionOverride(node){
	if ((node.type == 'FunctionDeclaration') || (node.type == 'FunctionExpression')){
		if (node.id && (node.id.type == 'Identifier') && (node.id.name == 'process')){
			return true;
		}
		for (var i = 0; i < node.params.length; i++){
			if ((node.params[i].type == 'Identifier') && (node.params[i].name == 'process')){
				return true;
			}
		}
	}
	return false;
}

module.exports = bpb;