!function ($, window, undefined) {

    "use strict"; // jshint ;_;


    /* SHRINKANDLINK PUBLIC CLASS DEFINITION
    * ================================ */

    var ShrinkAndLink = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.shrinkAndLink.defaults, options);

        this.init();
    }

    ShrinkAndLink.prototype = {
        constructor: ShrinkAndLink

      , init: function () {
          var that = this;
          var newText = that.shrink(that.$element.html());

          that.$element.html(newText);
      }
      , shrink: function (text) {
          var that = this
          var exp = /(\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]|\s?\((.*?)+\))))/ig;

          return text.replace(exp, function ($1) { return ShortUrl($1, that.options) });
      }
    }

    /* SHRINKANDLINK PRIVATE CLASS DEFINITION
    * ================================ */

    var ShortUrl = function (url, options) {
        var titleExp = /\((.*?)+\)/;
        var domainExp = /[a-z0-9.\-]+[.][a-z]{2,4}/;
        var titleMatch = url.match(titleExp);
        var l = typeof (options.maxLength) != "undefined" ? options.maxLength : 20;
        var domain_l = l;

        var replaceMatch = !options.keepWWW ? "//www." : "//"
        var url = url.replace("http:" + replaceMatch, "").replace("https:" + replaceMatch, "").replace(titleMatch ? titleMatch[0] : null, "")

        if (url.length <= l) { return url; }

        var domain = url.match(domainExp);
        if (options.forceShowDomain && domain && domain[0].length * 1.8 >= l)
            domain_l = ((domain[0].length * 1.8) / 2) + 5;

        var chunk_l = (l / 2);
        var start_chunk = ShortString(url, domain_l, false);
        var end_chunk = ShortString(url, chunk_l, true);
        var full_chunk = start_chunk + "..." + end_chunk;

        var title = titleMatch ? titleMatch[0].replace(/[()]/g, '') : full_chunk;

        return options.convertToLink ? '<a href="' + url + '" title="' + url + '">' + title + '</a>' : full_chunk;
    }

    var ShortString = function (s, l, reverse) {
        var stop_chars = [' ', '/', '&'];
        var acceptable_shortness = l * 0.80; // When to start looking for stop characters
        var reverse = typeof (reverse) != "undefined" ? reverse : false;
        var s = reverse ? s.split("").reverse().join("") : s;
        var short_s = "";

        for (var i = 0; i < l - 1; i++) {
            short_s += s[i];

            if (i >= acceptable_shortness && $.inArray(s[i], stop_chars)) {
                break;
            }
        }
        if (reverse) { return short_s.split("").reverse().join(""); }
        return short_s;
    }

    /* SHRINKANDLINK PLUGIN DEFINITION
    * ============================== */

    $.fn.shrinkAndLink = function (option) {
        return this.each(function () {
            var $this = $(this)
        , data = $this.data('shrinkAndLink')
        , options = typeof option == 'object' && option
            if (!data) $this.data('shrinkAndLink', (data = new ShrinkAndLink(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.shrinkAndLink.defaults = {
        keepWWW: false
        , convertToLink: true
        , maxLength: 20
        , forceShowDomain: true
    }

    $.fn.shrinkAndLink.Constructor = ShrinkAndLink

    /* SHRINKANDLINK NO CONFLICT
    * ================= */

    $.fn.shrinkAndLink.noConflict = function () {
        $.fn.shrinkAndLink = old
        return this
    }

    /* SHRINKANDLINK DATA-API
    * ================== */

    $(window).on('load', function () {
        $('[data-shortlink]').each(function () {
            var $this = $(this)
              , data = $this.data();

            $this.shrinkAndLink(data);
        })
    })

} (window.jQuery, window);