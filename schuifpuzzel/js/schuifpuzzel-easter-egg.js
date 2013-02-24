;var ceasaro = ceasaro ? ceasaro :{};
ceasaro.puzzle || (function($) {
    "use strict";
    var _p = {
        constants: {
            emptyTileClass: "empty_tile",
            puzzleId: 'schuif-puzzel'
        },
        settings: {
            columns: 3,
            emptyTileClass: "empty_tile",
            image: null,
            rows: 3,
            overlay: false,
            puzzleContainer: null,
            tileIdPrefix: "position_"
        },
        init: function(params) {
            _p.puzzle(_p.getImageUrl(params.image), params);
        },
        puzzle: function(imageUrl, params) {
            $.extend(_p.settings, params);
            var img = new Image();
            // load image to check width and height, the render puzzle further within callback function
            img.onload = function() {
                var puzzleImage = {
                    height: this.height,
                    url: imageUrl,
                    width : this.width
                };
//                console.log("using image:"+puzzleImage.url + "("+puzzleImage.width+","+puzzleImage.height+")");

                _p.printPuzzle(params.puzzleContainer, puzzleImage);
//                _p.shufflePuzzle();
                $('#'+_p.constants.puzzleId+' td').click(function(event) {
                    event.preventDefault();
                    // look left of clicked tile
                    var emptyTile,
                        moved,
                        row, column;

                    moved = false;
                    emptyTile = null;
                    row = parseInt($(this).data('row'));
                    column = parseInt($(this).data('column'));
                    if (!moved) {
                        moved = _p.moveTileToLeft(row, column);
                    }
                    if (!moved) {
                        moved = _p.moveTileToTop(row, column);
                    }
                    if (!moved) {
                        moved = _p.moveTileToBottom(row, column);
                    }
                    if (!moved) {
                        moved = _p.moveTileToRight(row, column);
                    }
                    if (moved) {
                        _p.checkSolution();
                    }
                });

            };
            img.src = imageUrl;

        },
        getImageUrl: function(image) {
            var imageSrc,
                locationPath;
            if (typeof image == "string") {
                return image;
            } else if (typeof image == "object" && image.prop("nodeName").toUpperCase() == "IMG") {
                imageSrc = $(image).attr('src');
                if (imageSrc.indexOf('http') == 0 || imageSrc.indexOf('file') == 0) {
                    return imageSrc;
                } else {
                    locationPath = window.location.href.substring(0, window.location.href.lastIndexOf('/')+1);
                    return locationPath + imageSrc;
                }
            }
        },
        printPuzzle: function(puzzle_container, puzzle_image) {

            var tileHeight = puzzle_image.height/_p.settings.rows,
                tileWidth = puzzle_image.width/_p.settings.columns;

            function printPiece(row, column) {
                var xpos, ypos, style, styleClass = "", piece;

                xpos = -(column * tileWidth);
                ypos = -(row    * tileHeight);

                style = "width:"+tileWidth+"px; ";
                style += "height:"+tileHeight+"px; ";
                if (row==0 && column==0) {
                    styleClass = "empty_tile";
                } else {
                    style += "background: url(\""+puzzle_image.url+"\") "+xpos+"px "+ypos+"px;";
                }

                piece = "<td id='position_"+row+"_"+column+
                    "' class='"+styleClass+
                    "' style='"+style+
                    "' data-row='"+row+
                    "' data-column='"+column+
                    "' data-row-ori='"+row+
                    "' data-column-ori='"+column+
                    "' class='piece_'></td>";
//                $(piece).data("column", column);
                puzzleHtml += (piece);
            }

            function printRow(row) {
                puzzleHtml += ("<tr>");
                var column = 0;
                for (column; column<_p.settings.columns; column++) {
                    printPiece(row, column);
                }
                puzzleHtml += ("</tr>");
            }

            var puzzleHtml = "",
                row = 0;

            puzzleHtml += ('<table id="'+_p.constants.puzzleId+'" cellpadding="0" cellspacing="0">');
            puzzleHtml += ('<tbody>');
            for (row; row<_p.settings.rows; row++) {
                printRow(row);
            }
            puzzleHtml += ('</tbody>');
            puzzleHtml += ('</table>');
            if (!puzzle_container || puzzle_container.length === 0 || _p.settings.overlay) {
                var schuif_puzzel_container_style = "";
                if (_p.settings.overlay) {
                    var z_index = _p.get_max_z();
                    console.log("z_index=" + z_index)
                    var style = "background-color: black;";
                    style += "filter:alpha(opacity=50); /* IE */";
                    style += "opacity: 0.5; /* Safari, Opera */";
                    style += "-moz-opacity:0.50; /* FireFox */";
                    style += "z-index: "+z_index+";";
                    style += "height: 100%;";
                    style += "width: 100%;";
                    style += "background-repeat:no-repeat;";
                    style += "background-position:center;";
                    style += "position:absolute;";
                    style += "top: 0px;";
                    style += "left: 0px;";
                    var puzzel_overlay = $('<div class="schuif-puzzel-overlay" style="'+style+'"></div>');
                    $('body').append(puzzel_overlay);

                    schuif_puzzel_container_style ="position:absolute;";
                    schuif_puzzel_container_style += "background: #FFF;";
                    schuif_puzzel_container_style += "left: 50%;";
                    schuif_puzzel_container_style += "top: 50%;";
                    schuif_puzzel_container_style += "margin-left: -"+(puzzle_image.width/2)+"px;";
                    schuif_puzzel_container_style += "margin-top: -"+(puzzle_image.height/2)+"px;";
                    schuif_puzzel_container_style += "z-index:"+(z_index+10)+";";
                }
                puzzle_container = $('<div class="schuif-puzzel-container" style="'+schuif_puzzel_container_style+'"></div>');
                $('body').append(puzzle_container);
                puzzle_container.append(puzzleHtml);
            } else {
                puzzle_container.replaceWith(puzzleHtml);
            }
            _p.settings.puzzleContainer = puzzle_container;
        },
        shufflePuzzle: function() {
            var x=0,y= 0,i= 0,
                new_x=0, new_y= 0,
                runs = _p.settings.columns * Math.random() * _p.settings.rows*4;
            for (i=0; i< runs; i++) {
                if (i%2==0) {
                    new_x = Math.floor((Math.random()*_p.settings.columns));
                    if (new_x<x) {
                        _p.moveTileToRight(y, new_x);
                    } else if (new_x>x) {
                        _p.moveTileToLeft(y, new_x);
                    }
                } else {
                    new_y = Math.floor((Math.random()*_p.settings.rows));
                    if (new_y<y) {
                        _p.moveTileToBottom(new_y, x);
                    } else if (new_y>y) {
                        _p.moveTileToTop(new_y, x);
                    }
                }
                x=new_x;
                y=new_y;
            }
        },
        moveTileToTop: function(row, column) {
            var rowToTop = row-1;
            if (rowToTop >= 0) {
                var tileToTop = _p.get_tile_at_row_column(rowToTop, column);
                if (_p.is_empty_tile(tileToTop) || _p.moveTileToTop(rowToTop, column)) {
                    _p.switch_with_empty(row, column, tileToTop);
                    return true;
                }
            }
            return false;
        },
        moveTileToRight: function(row, column) {
            var columnToRight = column+1;
            if (columnToRight < _p.settings.columns) {
                var tileToRight = _p.get_tile_at_row_column(row, columnToRight);
                if (_p.is_empty_tile(tileToRight) || _p.moveTileToRight(row, columnToRight)) {
                    _p.switch_with_empty(row, column, tileToRight);
                    return true;
                }
            }
            return false;
        },
        moveTileToBottom: function(row, column) {
            var rowToBottom = row+1;
            if (rowToBottom < _p.settings.rows) {
                var tileToBottom= _p.get_tile_at_row_column(rowToBottom, column);
                if (_p.is_empty_tile(tileToBottom) || _p.moveTileToBottom(rowToBottom, column)) {
                    _p.switch_with_empty(row, column, tileToBottom);
                    return true;
                }
            }
            return false;
        },
        moveTileToLeft: function(row, column){
            var columnToLeft = column-1;
            if (columnToLeft >= 0)
            {
                var tileToLeft = _p.get_tile_at_row_column(row, columnToLeft);
                if (_p.is_empty_tile(tileToLeft) || _p.moveTileToLeft(row, columnToLeft)) {
                    _p.switch_with_empty(row, column, tileToLeft);
                    return true;
                }
            }
            return false;
        },
        checkSolution: function() {
            var row=0, column= 0,
                correct=true;
            for (row; row<_p.settings.rows; row++) {
                for (column; column<_p.settings.columns; column++) {
                    var tile = _p.get_tile_at_row_column(row, column);
                    if (tile.data('row') != tile.data('row-ori') ||
                        tile.data('column') != tile.data('column-ori')) {
                        correct=false;
                    }
                }
            }
            if (correct) {
                var succesHtml = $("<div>Gefeliciteerd!</div><div><img src='"+_p.settings.image+"'/></div>");
                _p.settings.puzzleContainer.html(succesHtml);
            }
        },
        switch_with_empty: function(row, column, emptyTile) {
            _p.switch_tile_with_empty(_p.get_tile_at_row_column(row, column), emptyTile)
        },
        switch_tile_with_empty: function(tile, emptyTile) {
            // switch classes
            emptyTile.attr("class", tile.attr("class"));
            tile.attr("class", _p.settings.emptyTileClass);
            // switch styles
            var emptyTileStyle = emptyTile.attr("style");
            emptyTile.attr("style", tile.attr("style"));
            tile.attr("style", emptyTileStyle);
            // copy original position
            emptyTile.data('row-ori', tile.data('row-ori'));
            emptyTile.data('column-ori', tile.data('column-ori'));
            tile.data('row-ori', 0);
            tile.data('column-ori', 0);
        },
        is_empty_tile: function(tile) {
            return tile.hasClass(_p.constants.emptyTileClass);

        },
        get_tile_at_row_column: function(row, column) {
            return $("#"+_p.settings.tileIdPrefix+row+"_"+column)
        },
        get_max_z: function(){
            var elements = document.getElementsByTagName("*");
            var highest_index = 0;

            for (var i = 0; i < elements.length - 1; i++) {
                if (parseInt(elements[i].style.zIndex) > highest_index) {
                    highest_index = parseInt(elements[i].style.zIndex);
                }
            }
            return highest_index;
        }
    };

    ceasaro.puzzle = _p;
}(jQuery));

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
jQuery.fn.puzzle = function(params) {
    params.puzzleContainer = this;
    if (!params.image) {
        params.image = this;
    }
    ceasaro.puzzle.init(params);
};
jQuery(document).ready(function() {
    jQuery.fn.puzzle({image:jQuery("document").randomImage(), rows:3, columns:3, overlay:true})
});
