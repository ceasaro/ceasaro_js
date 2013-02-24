;
var ceasaro = ceasaro ? ceasaro : {};

ceasaro.findImage || (function ($) {
    _fi = {
        imageStore: [],


        collectImages: function (params) {
            $("img").each(function () {
                var imageSourceUrl = $(this).attr('src');
                if (_fi.indexOf(_fi.imageStore, imageSourceUrl) == -1) {
                    _fi.imageStore.push(imageSourceUrl);
                }
            })
        },

        getRandomImage: function (params) {
            _fi.collectImages(params);
            var randomIndex = Math.floor((Math.random()*_fi.imageStore.length));
            return _fi.imageStore[randomIndex];
        },
        getAllImage: function () {
            return _fi.imageStore;
        },
        // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
        // we need this function. Return the position of the first occurrence of an
        // item in an array, or -1 if the item is not included in the array.
        // Delegates to **ECMAScript 5**'s native `indexOf` if available.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        indexOf: function(array, item, isSorted) {
                if (array == null) return -1;
                var i = 0, l = array.length;
                if (isSorted) {
                    if (typeof isSorted == 'number') {
                        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
                    } else {
                        i = _.sortedIndex(array, item);
                        return array[i] === item ? i : -1;
                    }
                }
                if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) return array.indexOf(item, isSorted);
                for (; i < l; i++) if (array[i] === item) return i;
                return -1;
         }


};

    ceasaro.findImage = _fi;
}(jQuery));

jQuery.fn.randomImage = function (params) {
    return ceasaro.findImage.getRandomImage(params);
};

