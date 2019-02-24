$(document).ready(function () {
    var itemsToTooltip = $('[alt]');
    var currentItem;
    var isBeingFaded = false;
    if (itemsToTooltip.length > 0) {
        var tooltip = $('<div/>', {
            id: 'tooltip'
        }).appendTo('body');
    }
    function moveTooltip(e, item) {
        tooltip.text(item.attr('alt'));
        currentItem = item;
        var tw = tooltip.outerWidth(true);
        var th = tooltip.outerHeight(true);

        var x = e.pageX;
        var y = e.pageY;
        var w = $(document).width();
        var h = $(document).height();

        if (x + tw >= w) {
            x = w - tw;
        }
        if (y + th >= h) {
            y = h - th;
        }

        tooltip.fadeIn('fast').css({
            'left': x - tooltip.width() / 2,
            'top': y - tooltip.height()
        });
    }

    function isMouseInCurrentItem(e) {
        let offset = currentItem.offset();
        let r = currentItem.outerWidth()/2;
        //item, cursor
        let d = Math.sqrt((Math.pow(offset.left + r - e.pageX, 2) + Math.pow(offset.top + r - e.pageY, 2)));
        return d < r;
    }

    function fadeTooltip() {
        if (!isBeingFaded) {
            isBeingFaded = true;
            $.when(tooltip.stop().fadeOut('2s', function () {
                $(this).text('')
            })).done(function () {
                isBeingFaded = false;
            })
        }
    }

    itemsToTooltip.mousemove(function (e) {
        moveTooltip(e, $(this))
    });

    itemsToTooltip.mouseout(function (e) {
        if(!isMouseInCurrentItem(e)) {
            fadeTooltip();
        }
    });

    tooltip.mousemove(function(e) {
        if(isMouseInCurrentItem(e)) {
            moveTooltip(e, currentItem)
        } else {
            fadeTooltip();
        }
    });

    tooltip.mouseout(function(e) {
        if(!isMouseInCurrentItem(e)) {
            fadeTooltip();
        }
    });
});