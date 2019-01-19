(function (document) {
    const CLASSNAME_LAZYLOAD = "lazy";
    const MEDIA_TAGS = ["img", "video", "script", "link"];
    const MEDIA_TAG_QUERY = (function () {
        const period = ".";
        const comma = ",";
        let output = new String();

        MEDIA_TAGS.forEach(element => {
            output += element + period + CLASSNAME_LAZYLOAD + comma;
        });

        return output.slice(0, -1);
    })()

    let allMediaElements = [];

    let itemsToLoad = 0;

    let currentLoadedItemCount = 0;

    let progressCallback = null;

    const preCallBack = function (element) {
        if (element) element.classList.remove(CLASSNAME_LAZYLOAD);
        ++currentLoadedItemCount;
        if (progressCallback) progressCallback(Math.min(currentLoadedItemCount / itemsToLoad, 1));
    }

    document.addEventListener("DOMContentLoaded", function () {
        allMediaElements = [].slice.call(document.querySelectorAll(MEDIA_TAG_QUERY));

        let customFontsSpecified = (Array.isArray(GLOBAL_FONTS) && GLOBAL_FONTS.length);

        itemsToLoad = allMediaElements.length + (customFontsSpecified ? GLOBAL_FONTS.length : 0);

        for (let index = 0; index < allMediaElements.length; ++index) {
            if (allMediaElements[index].nodeName.toLowerCase() == MEDIA_TAGS[1]) {
                allMediaElements[index].onloadeddata = function () { preCallBack(allMediaElements[index]) };
            } else if (allMediaElements[index].nodeName.toLowerCase() == MEDIA_TAGS[2]) {
                let script = document.createElement(MEDIA_TAGS[2]);
                script.onload = function () { preCallBack(allMediaElements[index]) };
                script.setAttribute("src", allMediaElements[index].dataset.src);
                allMediaElements[index].parentNode.replaceChild(script, allMediaElements[index]);
            } else {
                allMediaElements[index].onload = function () { preCallBack(allMediaElements[index]) };
            }

            allMediaElements[index].src = allMediaElements[index].dataset.src;
        }

        allMediaElements = [];

        if (customFontsSpecified) {
            WebFontConfig = {
                google: {
                    families: GLOBAL_FONTS
                },
                active: function () {
                    preCallBack(null);
                },
                inactive: function () {
                    preCallBack(null);
                }
            };

            (function () {
                var wf = document.createElement('script');
                wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
                wf.type = 'text/javascript';
                wf.async = 'true';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wf, s);
            })();
        }
    });

    document.loadTracker = {
        registerProgressCallback: function (callback) {
            progressCallback = callback;
        }
    };
})(document);