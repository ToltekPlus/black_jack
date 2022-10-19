// TODO исправить ошибку связанную с большим количеством игроков
// TODO исправить ошибку добавления новых карт
let readlineSync = require('readline-sync');
const BLACK_JACK = 21;

/**
 * Формируем колоду карт
 *
 * @param suitsOfCards
 * @param ratioOfCards
 * @returns {*[]}
 */
const deck = (suitsOfCards, ratioOfCards) => {
    let deck = [];

    for (const [keyRatio, valueRation] of ratioOfCards) {
        for (const [keySuit, valueSuit] of suitsOfCards) {
            let card = {};
            card['description'] = valueSuit + ' ' + valueRation + ' ' + keySuit;
            card['value'] = keyRatio;
            deck.push(card);
        }
    }

    return deck;
}

/**
 * Сортируем колоду карт
 *
 * @param deck
 * @returns {*}
 */
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

/**
 * Делаем бервую раздачу карт и показываем игроку его карты
 * Прибавляем еденицу к countUsers, т.к. в игре учавствует крупье
 *
 * @param countUsers
 * @param countCards
 * @param deck
 */
const raffle = (countUsers, countCards, deck) => {
    let cards = deck.splice(0, (countUsers + 1) * countCards);
    const usersData = playersAtTheTable(new Array(countUsers + 1), cards);

    myHand(usersData, countUsers + 1, deck);
}

/**
 * Создаем массив с картами и суммой этих карт
 *
 * @param usersData
 * @param cards
 * @returns {*}
 */
const playersAtTheTable = (usersData, cards) => {
    for (let i = 0; i <= cards.length + 1; i++) {
        usersData[i] = cards.splice(0, 2);
        usersData[i]['person'] = 'Игрок номер ' + parseInt(i + 1);
        usersData[i]['sum'] = usersData[i].reduce((acc, value) => {
            return acc.value + value.value;
        })
    }

    return usersData;
}

/**
 * Дополнительно раскидываем по карте
 *
 * @param usersData
 * @param countCards
 * @param deck
 * @returns {*}
 */
const optionallyRaffle = (usersData, countCards, deck) => {
    let cards = deck.splice(0, countCards);
    for (let i = 0; i <= cards.length; i++) {
        let newCard = cards.splice(0, 1)
        usersData[i].push(...newCard);
        usersData[i].sum += newCard[0].value;
    }
    usersData[usersData.length - 1].push(...cards);
    usersData[usersData.length - 1].sum += cards[0].value;

    return usersData;
}

/**
 * Выводим результат первой раздачи
 * Также предлаем игроку раздать еще по карте или вскрыться
 *
 * @param usersData
 * @param countUsers
 * @param deck
 */
const myHand = (usersData, countUsers, deck) => {
    let hand = { cards: "", sum: 0 };

    usersData[0].map(x => {
        hand['cards'] += x.description +"\n";
    })
    hand['sum'] = usersData[0].sum;

    toOutput(hand);

    if (readlineSync.keyInYN('Here is the layout of your cards. Would you like another one?')) {
        optionallyRaffle(usersData, countUsers, deck);
        myHand(usersData, countUsers, deck);
    } else {
        checkResult(usersData);
    }
}

/**
 * Выводим раскладку своих карт
 *
 * @param hand
 */
const toOutput = (hand) => {
    console.log('Вот ваши карты:');
    console.log(hand.cards);

    console.log('Общая сумма:');
    console.log(hand.sum);
}

/**
 * Показываем результат. Но сперва сортируем игроков по счету
 *
 * @param data
 */
const checkResult = (data) => {
    const sortable = data.sort((a, b) => parseInt(b.sum) - parseInt(a.sum));

    for (const value of sortable) {
        if (value.sum > BLACK_JACK) value.sum = '\x1b[31m' + value.sum + '\x1b[0m';
        if (value.sum === BLACK_JACK) value.sum = '\x1b[36m' + value.sum + '\x1b[0m';

        console.log(value.person + '\t' + ' => ' + value.sum + ' очков');
        for (const { description } of value) {
            console.log(description);
        }
        console.log('\n');
    }
}

/**
 * Запускаем игру
 *
 * @param countUsers
 * @param raffle
 * @returns {(function(*): void)|*}
 */
const black_jack = (countUsers, raffle) => (deck) => {
    raffle(countUsers, 2, deck);
}

/**
 * Масти карт
 *
 * @type {Map<any, any>}
 */
const suitsOfCards = new Map();
suitsOfCards.set('♠', 'Пики');
suitsOfCards.set('♣', 'Трефы');
suitsOfCards.set('♥', 'Червы');
suitsOfCards.set('♦', 'Бубны');

/**
 * Стоимость карт
 *
 * @type {Map<any, any>}
 */
const ratioOfCards = new Map();
ratioOfCards.set(2, 'Валет');
ratioOfCards.set(3, 'Дама');
ratioOfCards.set(4, 'Король');
ratioOfCards.set(11, 'Туз');
ratioOfCards.set(10, 'Десять');
ratioOfCards.set(9, 'Девять');
ratioOfCards.set(8, 'Восемь');
ratioOfCards.set(7, 'Семь');
ratioOfCards.set(6, 'Шесть');

const sortDeck = shuffleDeck(deck(suitsOfCards, ratioOfCards));
black_jack(2, raffle)(sortDeck);