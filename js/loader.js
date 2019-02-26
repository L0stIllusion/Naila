$(document).ready(() => {
    let switches = $('[data-switch]').get();
    let current = 0;
    let dynamicCSSNames = [];
    let dynamicCSSLoaded = false;
    let jsRegex = new RegExp('(js)\\/(.*\\.js)');
    let cssRegex = new RegExp('(css)\\/(.*\\.css)');

    $(switches).each((i, e) => doSwitch(i, $(switches).index(e)));

    function doSwitch(index, switchIndex) {
        let toSwitch = $.parseJSON(switches[index].dataset.switch)[switchIndex];
        let html = toSwitch[0];
        let identifier = toSwitch[1];
        let scripts = $(toSwitch).filter((i, e) => {
            try {
                return jsRegex.exec(e)[2];
            } catch (e) {
                return false;
            }
        });
        let cssFiles = $(toSwitch).filter((i, e) => cssRegex.test(e)).map((i, e) => {
            try {
                return cssRegex.exec(e)[2];
            } catch (e) {
                return false;
            }
        });
        $(switches[index])
            .fadeOut(500)
            .promise()
            .done(() => {
                if(dynamicCSSLoaded) {
                    $.each(dynamicCSSNames, index => {
                        $(`link[href = "css/${dynamicCSSNames[index]}"]`).remove();
                    });
                }
                $.each(cssFiles, i =>
                    $.ajax({
                        url: `/Naila/css/${cssFiles[i]}`,
                        cache: false,
                        type:'HEAD',
                        success: function()
                        {
                            dynamicCSSLoaded = true;
                            dynamicCSSNames.push(cssFiles[index]);
                            $('head').append(`<link rel="stylesheet" href="css/${cssFiles[i]}">`);
                        },
                        error: function () {
                            console.log("error");
                        }
                    }));
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