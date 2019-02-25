$(document).ready(() => {
    let switches = $('[data-switch]').get();
    let current = 0;
    let dynamicCSSName;
    let dynamicCSSLoaded = false;

    $(switches).each((i, e) => doSwitch(i, $(switches).index(e)));

    function doSwitch(index, switchIndex) {
        let toSwitch = $.parseJSON(switches[index].dataset.switch)[switchIndex];
        let html = toSwitch[0];
        let name = html.substring(0, html.length - 5);
        let identifier = toSwitch[1];
        toSwitch.shift();
        toSwitch.shift();
        let scripts = toSwitch;
        $(switches[index])
            .fadeOut(500)
            .promise()
            .done(() => {
                if(dynamicCSSLoaded) {
                    $(`link[href = "css/${dynamicCSSName}.css"]`).remove();
                }
                $.ajax({
                    url: `/Naila/css/${name}.css`,
                    cache: false,
                    type:'HEAD',
                    success: function()
                    {
                        dynamicCSSLoaded = true;
                        dynamicCSSName = name;
                        $('head').append(`<link rel="stylesheet" href="css/${name}.css">`);
                    }
                });
                $(switches[index]).empty().load(`${html} ${identifier}>*`, () => $(scripts).each((index, element) => $.getScript(element))).promise().done((t) => t.fadeIn());
            });
        setTimeout(() => {
            $(identifier).find("#next").on("click", () => {
                if(current + 1 > switches.length) {
                    current = 0;
                    doSwitch($(switches).index($(identifier)), current)
                } else {
                    current++;
                    doSwitch($(switches).index($(identifier)), current);
                }
            });
            $(identifier).find('#back').on("click", () => {
                if(current - 1 < 0) {
                    current = switches.length;
                    doSwitch($(switches).index($(identifier)), current);
                } else {
                    current--;
                    doSwitch($(switches).index($(identifier)), current);
                }
            })
        }, 1000)
    }
});