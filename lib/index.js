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
	return String(falafel(source, function(node){
		//console.log(node.type, node.source());
		if (node.type != 'MemberExpression') return;
		if (node.computed) return;
		if (node.object.type != 'Identifier') return;
		if (node.object.source() != 'process') return;
		if (node.property.type != 'Identifier') return;
		if (node.property.source() != 'browser') return;
		var parent = node;
		while (parent = parent.parent){
			if (parent.type == 'FunctionExpression'){
				for (var i = 0; i < parent.params.length; i++){
					if ((parent.params[i].type == 'Identifier') && (parent.params[i].source() == 'process')){
						return;
					}
				}
			}
		}
		node.update('true');
	}));
}