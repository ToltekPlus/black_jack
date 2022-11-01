const readlineSync = require("readline-sync");

class Game {
    BLACK_JACK = 21;

    /**
     * Прибавляем крупье к игрокам
     *
     * @param countUsers
     * @param countCards
     */
    constructor(countUsers, countCards) {
        this.countUsers = countUsers + 1;
        this.countCards = countCards;
    }

    /**
     * Раздаем игрокам и крупье карты. Показываем игроку его карты
     *
     * @param deck
     */
    raffle(deck) {
        let cards = deck.splice(0, (this.countUsers) * this.countCards);
        const usersData = this.playersAtTheTable(new Array(this.countUsers), cards);

        this.myHand(usersData,  deck);
    }

    /**
     * Создаем игровой стол с раздаными картами
     *
     * @param usersData
     * @param cards
     * @returns {*}
     */
    playersAtTheTable(usersData, cards) {
        let createdUsersData = this.createUsersData(usersData);

        return this.distributionOfCards(createdUsersData, cards, 2);
    }

    /**
     * Показываем игроку его расклад
     *
     * Если количество карт меньше чем столько,
     * сколько нужно участникам - показываем результат игры
     *
     * @param usersData
     * @param deck
     */
    myHand(usersData, deck) {
        this.toOutput(this.cardsCalculate(usersData));

        if (deck.length % this.countUsers === 0)
            this.choiceAnAction(usersData, deck);
        else
            this.checkResult(usersData);
    }

    /**
     * Готовим карты игрока и считаем сумму
     *
     * @param usersData
     * @returns {{cards: string, sum: number}}
     */
    cardsCalculate(usersData) {
        // TODO декомпозировать
        // TODO сделать реализацию, при которой игрок уже совершил перебор
        let userData = usersData.filter(x => x.key === 0)[0];

        let hand = {
            cards: "",
            sum: 0
        };

        userData.map(x => {
            hand['cards'] += x.description +"\n";
        })
        hand['sum'] = userData.sum;
        hand['key'] = userData.key;

        let result = this.checkingTheGameConditionsForUser(hand);

        if (result) {
            return result;
        }
        else {
            this.checkResult(usersData);
        }
    }

    /**
     *
     * @param hand
     * @returns {boolean|*}
     */
    checkingTheGameConditionsForUser(hand) {
        if (hand.sum > this.BLACK_JACK) return false;

        return hand;
    }

    /**
     * Выводим результат
     * @param hand
     */
    toOutput(hand){
        console.log('Вот ваши карты:');
        console.log(hand.cards);

        console.log('Общая сумма:');
        console.log(hand.sum);
    }

    /**
     * Предлагаем выбор действия - подсчет результатов или еще по одной карте
     * @param usersData
     * @param deck
     */
    choiceAnAction(usersData, deck) {
        if (readlineSync.keyInYN('Here is the layout of your cards. Would you like another one?')) {
            let updatedUsersData = this.optionallyRaffle(usersData, deck);
            this.myHand(updatedUsersData, deck);
        } else {
            this.checkResult(usersData);
        }
    }

    /**
     * Раздаем еще по одной карте
     * @param usersData
     * @param deck
     * @returns {*}
     */
    optionallyRaffle(usersData, deck) {
        let cards = deck.splice(0, this.countUsers);

        return this.distributionOfCards(usersData, cards,1);
    }

    /**
     * Результат игры
     * @param data
     */
    checkResult (data) {
        const sortable = this.sortableResult(data);

        for (const value of sortable) {
            if (value.sum > this.BLACK_JACK) value.sum = '\x1b[31m' + value.sum + '\x1b[0m';
            if (value.sum === this.BLACK_JACK) value.sum = '\x1b[36m' + value.sum + '\x1b[0m';

            console.log(value.person + '\t' + ' => ' + value.sum + ' очков');
            for (const { description } of value) {
                console.log(description);
            }
            console.log('\n');
        }
    }

    /**
     * Сортируем результат по убыванию
     * @param data
     * @returns {*}
     */
    sortableResult(data) {
        return data.sort((a, b) => parseInt(b.sum) - parseInt(a.sum));
    }
}

/**
 * Создаем начальные данные для всех игроков
 * @param usersData
 * @returns {*}
 */
Game.prototype.createUsersData = (usersData) => {
    for (let i = 0; i <= usersData.length - 1; i++) {
        usersData[i] = [];
        usersData[i]['key'] = i;
        usersData[i]['person'] = 'Игрок номер ' + (i + 1);
        usersData[i]['sum'] = 0;
    }

    return usersData;
}

/**
 * Раздача карт игрокам
 * @param usersData
 * @param deck
 * @param countCards
 * @returns {*}
 */
Game.prototype.distributionOfCards = function (usersData, deck, countCards) {
    for (let i = 0; i <= this.countUsers - 1; i++) {
        let newCard = deck.splice(0, countCards)
        usersData[i].push(...newCard);
        usersData[i].sum += newCard[0].value;
    }

    return this.checkingTheGameConditions(usersData);
}

/**
 * Убираем участников, которые набирают больше 21
 * @param usersData
 * @returns {*}
 */
Game.prototype.checkingTheGameConditions = function(usersData) {
    return usersData.filter(x => x.sum <= this.BLACK_JACK);
}

module.exports = Game;