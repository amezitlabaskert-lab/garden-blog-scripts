(function() {
    'use strict';

    /* 1. SKIN VÁLTÓ */
    function initSkin() {
        try {
            var month = new Date().getMonth() + 1;
            var body = document.body;
            // Eltávolítjuk az esetleges korábbi skineket, ha duplán futna
            body.classList.remove('winter-skin', 'spring-skin', 'summer-skin', 'autumn-skin');
            
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
        // Flag a dupla inicializálás elkerülésére
        if (window.scriptsInitialized) return;
        window.scriptsInitialized = true;

        initSkin();
        groupPostsByWeek();
        markLargeImages();
        
        var backToTopBtn = document.getElementById("backToTop");
        if (backToTopBtn) {
            var ticking = false;

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        if (scrollTop > 300) {
                            backToTopBtn.classList.add("visible");
                        } else {
                            backToTopBtn.classList.remove("visible");
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            backToTopBtn.onclick = function(e) { 
                e.preventDefault();
                window.scrollTo({top: 0, behavior: 'smooth'}); 
            };
        }
    }

    // Stabil indítás: ha a DOM kész, indulhat, de a képek miatt a window.load is figyel
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", initGeneral);
    } else {
        initGeneral();
    }
    window.addEventListener("load", initGeneral);

})();
