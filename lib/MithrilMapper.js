var _ = require('isa.js')
var m = require('mithril')

var moment = require('moment')
var defaultFormat = 'YYYY-MM-DD HH:mm'

function walk ( model ) {
	var res
	if ( _.isFunction( model ) )
		res = model.purify ? model.purify() : model()
	else if ( _.isArray( model ) ) {
		res = []
		model.forEach(function (item) {
			res.push( walk( item ) )
		})
	}
	else if ( _.isObject( model ) ) {
		res = {}
		for (var key in model) {
			if ( !key ) continue
			res[key] = walk( model[ key ] )
		}
	}
	return res
}

function createDate ( ctrl, model, value, parseFn, formatFn ) {
	var embeddedProp = m.prop( model )
	var prop = function () {
		if (arguments.length) {
			if ( parseFn ) embeddedProp( parseFn( arguments[0] ) )
			else if ( _.isNumber( arguments[0] ) ) {
				embeddedProp( arguments[0] )
			}
			else {
				var mDate = moment( arguments[0], ctrl.dateFormat || defaultFormat )
				if ( mDate.isValid() )
					embeddedProp( mDate.valueOf() )
			}
		}
		var value = embeddedProp()
		return formatFn ? formatFn( value ) : (value > 0 ? moment( embeddedProp() ).format( ctrl.dateFormat || defaultFormat ) : '')
	}
	prop.purify = function () {
		return embeddedProp()
	}
	prop.toJSON = function () {
		return embeddedProp()
	}
	if ( value )
		prop( value )
	return prop
}

function createProp ( model, value ) {
	var prop = m.prop( model )
	if ( value )
		prop( value )
	return prop
}

function capitalizeFirstvarter (string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
function mapToController ( controller, root, object, model, value, arrayCreation ) {
	if ( !_.isObject( model ) )
		return createProp( model, value )

	for (var key in model) {
		if ( !key ) continue

		var n = model[key]
		if ( _.isString( n ) ) {
			object[ key ] = createProp( n, value ? value[key] : null )
		}
		else if ( _.isBoolean( n ) ) {
			object[ key ] = createProp( n, value ? value[key] : null )
		}
		else if ( _.isNumber( n ) ) {
			object[ key ] = createProp( n, value ? value[key] : null )
		}
		else if ( _.isFunction( n ) ) {
			object[ key ] = n.bind( root )
		}
		else if ( _.isArray( n ) ) {
			object[key] = n.map( function (item) {
				return mapToController(controller, root, {}, item, value, arrayCreation)
			} )

			var createHelpers = function ( CTRL, CAPNAME, OBJ, ROOT, KEY, M, AC ) {
				CTRL['fill' + CAPNAME ] = function ( _as, keepContent ) {
					m.startComputation()
					if ( !keepContent )
						OBJ[ KEY ].splice( 0, OBJ[ KEY ].length )
					_as.forEach( function ( _v ) {
						if ( _v )
							OBJ[ KEY ].push( mapToController( CTRL, ROOT, {}, M[0], _v, AC ) )
					} )
					m.endComputation()
				}
				CTRL['addTo' + CAPNAME ] = function ( _v, unique ) {
					m.startComputation()
					if ( _v ) {
						if ( unique )
							CTRL['removeFrom' + CAPNAME ]( _v )
						OBJ[ KEY ].push( mapToController( CTRL, ROOT, {}, M[0], _v, AC ) )
					}
					m.endComputation()
				}
				CTRL['removeFrom' + CAPNAME ] = function ( obj ) {
					m.startComputation()
					if ( _.isNumber( obj ) )
						OBJ[ KEY ].splice( obj, 1)
					else {
						var index = -1
						OBJ[ KEY ].forEach( function ( elmnt, idx ) {
							if ( elmnt() === obj )
								index = idx
						} )
						if ( index > -1 )
							OBJ[ KEY ].splice( index, 1)
					}
					m.endComputation()
				}
				CTRL['hasIn' + CAPNAME ] = function ( obj ) {
					var index = -1
					OBJ[ KEY ].forEach( function ( elmnt, idx ) {
						if ( elmnt() === obj )
							index = idx
					} )
					return index > -1
				}
				CTRL['clean' + CAPNAME ] = function ( index ) {
					m.startComputation()
					OBJ[ KEY ].splice( 0, OBJ[ KEY ].length )
					m.endComputation()
				}
			}
			createHelpers( controller, capitalizeFirstvarter( key ), object, root, key, n, arrayCreation )
		}
		else if ( _.isObject( n ) && n._date ) {
			object[ key ] = createDate( controller, n.value || new Date().getTime(), value ? value[key] : null, n._parse, n._format )
		}
		else if ( _.isObject( n ) ) {
			object[ key ] = mapToController( controller, root, {}, n, value ? value[key] : null, arrayCreation )
		}
	}
	return object
}

module.exports = {
	_models: {},
	_viewModels: {},
	toJS: function ( M ) {
		return walk( M )
	},
	resetModel: function (name, C, M) {
		var self = this
		function resetFn ( origin, model ) {
			if ( (origin === undefined) || (model === undefined) ) return
			if ( _.isFunction( model ) ) {
				model( origin._date ? (origin.value || Date.now()) : origin )
			}
			else if ( _.isArray( model ) ) {
				model.splice( 0, model.length )
			}
			else if ( _.isObject( model ) ) {
				for (var key in model) {
					if ( !key ) continue
					var n = model[key]
					resetFn( origin[key], n )
				}
			}
		}
		resetFn( self._models[name], M )
	},
	updateModel: function (name, C, M, O) {
		var self = this
		function updateFn ( origin, model, object ) {
			if ( (origin === undefined) || (object === undefined) || (model === undefined) ) return
			if ( _.isFunction( model ) ) {
				model( object )
			}
			else if ( _.isArray( model ) ) {
				var originalItem = origin[0]
				model.splice( 0, model.length )
				object.forEach( function ( item ) {
					var viewObject = mapToController( C, M, {}, originalItem || item, null, false )
					model.push( viewObject )
					updateFn( originalItem, viewObject, item )
				} )
			}
			else if ( _.isObject( model ) ) {
				for (var key in model) {
					if ( !key ) continue
					var n = model[key]
					updateFn( origin[key], n, object[key] )
				}
			}
		}
		updateFn( self._models[name], M, O )
	},
	mapObject: function (name, V) {
		var self = this
		return function ( model ) {
			var ctrl = this
			ctrl.toJS = function ( substructure ) {
				return walk( substructure || ctrl[ name ] )
			}
			Object.defineProperty(ctrl, '_validation', {
				enumerable: false,
				configurable: false,
				writable: true,
				value: V || { }
			} )
			var object = {}
			if ( !self._models[ name ] ) {
				self._models[ name ] = model
				self._viewModels[ name ] = mapToController( ctrl, object, object, model, null, true )
			}
			ctrl[ name ] = self._viewModels[ name ]
		}
	}
}
