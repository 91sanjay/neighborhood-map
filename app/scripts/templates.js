"use strict";

var infoWindowContent = '<div class="infoWindow"><div class="infoWindowHeader"><h4>[title]</h4></div>[gallery]</div>';

var galleryTemplate = '<div class="gallery"><div id="links" class="images"><a href="[img-1-a]" data-gallery>' +
    '<img src="[img-1-src]"></a><a href="[img-2-a]" data-gallery><img src="[img-2-src]"></a>' +
    '<a href="[img-3-a]" data-gallery><img src="[img-3-src]"></a></div></div>';

var ajaxLoader = '<div class="ajax-loader"></div>';

var imgUrl = 'https://farm[farmno].staticflickr.com/[server]/[id]_[secret].jpg';