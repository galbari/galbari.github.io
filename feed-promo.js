function transitionBanner() {
    if (TRCImpl) {
        executed = true;
    } else {
        return;
    }

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

    function getCardsData() {
        var allCards = TRCImpl.boxes;
        var organicCards = allCards.filter(function(card){return card.mode.indexOf('organic');});
        return organicCards.map(createOrganicCardObj);
    }

    var cardsData = getCardsData();
    console.log(cardsData);
}
var executed = false;
while (!executed) {
    transitionBanner();
}
