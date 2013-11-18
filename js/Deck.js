var snap = snap || {};

snap.Deck = function ($deck) {
    this.deck = [];
    this.$container = $deck;
};

snap.Deck.prototype = {
    shuffle: function () {
        var cards = this.deck;
        for (i = cards.length - 1; i >= 0; i--) {
            toSwap = Math.floor(Math.random() * i);
            tempCard = cards[i];
            cards[i] = cards[toSwap];
            cards[toSwap] = tempCard;
        }
    },
    resetPos: function () {
        var pos = this.$container.position();
        var left = Math.round(pos.left);
        var top = Math.round(pos.top);
        this.position = {
            top: top + 70,
            left: left + 40
        };
    },
    dealCard: function () {
        if (this.deck.length > 0) {
            //this.position.left -= 1;
            return this.deck.pop();
        } else {
            return null;
        }
    },
    replenish: function ($decksContainer) {
        $('.card').remove();
        var card;
        var cards = this.deck = [];

        for (var rank in snap.RankEnum) {
            for (var suit in snap.SuitEnum) {
                card = new snap.Card(snap.RankEnum[rank], snap.SuitEnum[suit], $decksContainer);
                cards.push(card);
            }
        }
    },
    draw: function (callback) {
        var $decksContainer = this.$container;
        var cards = this.deck;
        var top = this.position.top;
        var left = this.position.left;

        function delayDraw(card, left, top, i) {
            window.setTimeout(function () {
                card.draw({
                    $deckContainer: $decksContainer,
                    pos: { left: left, top: top },
                    delay: 300
                });
                if (i === 51) {
                    callback();
                }
            }, i * 30);
        }

        for (var k = 0; k < cards.length; k++) {
            delayDraw(cards[k], left, top, k + 1);
            left += 1;
        }
    },
    takeCard: function (card) {
        this.deck.push(card);
        card.open();
        card.draw({
            $deckContainer: this.$container,
            pos: this.position,
            delay: 300
        });

        this.position.left += 1;
    },
    getDeck: function () {
        var deck = this.deck;
        var d = [];
        this.deck = d;

        return deck;
    }
};