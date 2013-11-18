var snap = snap || {};

snap.Player = function (name, $container) {
    this.name = name;
    this.hand = [];
    this.isInTurn = false;
    this.$container = $container;
    this.bgColor = $container.css('backgroundColor');
    this.$msg = $("<div style='position:absolute;z-index:100;top:378px'></div>");
};

snap.Player.prototype = {
    turnCard: function () {
        if (this.hand.length > 0) {
            this.$container.css({ background: this.bgColor });
            return this.hand.pop();
        } else {
            return null;
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
        this.hand = [];
    },
    callSnap: function () {
        this.drawPlayer();
        this.drawSnap();
    },
    takeCard: function (card) {

        this.hand.push(card);
        card.draw({
            $deckContainer: this.$container,
            pos: this.position,
            delay: 300
        });

        this.position.left += 1;
    },
    takeCards: function (cards) {
        for (var c in cards) {
            cards[c].close();
        }
        cards = cards.concat(this.hand);
        this.resetPos();
        for (var i = 0; i < cards.length; i++) {
            this.takeCard(cards[i]);
        }
        this.hand = cards;
    },
    handCount: function () {
        return this.hand.length;
    },
    drawPlayer: function () {
        console.log(this.name);
    },
    drawSnap: function (snap) {
        if (snap) {
            this.showMsg('you SNAPed it :)', 3000);
        } else {
            this.showMsg('don\'t cheat!', 1000);
        }
    },
    drawLoose: function () {
        this.showMsg('you lost!', 3000);
    },
    drawWin: function () {
        this.showMsg('you won!', 3000);
    },
    drawEven: function () {
        this.showMsg('game is even!', 3000);
    },
    drawHand: function () {
        console.log('hand: ' + this.hand.length);
    },
    clearHand: function () {
        this.hand = [];
    },
    play: function () {
        this.isInTurn = true;
        this.$container.css({ background: "yellow" });
        this.showMsg('it\'s your turn!');
    },
    notYourTurn: function () {
        var self = this;
        self.$container.css({ background: "red" });
        self.$msg.text('It\'s not your turn!');
        self.$container.append(this.$msg);
        window.setTimeout(function () {
            self.$msg.remove();
            self.$container.css({ background: self.bgColor });
        }, 1000);
    },
    showMsg: function (msg, dly) {
        var delay = dly || 1000;
        var self = this;
        self.$msg.text(self.name + ' ' + msg);
        self.$container.append(self.$msg);
        window.setTimeout(function () {
            self.$msg.remove();
        }, delay);
    }
};
