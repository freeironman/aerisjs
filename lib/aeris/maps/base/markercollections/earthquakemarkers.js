define([
  'aeris',
  'aeris/promise',
  'aeris/aerisapi',
  'vendor/underscore',
  'base/markercollection',
  'base/markers/earthquakeicon'
], function(aeris, Promise, AerisAPI, _) {

  /**
   * @fileoverview Defines the {aeris.maps.markerCollections.EarthquakeMarkers}
   *               class.
   */

  aeris.provide('aeris.maps.markerCollections.EarthquakeMarkers');


  /**
   * A collection of markers associated with earthquake data.
   * Data provided by the Aeris API `earthquakes` endpoint
   *
   * @param {Object} opt_options Options to pass to the
   *     {aeris.maps.markers.Icon} object.
   * @extends aeris.maps.MarkerCollection
   * @constructor
   */
  aeris.maps.markerCollections.EarthquakeMarkers = function(opt_options) {

    aeris.maps.MarkerCollection.apply(this, arguments);


    /**
     * Number of hours in the past to get earthquakes for.
     *
     * @type {number}
     * @private
     */
    this.hours_ = 4;


    /**
     * The types of markers to display.
     *
     * @type {Array.<string>{
     * @private
     */
    this.types_ = [
      'mini',
      'minor',
      'light',
      'moderate',
      'strong',
      'major',
      'great'
    ];

    this.endpoint_ = 'earthquakes';
  };

  // Extend from MarkerCollection
  aeris.inherits(
    aeris.maps.markerCollections.EarthquakeMarkers,
    aeris.maps.MarkerCollection
  );

  aeris.maps.markerCollections.EarthquakeMarkers.prototype.getParams_ = function() {
    return {
      from: '-' + this.hours_ + 'hours'
    };
  };


  /**
   * @override
   */
  aeris.maps.markerCollections.EarthquakeMarkers.prototype.generateMarker_ = function(point, options) {
    var latLon = [point.loc.lat, point.loc.long];
    var type = point.report.type;
    var marker = new aeris.maps.markers.EarthquakeIcon(latLon, type, options);
    return marker;
  };


  /**
   * Set the number of hours in the past to get earthquakes for.
   *
   * @param {number} hours The number of hours.
   */
  aeris.maps.markerCollections.EarthquakeMarkers.prototype.setHours = function(hours) {
    this.hours_ = hours;
    this.trigger('filter');
  };


  /**
   * Set the type of earthquakes to display.
   *
   * @param {Array.<string>} types An array of the types of storms.
   */
  aeris.maps.markerCollections.EarthquakeMarkers.prototype.setTypes = function(types) {
    this.types_ = types;
    this.trigger('filter');
  };


  /**
   * @override
   */
  aeris.maps.markerCollections.EarthquakeMarkers.prototype.filterMarker = function(marker) {
    // Filter by list of types to display
    return this.types_.indexOf(marker.getType()) !== -1;
  };


  return aeris.maps.markerCollections.EarthquakeMarkers;

});
