$(document).ready(() => {
    let switches = $('[data-switch]').get();
    let current = 0;
    if (switches.length > 0) {
        doSwitch(current);
    }

    function doSwitch(index) {
        let toSwitch = $.parseJSON(switches[0].dataset.switch)[index];
        let html = toSwitch[0];
        let identifier = toSwitch[1];
        toSwitch.shift();
        toSwitch.shift();
        let scripts = toSwitch;
        $(switches[0])
            .fadeOut(500)
            .promise()
            .done(() => {
                $(switches[0]).empty().load(html + " " + identifier+">*", () => $(scripts).each((index, element) => $.getScript(element))).promise().done((t) => t.fadeIn());
            });
        setTimeout(() => {
            $(identifier).find("#next").on("click", () => {
                if(current + 1 > switches.length) {
                    current = 0;
                    doSwitch(current)
                } else {
                    current++;
                    doSwitch(current);
                }
            });
            $(identifier).find('#back').on("click", () => {
                if(current - 1 < 0) {
                    current = switches.length;
                    doSwitch(current);
                } else {
                    current--;
                    doSwitch(current);
                }
            })
        }, 1000)
    }
});