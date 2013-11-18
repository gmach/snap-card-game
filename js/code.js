$(document).ready(function () {

    $player = $('#player');
    var player = new snap.Player('Player', $player);

    $ai = $('#ai');
    var ai = new snap.Player('Computer', $ai);
    ai.play = function () {
        var self = this;
        self.isInTurn = true;
        self.$container.css({ background: "yellow" });
        self.$msg.text(self.name + ' it\'s your turn!');
        self.$container.append(self.$msg);
        window.setTimeout(function () {
            self.$msg.remove();
            gameEngine.openCard(self);
        }, $('#aiCardOpen').val());
    };

    $deck = $('#deck');
  
    var deck = new snap.Deck($deck);

    var $aiReactionDelay = $('#aiDelay');
    setDelayText();
    $aiReactionDelay.change(setDelayText);


    var $aiCardOpenDelay = $('#aiCardOpen');
    setCardOpenDelayText();
    $aiCardOpenDelay.change(setCardOpenDelayText);

    var $deckscontainer = $('#deckscontainer');
    var gameEngine = new snap.GameEngine(deck, player, ai, $deck, $aiReactionDelay);
    startGame();
    $('#startNewGame').click(startGame);
    $deck.click(function () {
        gameEngine.snapCheck(player);
    });
    $player.click(function () {
        gameEngine.openCard(player);
    });

    function startGame() {
        var val = $aiReactionDelay.val();
        gameEngine.startNewGame(val);
    }

    function setDelayText() {
        var val = $aiReactionDelay.val();
        $aiReactionDelay.next().text(val + " ms.");
    }

    function setCardOpenDelayText() {
        var val = $aiCardOpenDelay.val();
        $aiCardOpenDelay.next().text(val + " ms.");
    }

});
