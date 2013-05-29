define(['aeris', 'base/layerstrategy', 'aeris/jsonp', 'aeris/promise'],
function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Polygons layer
   *               with Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.AerisPolygons');


  /**
   * A strategy for supporting Aeris Polygons with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.AerisPolygons = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.AerisPolygons,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisPolygons.prototype.
      createInstanceLayer = function(layer) {
    var promise = new aeris.Promise();
    aeris.jsonp.get(layer.url, null, function(data) {
      var polygons = [];
      var groups = data.groups;
      for (var i = 0, length = groups.length; i < length; i++) {
        var group = groups[i];
        var polylines = [];
        for (var j = 0, jlen = group.polygons.length; j < jlen; j++) {
          var polyline = google.maps.geometry.encoding.decodePath(
              group.polygons[j].points);
          polylines.push(polyline);
        }
        var polygonOptions = {
          paths: polylines,
          clickable: false
        };
        aeris.extend(polygonOptions, layer.styles[group.value]);
        var polygon = new google.maps.Polygon(polygonOptions);
        polygons.push(polygon);
      }
      promise.resolve(polygons);
    }, 'C');
    return promise;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisPolygons.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    instanceLayer.done(function(polygons) {
      for (var i = 0, length = polygons.length; i < length; i++) {
        var polygon = polygons[i];
        polygon.setMap(map);
      }
    });
  };


  return aeris.maps.gmaps.layerstrategies.AerisPolygon;

});