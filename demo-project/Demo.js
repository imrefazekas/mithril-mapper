var m = require('mithril');
var mapper = require('../lib/MithrilMapper');

var name = 'Todo';
var model = {
	dataModel: {
		title: 'Almafa'
	},
	validation: {
		title: { required: true, minlength: "6" }
	}
};

var TodoController = mapper.mapObject( name, model.validation );
var myComponent = {
	controller: TodoController,
	view: function(ctrl, mdl){
		return m("input", {onchange: m.withAttr("value", ctrl[ name ].title), value: ctrl[ name ].title()});
	}
};
m.mount( document.getElementById('todo'), m.component(myComponent, model.dataModel) );
