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

    function getItmesAsHtmlString(html, card) {
        return html + '<li class="item">' +
                        '<div class="img" style="background-image: url(' + card.img + ')"></div>' +
                        '<div class="header">Up next:</div>' +
                        '<div class="content">' + card.content + '</div>' +
                    '</li>';
    }

    function createSlider(cardsData) {
        var slider = document.createElement('div');
        var itemsContainer = document.createElement('ul');
        slider.setAttribute('id', 'tbl-slider');
        slider.appendChild(itemsContainer);
        var items = cardsData.reduce(function(html, card){
            return getItmesAsHtmlString(html, card);
        }, "");

        // var items = cardsData.reduce(function(html, card) {
        //     return html + '<li class="item">' +
        //                     '<div class="img" style="background-image: url(' + card.img + ')"></div>' +
        //                     '<div class="header">Up next:</div>' +
        //                     '<div class="content">' + card.content + '</div>' +
        //                 '</li>';
        // }, '');
        itemsContainer.innerHTML = items;
        console.log(slider);
    }

    var cardsData = getCardsData();
    createSlider(cardsData);
}

setTimeout(function(){
    transitionBanner();
}, 3000);


