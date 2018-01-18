TRC.feedTeaserSlider = function () {
    if (TRC.feedTeaserExecuted) {
        return;
    }

    var maxNumberOfOrganicItemsInSlider = 2,
        teaserIsVisible = false,
        doneCarouseling = false,
        // teaserVisibilityRemainingTime = 10000,
        teaserVisibilityRemainingTime = null,
        replaceCarouselItemTime = 3500,
        countingDownStartTime = 0,
        scrollDurationSpeed = 600,
        feedInViewport = false,
        mobileScreenWidth = '812px',
        carousel,
        teaserVisibilityCountDown,
        teaserAppearanceTime,
        teaserClickedTime;

    var arrowSVG = '<svg viewBox="0 0 20 20">' +
        '<defs></defs>' +
        '<g id="arrow-svg" stroke="none" stroke-width="1" fill-rule="evenodd">' +
        '<g id="icons" transform="translate(-18.000000, -20.000000)">' +
        '<path d="M34.4775,29.751875 L28.2275,36.3925 L28,36.634375 L27.771875,36.3925 L21.521875,29.751875 L21.2775,29.49125 L21.568125,29.28375 L22.4125,28.679375 L22.635,28.52 L22.8225,28.719375 L27.14125,33.308125 L27.14125,23.67875 L27.14125,23.36625 L27.45375,23.36625 L28.54625,23.36625 L28.85875,23.36625 L28.85875,23.67875 L28.85875,33.308125 L33.1775,28.719375 L33.365,28.52 L33.586875,28.679375 L34.431875,29.28375 L34.7225,29.49125 L34.4775,29.751875 Z M28,20 C22.476875,20 18,24.4775 18,30 C18,35.523125 22.476875,40 28,40 C33.5225,40 38,35.523125 38,30 C38,24.4775 33.5225,20 28,20 L28,20 Z" id="Desktop-arrow-initial"></path>' +
        '</g>' +
        '</g>' +
        '</svg>';
    var closeSVG = '<div class="tbl-teaser-closeBtn">' +
        '<svg width="10px" height="10px" viewBox="0 0 10 10">' +
        '<defs></defs>' +
        '<g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">' +
        '<g id="icons" transform="translate(-23.000000, -130.000000)">' +
        '<polygon id="Desktop-Close-initial" points="33 131.208868 31.7911325 130 28 133.791132 24.2088675 130 23 131.208868 26.7911325 135 23 138.791132 24.2088675 140 28 136.208868 31.7911325 140 33 138.791132 29.2088675 135"></polygon>' +
        '</g>' +
        '</g>' +
        '</svg>' +
        '</div>';

    var styleTag = '<style>' +
        '.tbl-cards-teaser {position: fixed; background: #f7f7f7; left: 16px; bottom: -500px; transition: 0.4s ease; width: 264px; height: 64px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14), 0 2px 2px 0 rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20); z-index: 9999999999; cursor: default;}' +
        '.tbl-cards-teaser.in-viewport {bottom: 25px;}' +
        '.tbl-cards-teaser .tbl-cards-teaser-inner {width: 100%; height: 100%; cursor: pointer;}' +
        '.tbl-cards-teaser .tbl-teaser-header {position: absolute; top: 8px; left: 93px; line-height: 15px; font-weight: bold; font-size: 12px;}' +
        '.tbl-cards-teaser .actionMessage { width: 100%; height: 100%; background: #f7f7f7; position: absolute; top: 0px; left: 0px; text-align: left; padding-left: 25px; font-weight: bold; font-size: 16px; color: #000000; line-height: 62px; opacity: 0; box-sizing: border-box; z-index: 99999; transition: opacity 0.2s ease}' +
        '.tbl-cards-teaser:hover .actionMessage {opacity: 1;}' +
        '.tbl-cards-teaser ul {margin: 0; padding: 0; width: 100%; height: 100%;}' +
        '.tbl-cards-teaser .item {display: list-item !important; list-style: none; width: 100%; height: 100%; position: absolute; top: 140px; left: 0;}' +
        '.tbl-cards-teaser .item.show {top: 0;}' +
        '.tbl-cards-teaser .img {display: inline-block; vertical-align: top; width: 81px; height: 100%; background-size: cover; background-position: center; transform: translateY(140px); transition: transform 0.2s ease;}' +
        '.tbl-cards-teaser .item.show .img {transform: translateY(0);}' +
        '.tbl-cards-teaser .content-container {display: inline-block; width: 140px; height: 100%; padding-top: 23px; padding-left: 12px; vertical-align: top; overflow: hidden;}' +
        '.tbl-cards-teaser .content {font-size: 12px; background: #f7f7f7; line-height: 15px; float: none; width: auto; transform: translateY(140px); transition: transform 0.35s ease;}' +
        '.tbl-cards-teaser .content .mobile-header {display: none; font-weight: bold;}' +
        '.tbl-cards-teaser .item.show .content {transform: translateY(0);}' +
        '.tbl-cards-teaser .arrow {position: absolute; top: 22px; right: 15px; z-index: 999999;}' +
        '.tbl-cards-teaser .arrow svg {width: 20px; height: 20px; fill: #4472C4; transition: 0.2s ease;}' +
        '.tbl-cards-teaser:hover .arrow svg {transform: scale(1.4);}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn-wrapper {position: absolute; top: -25px; right: -25px; width: 27px; height: 27px;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn {position: absolute; top: 0; right: 0; width: 20px; height: 20px; border-radius: 50%; background: #000000; border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14), 0 2px 2px 0 rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20); visibility: hidden; opacity:0; transition: 0.2s ease; cursor: pointer}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn svg {display: block; height: 100%; margin: auto; fill: #ffffff; transition: 0.2s ease;}' +
        '.tbl-cards-teaser:hover .tbl-teaser-closeBtn {visibility: visible; opacity: 1}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn:hover {background: #EEEEEE;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn:hover svg{fill: #000000;}' +
        ////////////// Mobile Style
        '@media screen and (min-width: 0px) and (max-width: ' + mobileScreenWidth + ') { ' +
        '.tbl-cards-teaser {width: 100vw; top: -300px; left: 0; border-radius: 0; overflow: hidden;}' +
        '.tbl-cards-teaser.in-viewport {top: 0;}' +
        '.tbl-cards-teaser .tbl-teaser-header {line-height: 16px; font-size: 13px; top: 7px;}' +
        '.tbl-cards-teaser .content-container {width: 64%; padding-top: 22px;}' +
        '.tbl-cards-teaser .content {font-size: 13px; line-height: 16px;}' +
        '.tbl-cards-teaser .actionMessage {display: none;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn-wrapper {top: 0; right: 5px; width: 40px; height: 100%; z-index: 99;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn {height: 100%; width: 100%; display: block; visibility: visible; opacity: 1; background: none; border: none; box-shadow: none; transition: none;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn svg {height: 100%; fill: #000000;}' +
        '.tbl-cards-teaser .arrow {display: none;}' +
        '.tbl-cards-teaser .tbl-teaser-closeBtn:hover {background: none;}' +
        '.tbl-cards-teaser:hover .arrow {display: none;}' +
        '.tbl-cards-teaser:hover .arrow svg {transform: none;}' +
        '}' +
        '</style>';

    function scrollToDestination(destination, duration, easing, callback) {
        var easings = {
            linear: function (t) {
                return t;
            }
        };

        var start = window.pageYOffset;
        var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
        var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

        if ('requestAnimationFrame' in window === false) {
            window.scroll(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }

        function scroll() {
            var now = 'now' in window.performance ? performance.now() : new Date().getTime();
            var time = Math.min(1, ((now - startTime) / duration));
            var timeFunction = easings[easing](time);
            var scrollYPosition = Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start);
            window.scrollTo(0, scrollYPosition);

            if (window.pageYOffset === destinationOffsetToScroll) {
                if (callback) {
                    callback();
                }
                return;
            }

            requestAnimationFrame(scroll);
        }

        scroll();
    }

    function cutTextContent(string, endPosition) {
        return string.slice(0, endPosition).trim() + '...';
    }

    function createOrganicItemsObj(item) {
        return {
            content: item.title || item.description,
            img: item.thumbnail
        };
    }

    function getOrganicCards(allCards) {
        var organicCards = [];
        for (var card in allCards) {
            if (allCards[card].mode.indexOf('organic') > -1) {
                organicCards.push(allCards[card]);
            }
        }

        return organicCards;
    }

    function getOrganicItemsFromCard(itemsArray, nextCard) {
        return itemsArray.concat(nextCard.response.trc['video-list'].video);
    }

    function getCardsData() {
        var organicCards = getOrganicCards(TRCImpl.boxes);
        var organicItems = organicCards.reduce(getOrganicItemsFromCard, []);
        var numberOfItemsInSlider = organicItems.length >= maxNumberOfOrganicItemsInSlider ? maxNumberOfOrganicItemsInSlider : organicItems.length;

        return organicItems.slice(0, numberOfItemsInSlider).map(createOrganicItemsObj);
    }

    function getItmesAsHtmlString(cardsData) {
        return cardsData.reduce(function (html, card, index) {
            var showClass = index === 0 ? 'show' : '';
            return html + '<li class="item card-' + index + ' ' + showClass + '" style="z-index:' + index + ';">' +
                '<div class="img" style="background-image: url(' + card.img + ')"></div>' +
                '<div class="content-container">' +
                '<div class="content">' +
                '<span class="mobile-header">Up Next:&nbsp;</span>' +
                '<span class="card-content">' + card.content + '</span>' +
                '</div>' +
                '</div>' +
                '</li>';
        }, '');
    }

    function createElement(element, id, classes, innerHTML) {
        if (!element) {
            return false;
        }

        var domElement = document.createElement(element);
        domElement.id = id ? id : '';
        domElement.className += classes ? classes : '';
        domElement.innerHTML = innerHTML ? innerHTML : '';

        return domElement;
    }

    function createTeaser(cardsData) {
        var teaser = createElement('div', 'tbl-teaser', ' tbl-cards-teaser');
        var innerTeaser = createElement('div', 'tbl-teaser-inner', 'tbl-cards-teaser-inner');

        var header = createElement('div', null, 'tbl-teaser-header', 'Up Next');
        var arrowIcon = createElement('div', null, 'arrow', arrowSVG);
        var closeBtn = createElement('div', null, 'tbl-teaser-closeBtn-wrapper', closeSVG);
        var actionMessageDiv = createElement('div', null, 'actionMessage', 'Click for more content');

        var items = getItmesAsHtmlString(cardsData);
        var itemsContainer = createElement('ul', 'tbl-items-container', null, items);

        innerTeaser.appendChild(header);
        innerTeaser.appendChild(arrowIcon);
        innerTeaser.appendChild(actionMessageDiv);
        innerTeaser.appendChild(itemsContainer);
        teaser.appendChild(innerTeaser);
        teaser.appendChild(closeBtn);
        return teaser;
    }

    function cutText(item) {
        var container = item.parentNode;
        var containerHeight = item.parentNode.offsetHeight - parseInt(window.getComputedStyle(container).paddingTop, 10);

        while (item.offsetHeight > containerHeight || item.offsetHeight > 41) {
            //replace the last word with ...
            item.innerText = item.innerText.replace(/\W*\s(\S)*$/, '...');
        }

    }

    function handleTextOverflow() {
        var items = document.querySelectorAll('#tbl-items-container .item .content');
        items.forEach(cutText);
    }

    function getFeedElement() {
        return document.querySelector('.tbl-feed-container');
    }

    function sendEvent(eventName, eventType) {
        window._taboola = window._taboola || [];

        _taboola.push({
            name: 'abtests',
            val: {
                abTestsEventType: 'simple',
                name: eventName,
                type: eventType,
                eventTime: new Date().getTime()
            }
        });
    }

    function addEventsListners() {
        document.querySelector('#tbl-teaser-inner').addEventListener('click', handleTeaserClick);
        document.querySelector('.tbl-teaser-closeBtn').addEventListener('click', handleCloseBtnClick);
        document.querySelector('#tbl-teaser').addEventListener('mouseenter', handleTeaserHover);
        document.querySelector('#tbl-teaser').addEventListener('mouseleave', handleMouseLeaveTeaser);
    }

    function handleCloseBtnClick(e) {
        e.preventDefault();
        sendEvent('closeTeaserBtnClicked', 'click');
        hideTeaser();
    }

    function handleTeaserHover() {
        sendEvent('teaserHovered', 'hover');
        if (doneCarouseling) {
            pauseTeaserVisibilityCountDown();
        } else {
            stopCarousel();
        }
    }

    function handleMouseLeaveTeaser() {
        if (doneCarouseling) {
            startTeaserVisibilityCountDown();
        } else {
            playCarousel();
        }
    }

    function pauseTeaserVisibilityCountDown() {
        if (teaserVisibilityRemainingTime) {
            teaserVisibilityRemainingTime = teaserVisibilityRemainingTime - (new Date() - countingDownStartTime);
            stopTimer(teaserVisibilityCountDown);
        }
    }

    function startTimer(func, time) {
        return window.setInterval(func, time);
    }

    function stopTimer(interval) {
        if (interval) {
            window.clearInterval(interval);
        }
    }

    function resumeTeaserVisibilityCountDown() {
        if (teaserVisibilityRemainingTime) {
            teaserVisibilityCountDown = startTimer(hideTeaser, teaserVisibilityRemainingTime);
            updateCountingDownStartTime();
        }
    }

    function updateCountingDownStartTime() {
        countingDownStartTime = new Date();
    }

    function hideTeaser() {
        var teaser = document.getElementById('tbl-teaser');
        teaser.classList.remove('in-viewport');
        teaserIsVisible = false;
        sendEvent('teaserIsHidden', 'teaserIsHidden');
        stopTimer(teaserVisibilityCountDown);
        stopTimer(carousel);
    }

    function handleTeaserClick(e) {
        e.preventDefault();
        sendEvent('teaserClicked', 'click');
        var feed = getFeedElement();
        var destination = getElementDestinationFromTopOfThePage(feed);
        destination = destination - 150; //remove 100px from desitantion so if there is fixed header on the page, it won't cover up the taboola-feed logo
        scrollToDestination(destination, scrollDurationSpeed, 'linear');
        hideTeaser();
    }

    function getElementDestinationFromTopOfThePage(element) {
        var yPosition = 0;
        while(element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return yPosition;
    }

    function showNextItem() {
        var allShownItems = document.querySelectorAll('#tbl-teaser .item.show');
        var lastShownItem = allShownItems[allShownItems.length - 1];
        var nextItem = lastShownItem.nextSibling;
        var firstItem = document.querySelector('#tbl-teaser .card-0');

        if (nextItem) {
            nextItem.classList.add("show");
            if (lastShownItem.classList.contains('card-0')) {
                setTimeout(function() {
                    firstItem.classList.remove('show');
                }, 355)
            }
        } else {
            //show first Item agian when no more organic items to show
            firstItem.style.zIndex = 99;
            firstItem.classList.add("show");
            doneCarouseling = true;

            stopCarousel();
            startTeaserVisibilityCountDown();
        }
    }

    function startTeaserVisibilityCountDown() {
        if (teaserVisibilityRemainingTime) {
            teaserVisibilityCountDown = startTimer(hideTeaser, teaserVisibilityRemainingTime);
            updateCountingDownStartTime();
        }
    }

    function playCarousel() {
        carousel = startTimer(shouldShowNextItem, replaceCarouselItemTime);
    }

    function stopCarousel() {
        stopTimer(carousel);
    }

    function shouldShowNextItem() {
        if (teaserIsVisible) {
            showNextItem();
        } else {
            stopCarousel();
        }
    }

    function showTeaser(slider) {
        slider.classList.add('in-viewport');
        teaserIsVisible = true;
        teaserAppearanceTime = Date.now();
        sendEvent('teaserIsVisible', 'teaserIsVisible');
    }

    function feedInViewportHandler() {
        feedInViewport = true;
        if (teaserIsVisible) {
            hideTeaser();
        }
    }

    function observeFeed(feed) {
        if (feed) {
            var options = {
                targetElement: feed,
                onEnter: feedInViewportHandler
            };

            TRC.intersections.observe(options);
        }
    }

    var cardsData = getCardsData();
    var style = createElement('div', 'tbl-teaser-style', null, styleTag);
    var teaser = createTeaser(cardsData);

    document.body.appendChild(style);
    document.body.appendChild(teaser);
    handleTextOverflow();
    addEventsListners();
    observeFeed(getFeedElement());


    setTimeout(function () {
        if (cardsData.length && !feedInViewport) {
            showTeaser(teaser);
            playCarousel();
        }
    }, 5000);

    TRC.feedTeaserExecuted = true;
};
