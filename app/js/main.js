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
            "&api_key=a12bbfe0b4dd66e0550265affea11271&lat=" + data.coordinates.lat + "&lon=" + data.coordinates.lng +
            "&format=json&nojsoncallback=1";
        this.flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
            "&api_key=a12bbfe0b4dd66e0550265affea11271&text=" + data.title + "&lat=" + data.coordinates.lat +
            "&lon=" + data.coordinates.lng + "&place_id=[placeid]&per_page=10&format=json&nojsoncallback=1";
    };

    /*
     * @description ViewModel of the application that controls the interaction betweeen the view and model
     * Tracks the markers on the map so that click events can be attached.
     */
    var ViewModel = function () {
        var self = this;
        var map;
        var markersArray = [];
        this.markerList = ko.observableArray();

        Model.markerLocations.forEach(function (marker) {
            self.markerList.push(new Marker(marker));
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

        ko.utils.arrayForEach(self.markerList(), function (markerEntry) {
            var marker = new google.maps.Marker({
                id: markerEntry.id,
                animation: google.maps.Animation.DROP,
                position: markerEntry.coordinates,
                map: map,
                title: markerEntry.title,
                placeIdUrl: markerEntry.placeIdUrl,
                flickrUrl: markerEntry.flickrUrl
            });

            markersArray.push(marker);

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

            marker.addListener('click', openInfoWindow);
            function openInfoWindow() {
                var infoWindow = new google.maps.InfoWindow({
                    content: marker.title,
                    maxWidth: 600
                });

                infoWindow.open(map, marker);
            }
        });

        self.selectMarker = function (marker) {
            highlightListElement(marker);

            for (var i = 0; i < markersArray.length; i++) {
                var placeid;
                if (markersArray[i].id == marker.id) {
                    markersArray[i].setAnimation(google.maps.Animation.BOUNCE);

                    (function (elem) {
                        setTimeout(function () {
                            markersArray[elem].setAnimation(null);
                        }, 2000);
                    })(i);

                    getPlaceId(markersArray[i].placeIdUrl)
                    var flickrUrl = markersArray[i].flickrUrl;
                    flickrUrl = flickrUrl.replace("[placeid]", placeid);
                    console.log(flickrUrl);

                    var infoContent = getFlickrData(flickrUrl);

                    var infoWindow = new google.maps.InfoWindow({
                        content: marker.title,
                        maxWidth: 600
                    });

                    infoWindow.open(map, markersArray[i]);
                }
            }

        };

        var highlightListElement = function (marker) {
            var listElements = document.getElementsByClassName("place");
            var listElement = document.getElementById(marker.id);

            for (var i = 0; i < listElements.length; i++) {
                listElements[i].className = "place";
            }

            listElement.className += " active";
        };

        var getPlaceId = function (url) {
            $.ajax({
                url: url,
                method: 'GET',
                datatype: 'JSON',
                success: function (response) {
                    return response.palces.place.place_id;
                }
            });
        };

        var getFlickrData = function (url) {
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'JSON',
                success: function (response) {
                    console.log(response.photos);
                    return "Space";
                }
            });
        };

        getFlickrData();
    };

    ko.applyBindings(new ViewModel());
})();