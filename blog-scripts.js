(function() {
    'use strict';
    if (window.gardenCoreBooted) return;
    window.gardenCoreBooted = true;

    /* 1. SKIN VÁLTÓ */
    try {
        var month = new Date().getMonth() + 1;
        var body = document.body;
        if (month === 12 || month === 1 || month === 2) body.classList.add('winter-skin');
        else if (month >= 3 && month <= 5) body.classList.add('spring-skin');
        else if (month >= 6 && month <= 8) body.classList.add('summer-skin');
        else if (month >= 9 && month <= 11) body.classList.add('autumn-skin');
    } catch(e) { console.warn('Skin váltó hiba:', e); }

    /* 2. HETI CSOPORTOSÍTÁS FUNKCIÓ */
    function groupPostsByWeek() {
        var posts = document.querySelectorAll('article.post-outer-container');
        var lastWeekKey = "";
        if (posts.length === 0) return;
        posts.forEach(function(post) {
            var timeEl = post.querySelector('time.published');
            if (timeEl) {
                var dateStr = timeEl.getAttribute('datetime');
                var date = new Date(dateStr);
                var tDate = new Date(date.getTime());
                tDate.setHours(0,0,0,0);
                tDate.setDate(tDate.getDate() + 3 - (tDate.getDay() + 6) % 7);
                var week1 = new Date(tDate.getFullYear(), 0, 4);
                var weekNum = 1 + Math.round(((tDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                var currentWeek = weekNum + "-" + tDate.getFullYear();
                var existingHeader = document.querySelector('.weekly-header-' + currentWeek);
                if (currentWeek !== lastWeekKey && !existingHeader) {
                    var header = document.createElement('h2');
                    header.className = 'weekly-group-header weekly-header-' + currentWeek;
                    header.innerText = weekNum + '. hét';
                    post.parentNode.insertBefore(header, post);
                }
                lastWeekKey = currentWeek;
            }
        });
    }

    /* 3. KÉPMÉRET ALAPÚ EFFEKT JELÖLÉS */
    function markLargeImages() {
        document.querySelectorAll('.post-body a > img').forEach(function(img) {
            function evaluate() {
                var h = img.naturalHeight;
                var w = img.naturalWidth;
                if (h >= 300 && w / h < 2.5) {
                    var link = img.closest('a');
                    if (link) link.classList.add('img-featured');
                }
            }
            if (img.complete) evaluate();
            else img.addEventListener('load', evaluate);
        });
    }

    /* 4. NÖVÉNY CÍMKE MOTOR - PIXELPONTOS DESIGN */
    function transformPlantLabels() {
        var containers = document.querySelectorAll('.post-body, .entry-content');
        containers.forEach(function(container) {
            if (container.dataset.plantsDone) return;
            var html = container.innerHTML;
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                var prefix = "";
                var cleanCommon = common;
                if (cleanCommon.indexOf('>') !== -1) {
                    var lastTagIndex = cleanCommon.lastIndexOf('>');
                    prefix = cleanCommon.substring(0, lastTagIndex + 1);
                    cleanCommon = cleanCommon.substring(lastTagIndex + 1);
                }
                var labelMatch = cleanCommon.match(/^(.*?)(Növények|Növény|Ültetve|Lista):\s*/i);
                if (labelMatch) {
                    prefix += labelMatch[0];
                    cleanCommon = cleanCommon.substring(labelMatch[0].length);
                }
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();
                if (cleanCommon.length < 2) return match;

                var searchPath = '/search?q=' + encodeURIComponent(cleanLatin);
                var fullUrl = window.location.origin + searchPath;

                var out = prefix + '<a href="' + searchPath + '" title="' + fullUrl + '" ' +
                       'style="display:inline-flex!important; align-items:center!important; vertical-align:middle!important; ' +
                       'margin:4px 4px 4px 0!important; padding:3px 8px!important; ' +
                       'background:#F7F7F7!important; color:#0000008A!important; ' +
                       'border-radius:12px!important; border:none!important; ' +
                       'font-family:\'Plus Jakarta Sans\', sans-serif!important; ' +
                       'font-size:15px!important; font-weight:400!important; ' +
                       'text-decoration:none!important; transition: opacity 0.2s ease!important; cursor:pointer!important;">' +
                       cleanCommon + '</a>';
                return out;
            });
            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.plantsDone = "true";
            }
        });
    }

    function runAll() {
        groupPostsByWeek();
        markLargeImages();
        transformPlantLabels();
    }

    document.addEventListener("DOMContentLoaded", function() {
        runAll();
        var backToTopBtn = document.getElementById("backToTop");
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if ((window.pageYOffset || document.documentElement.scrollTop) > 300) backToTopBtn.classList.add("visible");
                else backToTopBtn.classList.remove("visible");
            }, { passive: true });
            backToTopBtn.onclick = function() { window.scrollTo({top: 0, behavior: 'smooth'}); };
        }
    });
    window.addEventListener("load", runAll);
    setInterval(transformPlantLabels, 2000);
})();