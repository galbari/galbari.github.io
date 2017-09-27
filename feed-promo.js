function transitionBanner() {
    function createOrganicCardObj(cardData) {
        var container = cardData.container;
        var card = cardData.boxes[0];
        return {
            title: card.title,
            content: card.textContent,
            container: container,
            img: card.video_data.thumbnail
        };
    }

    function getOrganicCards(allCards) {
        var organicCards = [];
        for (var card in allCards) {
            if (allCards[card].mode.indexOf('organic')) {
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
        return cardsData.reduce(function(html, card){
            return html + '<li class="item">' +
                            '<div class="img" style="background-image: url(' + card.img + ')"></div>' +
                            '<div class="content-container">' +
                                '<div class="header">Up next:</div>' +
                                '<div class="content">' + card.content + '</div>' +
                                '<div class="arrow">' +
                                    '<svg height="32" viewBox="0 0 1792 1792" width="32" ' +
                                        '<path d="M1412 897q0-27-18-45l-91-91q-18-18-45-18t-45 18l-189 189v-502q0-26-19-45t-45-19h-128q-26 0-45 19t-19 45v502l-189-189q-19-19-45-19t-45 19l-91 91q-18 18-18 45t18 45l362 362 91 91q18 18 45 18t45-18l91-91 362-362q18-18 18-45zm252-1q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>' +
                                    '</svg>' +
                                '</div>' +
                            '</div>' +
                        '</li>';
        }, '');
    }

    function createSlider(cardsData) {
        var slider = document.createElement('div');
        var itemsContainer = document.createElement('ul');
        var items = getItmesAsHtmlString(cardsData);

        slider.id = 'tbl-slider';
        slider.className += ' tbl-cards-slider';
        slider.appendChild(itemsContainer);
        itemsContainer.innerHTML = items;

        return slider;
    }

    function getStyle() {
        var styleDiv = document.createElement('div');
        styleDiv.id = 'tbl-slider-style';
        styleDiv.innerHTML = '<style>' +
            '.tbl-cards-slider {position: fixed; background: #f7f7f7; left: 25px; bottom: 45px; width: 525px; height: 130px; overflow: hidden; border-radius: 10px; border: 1px solid rgb(203, 203, 203); box-shadow: 2px 2px 1px 1px rgba(144, 144, 144, 0.7); }' +
            '.tbl-cards-slider ul {margin: 0; padding: 0;}' +
            '.tbl-cards-slider .item {list-style: none;}' +
            '.tbl-cards-slider .img {display: inline-block; width: 160px; height: 130px; background-size: cover; vertical-align: top}' +
            '.tbl-cards-slider .content-container {display: inline-block; width: 275px; height: 100%; padding: 35px 10px; vertical-align: top}' +
            '.tbl-cards-slider .header {font-weight: bold; font-size: 16px;}' +
            '.tbl-cards-slider .content {width: 260px; font-size: 14px; overflow: hidden; position: relative; line-height: 1.2em; max-height: 2.4em; text-align: justify; margin-right: -1em; padding-right: 1em;}' +
            '.tbl-cards-slider .content:before {content: "..."; position: absolute; bottom: 0; right: 0;}' +
            '.tbl-cards-slider .content:after {content: ""; position: absolute; right: 0; width: 1em; height: 1em; margin-top: 0.2em; background: #f7f7f7;}' +
            '.tbl-cards-slider .arrow {float: right;}' +
        '</style>';

        return styleDiv;
    }

    var cardsData = getCardsData();
    var style = getStyle();
    var slider = createSlider(cardsData);

    document.body.appendChild(style);
    document.body.appendChild(slider);
}

setTimeout(function(){
    transitionBanner();
}, 3000);


