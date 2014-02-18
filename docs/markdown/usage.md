Basic Usage
===========

This document is only an introduction to the features of Aeris.js. Check out the reference API for more complete documentation.


- [Overview of Features](#overview-of-features)
    - [Data and Weather API](#data-and-weather-api)
    - [Maps](#maps)
    - [Geoservices](#geoservices)
    - [AppBuilder](#appbuilder)

#### A Note For RequireJS Users
The examples in this document reference components within the global `aeris` namespace. This is appropriate when loading the library from a CDN. If you are loading components as RequireJS/AMD modules, you can find find modules by matching namespace paths to the aeris library file structure.

For example, [`aeris.maps.layers.Radar`](http://uat.hamweather.net/eschwartz/docs/public#aeris.maps.layers.Radar) can be found at [`ai/maps/layers/radar`](https://github.com/hamweather/aerisjs/blob/master/lib/aeris/maps/layers/aerisradar.js).

## Data and Weather API

The Aeris.js `api` library provides a javascript interface for interacting with data from the [Aeris API](http://www.hamweather.com/support/documentation/aeris/endpoints/). Data collection objects accept a [`params`](http://uat.hamweather.net/eschwartz/docs/api/classes/aeris.api.params.models.Params.html) object, which is used to query the AerisAPI.

```javascript
var stormReportCollection = new aeris.api.collections.StormReports(null, {
    // See AerisAPI documentation for accepted params
    // http://www.hamweather.com/support/documentation/aeris/endpoints/
    params: {
        from: '-2weeks',
        p: 'minneapolis,mn',
        radius: '100mi',
        limit: 10,
        filters: ['ice', 'snow']
    }
});
```

You may also specify the action to use for requesting data (generally, defaults to `within`)

```javascript
var stormReports = new aeris.api.collections.StormReports(null, {
    action: 'closest',
    params: {
        p: '55415'
    }
});
```

Data collections are populated via ajax requests, using the `fetch` method, which returns an [`aeris.Promise`](http://uat.hamweather.net/eschwartz/docs/public#aeris.Promise) object.

```javascript
    stormReports.fetch().
        done(function(response) {
            // stormReports is populated with data
        }).
        fail(function(err) {
            // Failed to load data from the API.
        });

    // Or, listen to events on the collection
    stormReports.on({
        sync: function() {
            // data has been fetched from the API
        },
        add: function() {
            // new storm reports were added to the collection
        }
    });
```

Data collections extend from [`Backbone.Collection`](http://backbonejs.org/#Collection), and thus provide all the same methods as a `Backbone.Collection`.

```javascript
stormReportCollection.each(function(stormReport) {
    console.log(stormReport.get('report').detail.snowIN + ' of snow fell');
    // See AerisAPI documentation for data attributes
});
```


Individual models can be retrieved from the AerisAPI by id.

```javascript
    var earthquake = new aeris.api.models.Earthquake({
        id: 'nc72142075'
    });

    earthquake.fetch();
```

Data collections are defined for the following [AerisAPI endpoints](http://www.hamweather.com/support/documentation/aeris/endpoints/):


| Endpoint | Model | Collection |
| ----------------- |-------| -----------|
| `/earthquakes` | [`aeris.api.models.Earthquake`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.models.Earthquake) | [`aeris.api.collections.Earthquakes`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.collections.Earthquakes)|
| `/fires` | [`aeris.api.models.Fire`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.models.Fire) | [`aeris.api.collections.Fires`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.collections.Fires) |
| `/stormreports` | [`aeris.api.models.StormReport`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.models.StormReport) | [`aeris.api.collections.StormReports`](http://uat.hamweather.net/eschwartz/docs/public#aeris.api.collections.StormReports) |




## Maps

#### Basic Map Objects

[`Map`](http://uat.hamweather.net/eschwartz/docs/public#aeris.maps.Map) objects are rendered and erased using the `setMap` method.

```javascript
var map = new aeris.maps.Map('map-canvas');
var marker = new aeris.maps.markers.Marker({
    position: [45, -90]     // lat lon coordinate
});

marker.setMap(map);         // marker is rendered on the map
marker.setMap(null);        // marker is erased from the map
```

Map objects can be manipulted using **getter** and **setter** methods.

```javascript
var marker = new aeris.maps.markers.Marker({
    // Attributes can also be set in constructor
    position: [45, -90];
});
marker.setMap(map);

function moveMarkerNorthEastABit() {
    var currentPosition = marker.getPosition();
    var northEastABit = [currentPosition[0] + 0.1, currentPosition[1] + 0.1];

    marker.setPosition(northEastABit);
}

moveMarkerNorthEastABit();
marker.getPosition();       // [45.1, -89.9]
```

```javascript
var layer = new aeris.maps.layers.Radar({
    opacity: 1.0
});
layer.setMap(map);

function fadeOutLayer() {
    var int = window.setInterval(function() {
        var lessOpaque = layer.getOpacity() - 0.1 || 0;

        if (layer.getOpacity <= 0) {
            window.clearInterval(int);
            return;
        }

        layer.setOpacity(lessOpaque);
    }, 100);
}
```

Map objects fire events.

```javascript
var infoBox;
var marker = new aeris.maps.markers.Marker({
    position: [45, -90]
});
marker.setMap(map);

marker.on({
    'click': function() {
        if  (infoBox) { infoBox.setMap(null); }

        infoBox = new aeris.maps.InfoBox({
            position: marker.getPosition(),
            content: 'Marker is at lat/lon: ' + marker.getPosition().toString()
        });
        infoBox.setMap(map);
    }
    'change:position': function() {
        if (infoBox) {
            infoBox.setContent('Marker is at long/lon: ' + marker.getPosition().toString())
        }
    }
});
```



#### Rendering Map Objects From Weather API Data

[`MarkerCollections`](http://uat.hamweather.net/eschwartz/docs/public#aeris.maps.markercollections) can be used to render Aeris API data.

```javascript
var earthquakeMarkers = new aeris.maps.markercollections.EarthquakeMarkers();

earthquakeMarkers.setMap(map);

// Fetch earthquake data from Aeris API
// Markers will be set to the map for every data model fetched.
earthquakeMarkers.fetchData();


// Look for new earthquakes when the
// map changes location
map.on('change:bounds', function() {
    // Update the query parameters for the Aeris API request,
    // limited the search to the bounds of the map viewport
    earthquakeMarkers.setParams({
        p: map.getBounds()
    });
    earthquakeMarkers.fetchData();
});


// Render earthquake data on click
earthquakeMarkers.on('click', function(latLon, marker) {
    var infoBox = new aeris.maps.InfoBox({
        position: latLon,
        content: myTemplate(marker.getData().toJSON());
    });
    infoBox.setMap(map);
});
```


## Geoservices

Aeris.js provides wrappers around a number of 3rd party APIs and services. This allows you to easily switch out one service for another, using the same interface.

```javascript
var geolocator;

// Check for HTML geolocation support
if (aeris.geolocate.HTML5GeolocateService.isSupported()) {
    geolocator = new aeris.geolocate.HTML5GeolocateService();
}
else {
    // Fall back to IP-based geolocation
    geolocator = new aeris.geolocate.FreeGeoIPGeolocateService();
}

$('#findMe').click(function() {
    geolocator.getCurrentPosition().
        done(function(position) {
            alert('You are at lat/lon: ' + position.latLon.toString());
        });
});
```

See the reference documentation for more details about geoservices:

* [`Geolocation services`](http://uat.hamweather.net/eschwartz/docs/public#aeris.geolocate)
* [`Geocode services`](http://uat.hamweather.net/eschwartz/docs/public#aeris.geocode)


## AppBuilder

```javascript
/**
 * The Aeris.js AppBuilder is still very much a work in progress.
 * Feel free to play around with it while we finish up this feature.
*/
```

The Aeris [`AppBuilder`](http://uat.hamweather.net/eschwartz/docs/api/classes/aeris.builder.maps.MapAppBuilder.html) is a dead-simple tool for creating a weather map application.

```javascript
new MapApp({
    el: 'myMapApp',      // ID of application container element
    apiKey: 'MY_AERIS_CLIENT_ID',
    apiSecret: 'MY_AERIS_CLIENT_SECRET',
    layers: [
        'Radar',
        'Satellite'
    ],
    markers: [
        'EarthquakeMarkers',
        'StormReportMarkers'
    ]
});
```


#### Theming the AppBuilder

If you'd like to customize the theme, you can bootstrap off of the default theme, which is written using [Sass](http://sass-lang.com/), a CSS precompiler. You can find the default theme in the repo, located at `lib/aeris/builder/maps/theme`.

We use [Compass](http://compass-style.org/) to compile the the sass stylesheets, which is as easy as running:

```
compass compile
```

from the theme directory.