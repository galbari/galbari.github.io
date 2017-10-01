function transitionBanner() {
    function cutTextContent(string, endPosition) {
        return string.slice(0, endPosition) + '...';
    }

    function createOrganicCardObj(cardData) {
        var card = cardData.boxes[0];
        var textContent = card.textContent;
        var maxContentLength = 57;

        textContent = textContent.length >= maxContentLength ? cutTextContent(textContent, maxContentLength) : textContent;
        return {
            content: textContent,
            container: cardData.container,
            img: card.video_data.thumbnail
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

    function getCardsData() {
        var organicCards = getOrganicCards(TRCImpl.boxes);
        return organicCards.map(createOrganicCardObj);
    }

    function getItmesAsHtmlString(cardsData) {
        return cardsData.reduce(function(html, card, index){
            var showClass = index === 0 ? 'show' : '';
            return html + '<li class="item ' + showClass + '" style="z-index:'+ index + ';">' +
                            '<div class="img" style="background-image: url(' + card.img + ')"></div>' +
                            '<div class="content-container">' +
                                '<div class="content">' + card.content + '</div>' +
                            '</div>' +
                            '<div class="arrow">' +
                                '<svg height="32" viewBox="0 0 1792 1792" width="32" ' +
                                    '<path d="M1412 897q0-27-18-45l-91-91q-18-18-45-18t-45 18l-189 189v-502q0-26-19-45t-45-19h-128q-26 0-45 19t-19 45v502l-189-189q-19-19-45-19t-45 19l-91 91q-18 18-18 45t18 45l362 362 91 91q18 18 45 18t45-18l91-91 362-362q18-18 18-45zm252-1q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>' +
                                '</svg>' +
                            '</div>' +
                        '</li>';
        }, '');
    }

    function createSlider(cardsData) {
        var slider = document.createElement('div');
        var header = document.createElement('div');
        var itemsContainer = document.createElement('ul');
        var items = getItmesAsHtmlString(cardsData);

        slider.id = 'tbl-slider';
        slider.className += ' tbl-cards-slider';
        header.className += 'tbl-slider-header';
        slider.appendChild(itemsContainer);
        itemsContainer.innerHTML = items;

        return slider;
    }

    function getStyle() {
        var styleDiv = document.createElement('div');
        styleDiv.id = 'tbl-slider-style';
        styleDiv.innerHTML = '<style>' +
            '.tbl-cards-slider {position: fixed; background: #f7f7f7; left: 25px; bottom: -500px; transition: bottom 0.4s ease 2s; width: 525px; height: 130px; overflow: hidden; border-radius: 10px; border: 1px solid rgb(203, 203, 203); box-shadow: 2px 2px 1px 1px rgba(144, 144, 144, 0.7); }' +
            '.tbl-cards-slider.in-viewport{bottom: 45px}' +
            '.tbl-cards-slider .tbl-slider-header {position: relative; padding: 15px 0 0px 175px; z-index: 999999;}' +
            '.tbl-cards-slider ul {margin: 0; padding: 0; width: 100%; height: 100%;}' +
            '.tbl-cards-slider .item {list-style: none; display: table; width: 100%; height: 100%; position: absolute; top: 140px; left: 0;}' +
            '.tbl-cards-slider .item.show {top: 0;}' +
            '.tbl-cards-slider .img {display: table-cell; width: 160px; height: 100%; background-size: cover; background-position: center; transform: translateY(140px); transition: transform 0.2s ease;}' +
            '.tbl-cards-slider .item.show .img {transform: translateY(0);}' +
            '.tbl-cards-slider .content-container {display: table-cell; width: 275px; height: 100%; padding: 0 15px; vertical-align: middle}' +
            '.tbl-cards-slider .header {font-weight: bold; font-size: 16px;}' +
            '.tbl-cards-slider .content {width: 260px; font-size: 16px; background: #f7f7f7; transform: translateY(140px); transition: transform 0.35s ease;}' +
            '.tbl-cards-slider .item.show .content {transform: translateY(0);}' +
            '.tbl-cards-slider .arrow {display: table-cell; vertical-align: middle;}' +
        '</style>';

        return styleDiv;
    }

    function showNextItem() {
        var allShownItems = document.querySelectorAll('#tbl-slider .item.show');
        var lastShownItem = allShownItems[allShownItems.length - 1];
        var nextItem = lastShownItem.nextSibling;

        if (nextItem) {
            nextItem.classList.add("show");
            console.log("show next item");
        } else {
            stopSlider();
        }
    }

    function stopSlider() {
        clearInterval(activeSlider);
        console.log('clear interval acomplished!');
    }

    var cardsData = getCardsData();
    var style = getStyle();
    var slider = createSlider(cardsData);
    var activeSlider;

    document.body.appendChild(style);
    document.body.appendChild(slider);
    setTimeout(function() {
        slider.classList.add('in-viewport');
    },1000);

    setTimeout(function(){
        activeSlider = setInterval(function () {
            console.log("executing interval");
            showNextItem();
        }, 3500);
    }, 5000);

}

setTimeout(function(){
    transitionBanner();
}, 5000);


