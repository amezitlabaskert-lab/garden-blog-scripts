(function() {
    'use strict';

    /* 1. SKIN VÁLTÓ */
    function initSkin() {
        try {
            var month = new Date().getMonth() + 1;
            var body = document.body;
            if (month === 12 || month === 1 || month === 2) body.classList.add('winter-skin');
            else if (month >= 3 && month <= 5) body.classList.add('spring-skin');
            else if (month >= 6 && month <= 8) body.classList.add('summer-skin');
            else if (month >= 9 && month <= 11) body.classList.add('autumn-skin');
        } catch(e) { console.warn('Skin váltó hiba:', e); }
    }

    /* 2. HETI CSOPORTOSÍTÁS */
    function groupPostsByWeek() {
        var posts = document.querySelectorAll('article.post-outer-container');
        var lastWeekKey = "";
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
                if (currentWeek !== lastWeekKey && !document.querySelector('.weekly-header-' + currentWeek)) {
                    var header = document.createElement('h2');
                    header.className = 'weekly-group-header weekly-header-' + currentWeek;
                    header.innerText = weekNum + '. hét';
                    post.parentNode.insertBefore(header, post);
                }
                lastWeekKey = currentWeek;
            }
        });
    }

    /* 3. KÉPMÉRET EFFEKT */
    function markLargeImages() {
        document.querySelectorAll('.post-body a > img').forEach(function(img) {
            function evaluate() {
                if (img.naturalHeight >= 300 && img.naturalWidth / img.naturalHeight < 2.5) {
                    var link = img.closest('a');
                    if (link) link.classList.add('img-featured');
                }
            }
            if (img.complete) evaluate();
            else img.addEventListener('load', evaluate);
        });
    }

    /* 4. ESEMÉNYEK ÉS GOMBOK */
    function initGeneral() {
        initSkin();
        groupPostsByWeek();
        markLargeImages();
        
        var backToTopBtn = document.getElementById("backToTop");
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if ((window.pageYOffset || document.documentElement.scrollTop) > 300) backToTopBtn.classList.add("visible");
                else backToTopBtn.classList.remove("visible");
            }, { passive: true });
            backToTopBtn.onclick = function() { window.scrollTo({top: 0, behavior: 'smooth'}); };
        }
    }

    document.addEventListener("DOMContentLoaded", initGeneral);
    window.addEventListener("load", initGeneral);
})();
