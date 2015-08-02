MITHRIL-MAPPER - is a tiny dependency-free library to manage [Mithril](https://lhorie.github.io/mithril/) models from plain JS objects.

[![NPM](https://nodei.co/npm/mithril-mapper.png)](https://nodei.co/npm/mithril-mapper/)


========

[mithril-mapper](https://github.com/imrefazekas/mithril-mapper) provides several simple, yet powerful services for [Mithril](https://lhorie.github.io/mithril/)-based applications.
Features:

- generates Mithril models respecting default values
- can reset the model to default values
- can update the model by plain JS objects
- exports generate plain JS objects from model.
- adds helper functions to the controller to manipulat arrays: addTo, hasIn, removeFrom, clean
- optionally extends Mithril models with validation services following the syntax of [vindication.js](https://github.com/imrefazekas/vindication.js)


# Installation

	$ npm install mithril-mapper --save


This library is heavily used by the [jade-mithrilier](https://github.com/imrefazekas/jade-mithrilier)
