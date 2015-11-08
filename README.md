MITHRIL-MAPPER - is a tiny dependency-free library to manage [Mithril](https://lhorie.github.io/mithril/) models thourgh  plain CommonJS JS objects.

[![NPM](https://nodei.co/npm/mithril-mapper.png)](https://nodei.co/npm/mithril-mapper/)


========

[mithril-mapper](https://github.com/imrefazekas/mithril-mapper) provides several simple, yet powerful services for [Mithril](https://lhorie.github.io/mithril/)-based applications to define, update and extend models using CommonJS covering all Mithril-specific notation and decoration.

Features:

- generates Mithril models respecting default values
- can reset the model to default values
- can update the model by plain JS objects
- exports plain JS objects from model handling date types as well
- adds helper functions to the controller to manipulate arrays: addTo, hasIn, removeFrom, clean
- optionally extends Mithril models with validation services following the syntax of [vindication.js](https://github.com/imrefazekas/vindication.js)
- handles Date time conversion and formatting through moment.js

Please check the [demo-project](https://github.com/imrefazekas/mithril-mapper/tree/master/demo-project) as an real-life example how to use [mithril-mapper](https://github.com/imrefazekas/mithril-mapper).


# Installation

	$ npm install mithril-mapper --save


# Basic usage

The [demo-project](https://github.com/imrefazekas/mithril-mapper/tree/master/demo-project) tries to give a taste of [mithril-mapper](https://github.com/imrefazekas/mithril-mapper).

The JS file:

```javascript
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
```

It loads mithril and the mithril-mapper.Then a pure JS object is mapped to mithril-based controller function and model mounted by mithril to a div with the id of 'todo'.
All attributes and their types will be processed recursively and transcoded into mithril-syntax.

A simple html file loading the JS file compiled by the webpack ran by the gulp.

```html
<html>
	<head>
		<title>Todo app</title>
	</head>
	<body>
		<div id="todo"></div>
		<script src="Demo.min.js"></script>
	</body>
</html>
```

For more complex scenario, you should cast a glance at [jade-mithrilier](https://github.com/imrefazekas/jade-mithrilier) which aims to cover a complete mithril-based workflow approached from design angle.


## License

(The MIT License)

Copyright (c) 2015 Imre Fazekas

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Bugs

See <https://github.com/imrefazekas/mithril-mapper/issues>.
