define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'aeris/maps/strategy/events'
], function(_, BaseAbstractStrategy, GoogleEvents) {
  /**
   * Base class for Google Maps strategies.
   *
   * @class aeris.maps.gmaps.AbstractStrategy
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
  */
  var AbstractStrategy = function(object, opt_options) {
    var options = _.defaults(opt_options || {}, {
      googleEvents: new GoogleEvents()
    });


    /**
     * Helper for binding google.maps.event
     * events.
     *
     * @type {aeris.maps.gmaps.GoogleEvents}
     * @protected
     * @property googleEvents_
     */
    this.googleEvents_ = options.googleEvents;


    BaseAbstractStrategy.apply(this, arguments);
  };
  _.inherits(AbstractStrategy, BaseAbstractStrategy);


  /**
   * @method destroy
   */
  AbstractStrategy.prototype.destroy = function() {
    BaseAbstractStrategy.prototype.destroy.apply(this, arguments);

    this.googleEvents_.stopListening();
  };


  return AbstractStrategy;
});
