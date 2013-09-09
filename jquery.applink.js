;(function ($, window, document, undefined) {
    var pluginName = 'applink',
        mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent),
        defaults = {
            popup: true,
            desktop: false,
            data: pluginName
        };
 
    var Plugin = function (element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);

        this.init();
    }
 
    Plugin.prototype = {
        init: function () {
            var $element = $(this.element), that = this;

            $element.on('click.' + pluginName, function (event) {
                var href = $element.attr('href'),
                    applink = $element.data(that.settings.data),
                    enabled = (mobile || that.settings.desktop) ? applink : false;

                enabled = (enabled && (typeof enabled !== 'undefined')) ? true : false;

                event.preventDefault();

                if (!enabled) {
                    return that._link(href);
                }

                window.location = applink;

                var time = +new Date;

                setTimeout(function() {
                    if ((+new Date - time) < 400) {
                        that._link(href);
                    }
                }, 300);
            });
        },

        destroy: function () {
            $(this.element).off('.' + pluginName);
        },

        _link: function (href) {
            if (this.settings.popup && /^https?:\/\/(www\.)?(facebook|twitter)\.com/i.test(href)) {
                this._popUp(href);
            } else {
                window.location = href;
            }
        },

        _popUp: function (href) {
            var width = (screen.width > 620) ? 600 : screen.width,
                height = (screen.height > 300) ? 280 : screen.height,
                left = (screen.width / 2) - (width / 2),
                top = (screen.height / 2) - (height / 2),
                options = 'location=no,menubar=no,status=no,toolbar=no,scrollbars=no,directories=no,copyhistory=no'
                    + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

            window.open(href, pluginName, options).focus();
        }
    };
 
    $.fn[pluginName] = function (options) {
        if ((options === undefined) || (typeof options === 'object')) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
 
        if ((typeof options !== 'string') || (options[0] === '_') || (options === 'init')) {
            return true;
        }

        var returns, args = arguments;

        this.each(function () {
            var instance = $.data(this, 'plugin_' + pluginName);

            if ((instance instanceof Plugin) && (typeof instance[options] === 'function')) {
                returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            }

            if (options === 'destroy') {
                $.data(this, 'plugin_' + pluginName, null);
            }
        });

        return (returns !== undefined) ? returns : this;
    };
})(jQuery, window, document);
