// Классы для игры
const Card = require('./Card.js');
const Game = require('./Game.js');

// Данные для колоды карт
const suitsOfCards = require('./cards/suits_of_cards');
const ratioOfCards = require('./cards/ratio_of_cards');

// Создаем перемешанную колоду
const deck = new Card(suitsOfCards, ratioOfCards);
const sortDeck = deck.deck();
const shuffleDeck = deck.shuffleDeck(sortDeck);

// Начинаем игру
const game = new Game(5, 2);
game.raffle(shuffleDeck)