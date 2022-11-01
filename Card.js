class Card {
    /**
     * @param suitsOfCards
     * @param ratioOfCards
     */
    constructor(suitsOfCards, ratioOfCards) {
        this.suitsOfCards = suitsOfCards;
        this.ratioOfCards = ratioOfCards;
    }

    /**
     * Создаем колоду карт
     * @returns {*[]}
     */
    deck() {
        let deck = [];

        for (const [keyRatio, valueRation] of this.ratioOfCards) {
            for (const [keySuit, valueSuit] of this.suitsOfCards) {
                let card = {};
                card['description'] = valueSuit + ' ' + valueRation + ' ' + keySuit;
                card['value'] = keyRatio;
                deck.push(card);
            }
        }

        return deck;
    }

    /**
     * Сортируем рандомно созданную колоду карт
     * @param deck
     * @returns {*}
     */
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        return deck;
    }
}

module.exports = Card;