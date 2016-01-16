"use strict";

var infoWindowContent = '<div class="infoWindow"><div class="infoWindowHeader"><h4>[title]</h4></div>[gallery]</div>';

var galleryTemplate = '<div class="gallery"><div id="links" class="images"><a href="[img-1-a]" data-gallery>' +
    '<img src="[img-1-src]"></a><a href="[img-2-a]" data-gallery><img src="[img-2-src]"></a>' +
    '<a href="[img-3-a]" data-gallery><img src="[img-3-src]"></a></div></div>';

var ajaxLoader = '<div class="ajax-loader"></div>';

var imgUrl = 'https://farm[farmno].staticflickr.com/[server]/[id]_[secret].jpg';

var placeIdFailMsg = "Sorry! Looks like something went wrong, could not fetch the place id for this location";
var placeFailAlert = '<div id="place-error" class="alert alert-danger alert-dismissible" role="alert"><button ' +
    'type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span> ' +
    '</button> <span>[error]</span> </div>';

var flickrFailMsg = "Sorry! Looks like something went wrong, could not fetch photos for this location";
var flickrFailAlert = '<div id="flickr-error" class="alert alert-danger alert-dismissible" role="alert"><button ' +
    'type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>' +
    '</button> <span>[error]</span> </div>';

var mapsFailMsg = "Oh Snap! Google Maps Failed to load. Please check your internet connection";
var mapsFailAlert = '<div id="map-error" class="alert alert-danger alert-dismissible" role="alert"><button ' +
    'type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>' +
    '</button> <span>[error]</span> </div>';