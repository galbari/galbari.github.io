var trcManager = this,
	variant1 = '793032|2086',
	variant2 = '575019|2086',
	variant3 = '314049|2086',
	variantArr = [variant1, variant2, variant3],
	placement = ['Below Article Thumbnails | Card 1'];

try {
	TRC.aspect.before(
		trcManager,
		'renderRBox',
		function(rbox, options) {
			try {
				if (placement.indexOf(options.placement) !== -1) {
					TRC.aspect.after(
						rbox,
						'loadScriptCallback',
						function(cacheKey, response) {
							try {
								var currentVariant = response.trc['test-data'];

								if (
									variantArr.indexOf(currentVariant) !== -1 &&
									TRC.blockState === 0
								) {
									twoColFeed();
								}
							} catch (e) {
								console.log(e);
							}
						},
						true
					);
				}
			} catch (e) {
				console.log(e);
			}
		},
		false
	);
} catch (e) {
	console.log(e);
}

function twoColFeed() {
	if (TRC.twoColFeedExecuted) {
		return;
	}

	function start2ColFeedProcess() {
        var LEFT_CONTAINER_CLASS = 'tbl-left-feed-container',
            RIGHT_CONTAINER_CLASS = 'tbl-right-feed-container',
            RIGHT_CONTAINER_ID = 'tbl-right-feed',
            ORGINAL_FEED_CONTAINER = 'taboola-container',
            FEEDS_WRAPPER = 'tbl-feeds-wrapper',
            STICKY_CLASS = 'tbl-sticky',
            ABSLT_POS_CLASS = 'tbl-abslt-pos',
            MODE = 'thumbnails-a-amp', // Should change to relevan mode
            PLACEMENT = '2 Columns Feed',
            container = document.getElementById(ORGINAL_FEED_CONTAINER),
            wrapper = document.createElement('div'),
            rightFeedContainer = document.createElement('div'),
            observerContainer,
            publisherFixedPositionElementHeight = 41,
            lastScrollPosition = 0,
            taboolaPushConfig = {
                mode: MODE,
                container: RIGHT_CONTAINER_ID, //taboola-below-article-thumbnails
                placement: PLACEMENT,
                target_type: 'mix'
            };
    
        loadCSSFile();
        wrapper.classList.add(FEEDS_WRAPPER);
        container.classList.add(LEFT_CONTAINER_CLASS);
        rightFeedContainer.classList.add(RIGHT_CONTAINER_CLASS);
        rightFeedContainer.setAttribute('id', RIGHT_CONTAINER_ID);
    
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);
        container.parentNode.insertBefore(rightFeedContainer, container.nextSibling);
    
        rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
        addSecondFeed();
        TRC.EventsAPI.listen('nocontent', handleRightFeedErrors);
        observeFeedInViewport();
    
        function handleRightFeedErrors(e) {
            if (e.detail.placement === PLACEMENT) {
                abort2ColFeedProcess();
            }
        }
    
        function abort2ColFeedProcess() {
            TRC.intersections.unobserve(observerContainer);
            container.classList.remove(LEFT_CONTAINER_CLASS);
            wrapper.removeChild(rightFeedContainer);
        }
    
        function loadCSSFile() {
            var link = document.createElement('link');
            link.href = '//s3.amazonaws.com/c3.taboola.com/ui-ab-tests/2-col-feed.css';
            link.type = 'text/css';
            link.rel = 'stylesheet';
    
            document.getElementsByTagName('body')[0].appendChild(link);
        }
    
        function getViewportHeight() {
            return Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
            );
        }
    
        function getLogoHeight() {
            return document.querySelector('.tbl-feed-header').offsetHeight;
        }
    
        function getTopMarginOfFeed(shouldReturnPxValue) {
            var containerMarginTop = parseInt(
                window.getComputedStyle(container).marginTop,
                10
            );
            var topMargin = getLogoHeight() + containerMarginTop;
            return shouldReturnPxValue ? topMargin + 'px' : topMargin;
        }
    
        function keepLeftPositionSync() {
            var leftFeedContainerClientRect = container.getBoundingClientRect();
            rightFeedContainer.style.left =
                container.getBoundingClientRect().right + 10 + 'px';
        }
    
        function addTopValueToStickyFeed() {
            rightFeedContainer.style.top = publisherFixedPositionElementHeight + 'px';
        }
    
        function addStickinessToRightFeed() {
            removeStickinessFromRightFeed();
            rightFeedContainer.style.width =
                rightFeedContainer.getBoundingClientRect().width + 'px';
            rightFeedContainer.classList.add(STICKY_CLASS);
            if (publisherFixedPositionElementHeight) addTopValueToStickyFeed();
            keepLeftPositionSync();
        }
    
        function removeStickinessFromRightFeed() {
            rightFeedContainer.classList.remove(STICKY_CLASS);
            rightFeedContainer.style.left = null;
            rightFeedContainer.style.width = null;
            rightFeedContainer.style.top = null;
        }
    
        function handleLeftFeedTouchesTopOfViewport() {
            if (!isFreezFeed()) addStickinessToRightFeed();
            TRC.dom.on(window, 'scroll', handleScroll);
            TRC.dom.on(window, 'resize', handlePageResize);
        }
    
        function handleLeftFeedIsPartOrOutsideTheViewport() {
            if (isStickyFeed()) removeStickinessFromRightFeed();
            TRC.dom.off(window, 'scroll', handleScroll);
        }
    
        function isRightFeedOverlapingLeftFeed() {
            var rightFeedContainerBottomPos = rightFeedContainer.getBoundingClientRect()
                .bottom;
            var containerBottomPos = container.getBoundingClientRect().bottom;
            return containerBottomPos < rightFeedContainerBottomPos;
        }
    
        function freezeRightFeed() {
            var topPosition = wrapper.offsetHeight - rightFeedContainer.offsetHeight;
            removeStickinessFromRightFeed();
            rightFeedContainer.classList.add(ABSLT_POS_CLASS);
            rightFeedContainer.style.top = topPosition + 'px';
            rightFeedContainer.style.marginTop = null;
        }
    
        function unFreezeRightFeed() {
            rightFeedContainer.classList.remove(ABSLT_POS_CLASS);
            rightFeedContainer.style.top = null;
            rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
            addStickinessToRightFeed();
        }
    
        function isStickyFeed() {
            return (
                rightFeedContainer.classList.contains(STICKY_CLASS) &&
                !rightFeedContainer.classList.contains(ABSLT_POS_CLASS)
            );
        }
    
        function isFreezFeed() {
            return (
                rightFeedContainer.classList.contains(ABSLT_POS_CLASS) && !isStickyFeed()
            );
        }
    
        function handlePageResize() {
            TRC.intersections.unobserve(observerContainer);
            if (isStickyFeed()) {
                keepLeftPositionSync();
            } else if (isFreezFeed()) {
                freezeRightFeed();
            } else {
                removeStickinessFromRightFeed();
            }
            observeFeedInViewport();
        }
    
        function getScrollDirection() {
            var newScrollPosition = window.scrollY;
            var dir;
            if (newScrollPosition < lastScrollPosition) {
                dir = 'up';
            } else {
                dir = 'down';
            }
            lastScrollPosition = newScrollPosition;
    
            return dir;
        }
    
        function isRightFeedContainerShouldUnfreeze() {
            return (
                isFreezFeed() &&
                rightFeedContainer.getBoundingClientRect().top > 0 + getAdditionalHeight()
            );
        }
    
        function isLeftFeedOverlapingRightFeed() {
            return (
                isFreezFeed() &&
                parseInt(container.getBoundingClientRect().bottom, 10) >
                    parseInt(rightFeedContainer.getBoundingClientRect().bottom, 10)
            );
        }
    
        function shouldUnfreezeRightFeed() {
            return (
                (getScrollDirection() === 'up' && isRightFeedContainerShouldUnfreeze()) ||
                isLeftFeedOverlapingRightFeed()
            );
        }
    
        function handleScroll(e) {
            if (isRightFeedOverlapingLeftFeed() && isStickyFeed()) {
                freezeRightFeed();
            } else if (shouldUnfreezeRightFeed()) {
                unFreezeRightFeed();
            }
        }
    
        function getAdditionalHeight() {
            return publisherFixedPositionElementHeight
                ? publisherFixedPositionElementHeight
                : 0;
        }
    
        function getRootMargin() {
            var viewportHeight = getViewportHeight();
            var logoHeight = getLogoHeight();
            var rootMarginTop = logoHeight + 'px';
            var rootMarginBottom =
                (viewportHeight + logoHeight - getAdditionalHeight()) * -1 + 'px';
            return rootMarginTop + ' 0px ' + rootMarginBottom + ' 0px';
        }
    
        function observeFeedInViewport() {
            var rootMargin = getRootMargin();
            var options = {
                targetElement: container,
                rootMargin: rootMargin,
                onEnter: handleLeftFeedTouchesTopOfViewport,
                onExit: handleLeftFeedIsPartOrOutsideTheViewport
            };
    
            observerContainer = TRC.intersections.observe(options);
        }
    
        function addSecondFeed() {
            _taboola.push(taboolaPushConfig);
        }
    }
    
    _taboola.push({
        listenTo: 'render',
        handler: function() {
            if (!TRC.rrLoaded && Object.keys(TRCImpl.feeds).length) {
                TRC.rrLoaded = true;
                start2ColFeedProcess();
            }
        }
    });
    
}
