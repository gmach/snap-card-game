var snap = snap || {};

snap.GameEngine = function (deck, playerOne, playerTwo, $decksContainer, $aiReactionDelay) {
    this.deck = deck;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.$decksContainer = $decksContainer;

    this.firstPlayer = undefined;
    this.secondPlayer = undefined;
    this.aiReactionDelay = undefined;
    this.$aiReactionDelay = $aiReactionDelay;
    this.aiSnapTimeout;

    this.lastCard;
    this.newCard;
};

snap.GameEngine.prototype = {
    startNewGame: function (aiReactionDelay) {
        this.aiReactionDelay = aiReactionDelay;

        var cards = this.deck;
        var self = this;
        self.playerOne.resetPos();
        self.playerTwo.resetPos();
        self.deck.resetPos();
        cards.replenish();
        cards.shuffle();
        cards.draw(function () {
            if (Math.random() > 0.5) {
                self.firstPlayer = self.playerOne;
                self.secondPlayer = self.playerTwo;
            } else {
                self.secondPlayer = self.playerOne;
                self.firstPlayer = self.playerTwo;
            }

            var isFirtsPlayerTurn = true;
            var card = cards.dealCard();
            var i = 0;
            var player;            function delayTakeCard(i, card, player) {
                window.setTimeout(function () {
                    player.takeCard(card);
                    if (i === 51) {
                        self.play();
                    }
                }, i * 100);
            }

            while (card !== null) {
                if (isFirtsPlayerTurn) {
                    isFirtsPlayerTurn = false;
                    player = self.firstPlayer;
                } else {
                    isFirtsPlayerTurn = true;
                    player = self.secondPlayer;
                }

                i += 1;
                delayTakeCard(i, card, player);

                card = cards.dealCard();
            }
        });
       
    },
    play: function () {
        var isFirtsPlayerTurn = true;
        if (isFirtsPlayerTurn) {
            isFirtsPlayerTurn = false;
            this.firstPlayer.play();
            this.playerInTurn = this.firstPlayer;
        } else {
            isFirtsPlayerTurn = true;
            this.secondPlayer.play();
            this.playerInTurn = this.secondPlayer;
        }
    },
    snapCheck: function (player) {
        if (this.newCard === undefined || this.lastCard === undefined) {
            return;
        }
        if (this.newCard.equals(this.lastCard)) {
            this.newCard = undefined;
            this.lastCard = undefined;
            player.drawSnap(true);
            player.takeCards(this.deck.getDeck());
        } else {
            player.drawSnap(false);
        }
    },
    openCard: function (player) {
        window.clearTimeout(this.aiSnapTimeout);
        if (this.playerInTurn === player) {
            var card = player.turnCard();
            this.lastCard = this.newCard;
            this.newCard = card;
            this.deck.takeCard(card);
            if (player.handCount() === 0) {
                this.toggleTurnPlayer(player);
                if (this.playerInTurn.handCount() > 0) {
                    this.playerInTurn.drawWin();
                    this.toggleTurnPlayer(this.playerInTurn);
                    this.playerInTurn.drawLoose();
                } else {
                    this.playerInTurn.drawEven();
                    this.toggleTurnPlayer(this.playerInTurn);
                    this.playerInTurn.drawEven();
                }
                return;
            }

            var self = this;
            this.aiSnapTimeout = window.setTimeout(function () {
                if (self.newCard.equals(self.lastCard)) {
                    self.snapCheck(self.playerTwo);
                }
            }, this.$aiReactionDelay.val());

            this.toggleTurnPlayer(player);
            this.playerInTurn.play();
        } else {
            player.notYourTurn();
        }
    },
    toggleTurnPlayer: function (player) {
        if (this.firstPlayer === player) {
            this.playerInTurn = this.secondPlayer;
        } else {
            this.playerInTurn = this.firstPlayer;
        }
    }

};