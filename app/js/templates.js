"use strict";

var infoWindowContent = '<div class="infoWindow"><div class="infoWindowHeader"><h4>[title]</h4></div>[gallery]</div>';

var gallery = '<div class="gallery"><div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">' +
    '<div class="slides"></div><h3 class="title"></h3><a class="prev">‹</a><a class="next">›</a><a class="close">×</a>' +
    '<a class="play-pause"></a><ol class="indicator"></ol><div class="modal fade"><div class="modal-dialog">' +
    '<div class="modal-content"><div class="modal-header"><button type="button" class="close" aria-hidden="true">' +
    '&times;</button><h4 class="modal-title"></h4></div><div class="modal-body next"></div><div class="modal-footer">' +
    '<button type="button" class="btn btn-default pull-left prev"><i class="glyphicon glyphicon-chevron-left"></i>' +
    'Previous</button><button type="button" class="btn btn-primary next">Next<i class="glyphicon glyphicon-chevron-right">' +
    '</i></button></div></div></div></div></div><div id="links" class="images"><a href="[img-1-a]" data-gallery>' +
    '<img src="[img-1-src]"></a><a href="[img-2-a]" data-gallery><img src="[img-2-src]"></a>' +
    '<a href="[img-3-a]" data-gallery><img src="[img-3-src]"></a>' +
    '<a href="[img-4-a]" data-gallery><img src="[img-4-src]"></a><a href="[img-5-a]" data-gallery>' +
    '<img src="[img-5-src]"></a><a href="[img-6-a]" data-gallery><img src="[img-6-a]"></a></div>';
