var through = require('through2');
var falafel = require('falafel');

module.exports = function (file) {
	var buffers = [];
	return through(function (buffer, encoding, next) {
		buffers.push(buffer);
		next();
	}, function (next) {
		this.push(transform(buffers.map(function(buffer){return buffer.toString('utf8'); }).join('')));
		next()
	});
};

function transform(source){
	var occurrences = [];

	var f = falafel(source, function(node){
		if (isOccurrence(node)){
			occurrences.push(node);
		} else if (isVarOverride(node)){
			getScope(node).$overridden = true;
		} else if (isArgOverride(node)){
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
	return (node.type == 'MemberExpression')
		&& !node.computed
		&& (node.object.type == 'Identifier')
		&& (node.object.name == 'process')
		&& (node.property.type == 'Identifier')
		&& (node.property.name == 'browser');
}

function getScope(node){
	do {node = node.parent;}
	while (node && !((node.type == 'FunctionExpression') || (node.type == 'Program')));
	return node;
}

function isVarOverride(node){
	return (node.type == 'VariableDeclarator')
		&& (node.id.type == 'Identifier')
		&& (node.id.name == 'process');
}

function isArgOverride(node){
	if (node.type == 'FunctionExpression'){
		for (var i = 0; i < node.params.length; i++){
			if ((node.params[i].type == 'Identifier') && (node.params[i].name == 'process')){
				return true;
			}
		}
	}
	return false;
}
