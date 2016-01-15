/*
 * @description This application uses the MVVM pattern of KnockoutJS. The model holds the data
 * to be displayed(markers) and the viewmodel controls the interaction between the view and the model.
 */

(function () {
    "use strict";

    /*
     * @description Model to hold the marker location array
     */
    var Model = {
        markerLocations: [
            {
                id: 1,
                title: "Empire State Building",
                coordinates: {
                    lat: 40.748441,
                    lng: -73.985664
                }
            },
            {
                id: 2,
                title: "Times Sqaure",
                coordinates: {
                    lat: 40.759011,
                    lng: -73.984472
                }
            },
            {
                id: 3,
                title: "Madison Sqaure Garden",
                coordinates: {
                    lat: 40.750506,
                    lng: -73.993394
                }
            },
            {
                id: 4,
                title: "Central Park",
                coordinates: {
                    lat: 40.782865,
                    lng: -73.965355
                }
            },
            {
                id: 5,
                title: "New York Stock Exchange",
                coordinates: {
                    lat: 40.706876,
                    lng: -74.011265
                }
            }
        ]
    };

    /*
     * @description This function builds a basic marker object with the necessary parameters
     */
    var Marker = function (data) {
        this.id = data.id;
        this.title = data.title;
        this.coordinates = data.coordinates;
        this.placeIdUrl = "https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon" +
            "&api_key=360da6373d34f0076c66dedc9bf6270d&lat=" + data.coordinates.lat + "&lon=" + data.coordinates.lng +
            "&format=json&nojsoncallback=1";
        this.flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
            "&api_key=360da6373d34f0076c66dedc9bf6270d&text=" + data.title + "&lat=" + data.coordinates.lat +
            "&lon=" + data.coordinates.lng + "[placeid]&per_page=10&format=json&nojsoncallback=1";
    };

    /*
     * @description ViewModel of the application that controls the interaction betweeen the view and model
     * Tracks the markers on the map so that click events can be attached.
     */
    var ViewModel = function () {
        var self = this;
        var map;
        this.markersArray = ko.observableArray();
        this.markerObjects = [];
        this.filterCriteria = ko.observable('');

        var init = function () {
            Model.markerLocations.forEach(function (marker) {
                self.markerObjects.push(new Marker(marker));
            });

            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 40.759011, lng: -73.984472},
                zoom: 12
            });

            google.maps.event.addDomListener(window, "resize", function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });

            self.placeMarkers();
            console.log(infoWindowContent);
        };

        this.placeMarkers = function () {
            this.markerObjects.forEach(function (markerEntry) {
                var marker = new google.maps.Marker({
                    id: markerEntry.id,
                    animation: google.maps.Animation.DROP,
                    position: markerEntry.coordinates,
                    map: map,
                    title: markerEntry.title,
                    placeIdUrl: markerEntry.placeIdUrl,
                    flickrUrl: markerEntry.flickrUrl
                });

                self.markersArray.push(marker);
            });
        };
        init();

        ko.utils.arrayForEach(this.markersArray(), function (marker) {
            google.maps.event.addListener(marker, 'click', function () {
                map.panTo(marker.getPosition());
            });

            marker.addListener('click', toggleBounce);
            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        marker.setAnimation(null)
                    }, 2000);
                }
            }

            var infoWindow = new google.maps.InfoWindow({
                content: marker.title,
                maxWidth: 600
            });

            google.maps.event.addListener(marker, 'click', openInfoWindow);
            function openInfoWindow() {
                infoWindow.open(map, marker);
                highlightListElement(marker);
            }

            google.maps.event.addListener(infoWindow, "closeclick", function () {
                deselectListElement(marker);
            });
        });

        this.selectMarker = function (marker) {
            highlightListElement(marker);

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);

            var infoWindow = new google.maps.InfoWindow({
                content: marker.title,
                maxWidth: 600
            });

            infoWindow.open(map, marker);

            google.maps.event.addListener(infoWindow, "closeclick", function () {
                deselectListElement(marker);
            });

            getPlaceId(marker.placeIdUrl)
                .done(function (response) {
                    console.log("enter");
                    var flickrUrl;
                    if (response.stat == "fail") {
                        console.log("API returned error while retrieving palce if");
                        flickrUrl = marker.flickrUrl.replace("[placeid]", '');
                    } else {
                        flickrUrl = marker.flickrUrl.replace("[placeid]", "&place_id=" + response.places.place[0].place_id);
                        getFlickrPhotos(flickrUrl)
                            .done(function (photosHolder) {
                                if (photosHolder.stat == "fail") {
                                    console.log("API returned error while retrieving photos");
                                } else {
                                    console.log(photosHolder.photos.photo.length);
                                }
                            });
                    }
                }).fail(function () {
                    console.log("Failed");
                });
        };

        var highlightListElement = function (marker) {
            var listElement = document.getElementById(marker.id);

            listElement.className += " active";
        };

        var deselectListElement = function (marker) {
            var listElement = document.getElementById(marker.id);

            listElement.className = "place";
        };

        var getPlaceId = function (placeUrl) {
            var deferred = $.Deferred();

            $.getJSON(placeUrl).then(function (response) {
                if (!response) {
                    deferred.reject(response);
                }
                deferred.resolve(response);
            });
            return deferred.promise();
        };

        var getFlickrPhotos = function (flickrUrl) {
            var deferred = $.Deferred();

            $.getJSON(flickrUrl)
                .then(function (response) {
                    if (!response) {
                        deferred.reject(response);
                    }

                    deferred.resolve(response);
                });

            return deferred.promise();
        };

        var getInitialInfoContent = function () {
            var content = '';
            var header = ""
        };

        this.filter = function () {
            var visibleMarkers = [];

            if (!self.filterCriteria() || self.filterCriteria() == '') {
                ko.utils.arrayForEach(self.markersArray(), function (marker) {
                    var listElement = document.getElementById(marker.id);
                    marker.setVisible(true);
                    listElement.className = "place";
                });
            }

            ko.utils.arrayForEach(self.markersArray(), function (marker) {
                var listElement = document.getElementById(marker.id);
                var index = marker.title.toLowerCase().indexOf(self.filterCriteria().toLowerCase());

                if (index < 0) {
                    listElement.className = "place hide";
                    marker.setVisible(false);
                } else {
                    listElement.className = "place";
                    marker.setVisible(true);
                }
            });
        };
    };

    ko.applyBindings(new ViewModel());
})();