var snap = snap || {};

snap.Card = function (rank, suit, $deckContainer) {
    this.rank = rank;
    this.suit = suit;
    this.$card = $('<div class="card"></div>');
    this.$card.css({
        top: -200,
        left: -200
    });
    this.$card.appendTo($deckContainer);
};

snap.Card.prototype = {
    draw: function (args) {
        this.$card.remove();
        this.$card.appendTo(args.$deckContainer);
        this.$card.animate({
            top: args.pos.top,
            left: args.pos.left
        }, args.delay);
    },
    open: function () {
        var card = this.$card;
        card.addClass('open');
        var s = this.suit;
        var c;
        switch (s) {
            case snap.SuitEnum.Spade:
                c = "spade";
                break;
            case snap.SuitEnum.Heart:
                c = "heart";
                break;
            case snap.SuitEnum.Club:
                c = "club";
                break;
            case snap.SuitEnum.Diamond:
                c = "diamond";
                break;
        }
        card.html('<h1>' + this.rank + '</h1><div class="' + c + '">&nbsp;</div>');

    },
    close: function () {
        this.$card.removeClass('open');
        this.$card.text("");
    },
    equals: function (card) {
        if (card) {
            return this.rank === card.rank;
        } else {
            return false;
        }
    }
};

