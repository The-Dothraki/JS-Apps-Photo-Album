var Noty = (function () {

    function generate(type, text, time) {
        var n = noty({
            text: text,
            type: type,
            dismissQueue: true,
            layout: 'topCenter',
            theme: 'defaultTheme',
            maxVisible: 10,
            timeout: time
        });
        console.log('html: ' + n.options.id);
    }

    function success(text) {
        generate('success', text, 2000);
    }

    function error(text) {
        generate('error', text, 2000);
    }


    return {
        success: success,
        error: error,
    }
})();