define([
  'aeris/util',
  'aeris/config',
  'base/markers/pointdatamarker'
], function(_, config, PointDataMarker) {
  /**
   * @class aeris.maps.markers.StormReportMarker
   * @extends aeris.maps.markers.PointDataMarker
   * @constructor
   */
  var StormReportMarker = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      url: config.get('path') + 'assets/marker_yellow.png'
    }, opt_attrs);

    var options = _.extend({
      iconLookup: {
        avalanche: 'stormrep_marker_avalanche',
        blizzard: 'stormrep_marker_snow',
        sleet: 'stormrep_marker_ice',
        flood: 'stormrep_marker_flood',
        fog: 'stormrep_marker_densefog',
        ice: 'stormrep_marker_ice',
        hail: 'stormrep_marker_hail',
        lightning: 'stormrep_marker_lightning',
        rain: 'stormrep_marker_rain',
        snow: 'stormrep_marker_snow',
        tides: 'stormrep_marker_highsurf',
        spout: 'stormrep_marker_tornado',
        tornado: 'stormrep_marker_tornado',
        wind: 'stormrep_marker_highwind'
      },
      iconTypeAttribute: 'stormtypes'
    }, opt_options);

    PointDataMarker.call(this, attrs, options);
  };
  _.inherits(StormReportMarker, PointDataMarker);


  return StormReportMarker;
});