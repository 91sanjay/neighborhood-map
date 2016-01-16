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

        var getInitialInfoContent = function (marker) {
            return infoWindowContent.replace("[title]", marker.title).replace("[gallery]", ajaxLoader);
        };

        ko.utils.arrayForEach(this.markersArray(), function (marker) {
            var initialContent;

            google.maps.event.addListener(marker, 'click', function () {
                map.panTo(marker.getPosition());
                map.panBy(0, -80);
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

            initialContent = getInitialInfoContent(marker);

            var infoWindow = new google.maps.InfoWindow({
                content: initialContent,
                maxWidth: 300
            });

            google.maps.event.addListener(marker, 'click', openInfoWindow);
            function openInfoWindow() {
                infoWindow.open(map, marker);
                highlightListElement(marker);
                setInfoContent(marker, infoWindow);
            }

            google.maps.event.addListener(infoWindow, "closeclick", function () {
                deselectListElement(marker);
            });
        });

        this.selectMarker = function (marker) {
            var initialContent = getInitialInfoContent(marker);
            var infoWindow = new google.maps.InfoWindow({
                content: initialContent,
                maxWidth: 300
            });

            highlightListElement(marker);
            map.panTo(marker.getPosition());
            map.panBy(0, -80);


            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);

            google.maps.event.addListener(infoWindow, "closeclick", function () {
                deselectListElement(marker);
            });

            infoWindow.open(map, marker);
            setInfoContent(marker, infoWindow);
        };

        var highlightListElement = function (marker) {
            var listElement = document.getElementById(marker.id);

            listElement.className += " active";
        };

        var deselectListElement = function (marker) {
            var listElement = document.getElementById(marker.id);

            listElement.className = "place";
        };

        var setInfoContent = function(marker, infoWindow) {
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
                                    var infoContent = getInfoContent(marker.title, photosHolder.photos.photo);
                                    console.log(infoContent);
                                    infoWindow.setContent(infoContent);
                                }
                            });
                    }
                }).fail(function () {
                    console.log("Failed");
                });
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

        var getInfoContent = function(title, photos) {
            var content = infoWindowContent.replace("[title]", title);
            var images = [];

            for(var i=0;i<3;i++) {
                var photo = photos[i];
                var img = imgUrl.replace("[farmno]", photo.farm).replace("[server]", photo.server).replace("[id]", photo.id)
                    .replace("[secret]", photo.secret);
                images.push(img);
            }

            var gallery = galleryTemplate.replace("[img-1-a]", images[0]).replace("[img-1-src]", images[0])
                .replace("[img-2-a]", images[1]).replace("[img-2-src]", images[1])
                .replace("[img-3-a]", images[2]).replace("[img-3-src]", images[2]);

            return content.replace("[gallery]", gallery);
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