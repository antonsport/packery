/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

// dependencies
// var Packery = window.Packery;
// var Rect = Packery.Rect;
// var getStyleProperty = window.getStyleProperty;

// ----- get style ----- //


// extend objects

// -------------------------- CSS3 support -------------------------- //




// -------------------------- Item -------------------------- //

function itemDefinition( getStyleProperty, Rect, Packery ) {

var transformProperty = getStyleProperty('transform');

var Item = Packery.Item;

Item.prototype._create = function() {
  this.rect = new Rect();
  // rect used for placing, in drag or Packery.fit()
  this.placeRect = new Rect();

  this.css({
    position: 'absolute'
  });
};

// -------------------------- drag -------------------------- //

Item.prototype.dragStart = function() {
  this.getPosition();
  this.removeTransitionStyles();
  // remove transform property from transition
  if ( this.isTransitioning && transformProperty ) {
    this.element.style[ transformProperty ] = 'none';
  }
  this.getSize();
  // create place rect, used for position when dragged then dropped
  // or when positioning
  this.isPlacing = true;
  this.needsPositioning = false;
  this.positionPlaceRect( this.position.x, this.position.y );
  this.isTransitioning = false;
  this.didDrag = false;
};

/**
 * handle item when it is dragged
 * @param {Number} x - horizontal position of dragged item
 * @param {Number} y - vertical position of dragged item
 */
Item.prototype.dragMove = function( x, y ) {
  this.didDrag = true;
  var packerySize = this.packery.elementSize;
  x -= packerySize.paddingLeft;
  y -= packerySize.paddingTop;
  this.positionPlaceRect( x, y );
};

Item.prototype.dragStop = function() {
  this.getPosition();
  var isDiffX = this.position.x !== this.placeRect.x;
  var isDiffY = this.position.y !== this.placeRect.y;
  // set post-drag positioning flag
  this.needsPositioning = isDiffX || isDiffY;
  // reset flag
  this.didDrag = false;
};

// -------------------------- placing -------------------------- //

/**
 * position a rect that will occupy space in the packer
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} isMaxYContained
 */
Item.prototype.positionPlaceRect = function( x, y, isMaxYOpen ) {
  this.placeRect.x = this.getPlaceRectCoord( x, true );
  this.placeRect.y = this.getPlaceRectCoord( y, false, isMaxYOpen );
};

/**
 * get x/y coordinate for place rect
 * @param {Number} coord - x or y
 * @param {Boolean} isX
 * @param {Boolean} isMaxOpen - does not limit value to outer bound
 * @returns {Number} coord - processed x or y
 */
Item.prototype.getPlaceRectCoord = function( coord, isX, isMaxOpen ) {
  var measure = isX ? 'Width' : 'Height';
  var size = this.size[ 'outer' + measure ];
  var segment = this.packery[ isX ? 'columnWidth' : 'rowHeight' ];
  var parentSize = this.packery.elementSize[ 'inner' + measure ];

  // additional parentSize calculations for Y
  if ( !isX ) {
    parentSize = Math.max( parentSize, this.packery.maxY );
    // prevent gutter from bumping up height when non-vertical grid
    if ( !this.packery.rowHeight ) {
      parentSize -= this.packery.gutter;
    }
  }

  var max;

  if ( segment ) {
    segment += this.packery.gutter;
    // allow for last column to reach the edge
    parentSize += isX ? this.packery.gutter : 0;
    // snap to closest segment
    coord = Math.round( coord / segment );
    // contain to outer bound
    // x values must be contained, y values can grow box by 1
    var maxSegments = Math[ isX ? 'floor' : 'ceil' ]( parentSize / segment );
    maxSegments -= Math.ceil( size / segment );
    max = maxSegments;
  } else {
    max = parentSize - size;
  }

  coord = isMaxOpen ? coord : Math.min( coord, max );
  coord *= segment || 1;

  return Math.max( 0, coord );
};

Item.prototype.copyPlaceRectPosition = function() {
  this.rect.x = this.placeRect.x;
  this.rect.y = this.placeRect.y;
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'get-style-property/get-style-property',
      './rect',
      './packery'
    ],
    itemDefinition );
} else {
  // browser global
  window.Packery.Item = itemDefinition(
    window.getStyleProperty,
    window.Packery.Rect,
    window.Packery
  );
}

})( window );

