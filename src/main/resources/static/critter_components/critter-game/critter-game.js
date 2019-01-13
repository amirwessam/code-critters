import {html, PolymerElement} from '/lib/@polymer/polymer/polymer-element.js';
import { afterNextRender } from '/lib/@polymer/polymer/lib/utils/render-status.js';
import {Level} from '../critter-level-mixin/critter-level-mixin.js';
import '../critter-level-selector/critter-level-selector.js';
import '../critter-data-store/critter-data-store.js';
import '../critter-gameboard/critter-board.js';
import '../critter-critter/critter-critter.js';
import '../critter-button/critter-button.js';
import '../critter-control-button/critter-control-button.js';
import '../critter-blockly/critter-blockly.js';
import '../critter-dialog/critter-dialog.js';
import '../critter-test-popup/critter-test-popup.js';
import '../critter-timeout/critter-timeout-manager.js';
import '../critter-score/critter-score.js';
import '../critter-header/critter-header.js';


import '/lib/@polymer/iron-icons/iron-icons.js';


/*
# critter game

Displays the game elements

## Example
```html
<critter-game level="[Array with texture code]"></critter-game>
```

@demo

*/

window.Core = window.Core || {};
window.Core.GameRoot = window.Core.GameRoot || [];

class CritterGame extends Level(PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }

            #critter_container {
                position: absolute;
                top: -1px;
                left: 21px;
                pointer-events: none;
            }

            #critter_container critter-critter {
                pointer-events: all;
            }

            .full_blockly{
                width: 95%;
                margin-right: 5%;
                float: left;
            }

            #board_container,
            #blockly_container {
                float: left;
                position: relative;
            }

            #blockly_container {
                margin-left: 10px;
            }


            #send_button,
            #speedUp_button,
            #coordinate_container{
                margin-left: 20px;
                float: left;
            }
            
            #reload_button{
            margin-left: 100px;
                float: left;
            }

            #coordinate_container{
                min-height: 40px;
                left: 230px;
                position: relative;
                align-items: center;
                display: flex;
                width: 165px;
            }
            #killed_container{
                float: left;
                min-height: 40px;
                margin-left: 50px;
                align-items: center;
                display: flex;
            }
            #finished_container{
                float: left;
                min-height: 40px;
                margin-left: 260px;
                align-items: center;
                display: flex;
                clear: both;
            }

            #send_button {
                clear: both;
            }


            #blockly_CUT {
                margin-bottom: 5px;
            }

            #star_container{
                color: gold;
                width: 100%;
                height: 50px;
                text-align: center;
            }
            #star_container iron-icon{
                width: 50px;
                height: 50px;
            }

            #dialog_text{
                margin-top: 40px;
                font-size: 1.5em;
                text-align: center;
            }

            #selector_container{
                margin-top: 60px;
                text-align: center;
            }

            #selector_container critter-level-selector{
                --margin-selector-button: auto;
            }
            
            critter-button {
                min-width: 100px;
                min-height: 40px;
            }
            
            critter-store {
                font-size: 0.85em;
            }

        </style>

        <critter-data-store></critter-data-store>
        <critter-timeout-manager></critter-timeout-manager>


        <critter-dialog id="score_dialog">
            <div id="star_container">
                <iron-icon id="star" icon="icons:star"></iron-icon>
            </div>
            <div id="dialog_text">
                <critter-score id="dialog_score"></critter-score>
            </div>
            <div id="selector_container">
                <h3>Select the next level:</h3>
                <critter-level-selector></critter-level-selector>
            </div>
        </critter-dialog>
        <critter-header></critter-header>

        <div id="board_container">
            <critter-gameboard id="gameboard" show-grid="{{showGrid}}">
            </critter-gameboard>
            <div id="critter_container" style$="width: {{ _boardWidth }}px; height:{{ _boardHeight }}px">
            </div>
            <critter-test-popup id="mine_popup" block-size="{{_blockSize}}" board-height="{{ _boardHeight }}" popup-height="{{ _popupHeight}}">
            </critter-test-popup>
        </div>
        <div id="blockly_container" style$="width: calc(-{{ _boardWidth }}px - 70px + 100vw)">
            <critter-blockly id="blockly_CUT" class="full_blockly" height$="{{ _boardHeight}}" controls="true" cut
                             read-only>
                <span>Code under Test</span>
            </critter-blockly>
        </div>
        <br>
        <critter-control-button id="send_button" class="game_button" shape="play"></critter-control-button>
        <critter-control-button id="speedUp_button" class="game_button" shape="fastforward" disabled></critter-control-button>
        <critter-control-button id="reload_button" class="game_button" shape="reload"></critter-control-button>
        <div id="coordinate_container">Coordinates: (X: {{_hoverX}}, Y: {{_hoverY}})</div>
        <div id="finished_container">{{_finishedHumans}} of&nbsp;<span id="humansNumber"></span>&nbsp;humans has finished</div>
        <div id="killed_container">{{_killedCritters}} of&nbsp;<span id="critterNumber"></span> &nbsp;critters has been detected</div>
        `;
    }

    static get is() {
        return 'critter-game';
    }

    static get properties() {
        return {
            showGrid: {
                type: Boolean,
                value: true
            },

            _boardHeight: {
                type: Number,
                computed: '_computeBoardHeight(_globalData.height, _blockSize)'
            },

            _boardWidth: {
                type: Number,
                computed: '_computeBoardWidth(_globalData.width, _blockSize)'
            },

            _popupHeight: {
                type: Number,
                computed: '_compoutePopupHeight(_globalData.height, _blockSize)'
            },

            _blockSize: {
                type: Number,
                value: 40
            },

            _critterList: {
                type: Array,
                value: []
            },

            _interval: {
                type: Number,
                value: 2000
            },

            _hoverX: {
                type: Number
            },

            _hoverY: {
                type: Number
            },

            _crittersSent: {
                type: Boolean,
                value: false
            },

            score: {
                type: Number,
                value: 0
            },

            _killedCritters: {
                type: Number,
                value: 0
            },

            _finishedHumans: {
                type: Number,
                value: 0
            },

            _doneCritters: {
                type: Number,
                value: 0
            },

            _paused: {
                type: Boolean,
                value: true
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();

        window.Core.GameRoot = this;
        window.Core.Generator = false;


        this._globalData = window.Core.CritterLevelData;
        this._timeoutManager = window.Core.timeouts;

        afterNextRender(this, function () {
            this.$.send_button.addEventListener("click", () => this._startCritters(this));
            this.$.speedUp_button.addEventListener("click", () => this._speedUpGame(this));
            this.$.reload_button.addEventListener("click", () => this._reloadGame(this));
            this.addEventListener("hoverOver", (event) => this._handleHoverField(event));
            this.addEventListener("fieldClicked", (event) => this._onFieldClicked(event));

            this.addEventListener("_levelFinished", () => this._onLevelFinished());
            this.addEventListener("_critterKilled", (event) => this._onCritterKilled(event));
            this.addEventListener("_critterFinished", (event) => this._onCritterFinished(event));
            this.addEventListener("_critterNumberChanged", (event) => this._onCritterNumberChanged(event));

            this._globalData.levelName = new URL(window.location.href).searchParams.get("level");
        });
    }

    _speedUpGame() {
        if(this._crittersSent) {
            this._critterList.forEach((critter) => {
                critter.speedy = true;
            });
            this._interval = 1500;
        }
        this.$.speedUp_button.disabled = true;
    }

    _reloadGame() {
        this._paused = true;
        this._crittersSent = false;
        this._finishedHumans = 0;
        this._doneCritters = 0;
        this._killedCritters = 0;
        this.score = 0;
        this._interval = 2000;
        this._critterList.forEach(critter => {
            critter.remove();
        });
        this._critterList = [];
        this._timeoutManager.clear();
        this._globalData.deleteMines();
        this.$.gameboard.removeAllMines();
        this.$.send_button.shape = "play";
        this.$.speedUp_button.disabled = true;
    }


    /** starts the critters**/
    _startCritters(node) {
        window.onbeforeunload = function() {
            return true;
        };

        if (this._paused) {
            this._paused = false;
            this.$.send_button.shape = "pause";
            if(!this._crittersSent) {
                this._addHumans();
                this._addCritters();
                this._sendCritters();
                this._crittersSent = true;
                this.$.speedUp_button.disabled = false;
            } else {
                this._timeoutManager.resumeAll();
                this._critterList.forEach(critter => {
                    critter.resume();
                });
            }
        } else {
            this._timeoutManager.pauseAll();
            this._critterList.forEach(critter => {
                critter.pause();
            });
            this.$.send_button.shape = "play";
            this._paused = true;
        }
    }

    /** sends one critter after another**/
    _sendCritters(i = 0) {
        if (!i && this._critterList.length !== this._globalData.numberOfHumans + this._globalData.numberOfCritters) {
            this._timeoutManager.add(() => {
                this._sendCritters(0);
            }, 100);
            return;
        }
        if (i < this._critterList.length) {
            this._critterList[i].startAnimation();
            this._timeoutManager.add(() => {
                this._sendCritters(++i);
            }, this._randomNumber(this._interval * 0.6, this._interval));
        }
    }

    /** creates and append humans**/
    _addHumans() {
        let i = 0;
        while (i++ < this._globalData.numberOfHumans) {
            this._createCritter(true, this._globalData.cut, this._globalData.init);
        }
    }

    _createCritter(human, cut, init) {
        let container = this.$.critter_container;
        let critter = document.createElement("critter-critter");
        critter.human = human;
        critter.cut = cut;
        critter.init = init;
        container.append(critter);
        this._critterList.push(critter);
    }

    _addCritters() {
        let req = document.createElement('iron-ajax');
        req.url = "/level/mutants";
        req.method = "GET";
        req.handleAs = 'json';
        req.contentType = 'application/json';
        req.bubbles = true;
        req.rejectWithRequest = true;
        req.params = {level: this._globalData.levelName};

        req.addEventListener('response', e => {
            let mutants = e.detail.__data.response;
            for (let i = 0; i < this._globalData.numberOfCritters; i++) {
                this._createCritter(false, new Function (mutants[i % (mutants.length)].code), new Function (mutants[i % (mutants.length)].init));
            }
            this._critterList = this._shuffleArray(this._critterList);

        });

        let genRequest = req.generateRequest();
        req.completes = genRequest.completes;
        return req;
    }

    /** computes the heights of critter-container**/
    _computeBlocklyHeight(height, size) {
        return height * 0.5 * size - 5;
    }

    /** computes the heights of critter-board**/
    _computeBoardHeight(height, size) {
        return height * size;
    }

    /** computes the width of critter-board**/
    _computeBoardWidth(width, size) {
        return width * size;
    }

    _compoutePopupHeight(height, size){
        return ((height * 0.5) * size) - 29;
    }

    /** handels the hover event and displays the coordinates **/
    _handleHoverField(event) {
        let detail = event.detail;
        this._hoverX = detail.x + 1;
        this._hoverY = this._globalData.width - detail.y;
    }

    /** handels the clickField event and creates the element **/
    _onFieldClicked(event) {
        let detail = event.detail;
        this.$.mine_popup.show(detail);
    }

    _updateScore(x) {
        this.score += x;
    }

    _onCritterKilled(e) {
        // this._updateScore(e.detail.human ? -100 : 50);
        if (!e.detail.human) {
            this._killedCritters++;
        }
        this._onCritterDone()
    }

    _onCritterFinished(e) {
        // this._updateScore(e.detail.human ? 50 : -100);
        if (e.detail.human) {
            this._finishedHumans++;
        }
        this._onCritterDone()
    }

    _onCritterDone() {
        this._doneCritters++;
        if (this._doneCritters === this._critterList.length) {
            this.dispatchEvent(new CustomEvent('_levelFinished', {detail: {}, bubbles: true, composed: true}));
        }
    }

    _onLevelFinished() {
        // this.score -= 25 * (this._globalData.countMines());
        // this.score = (this.score < 0 ? 0 : this.score);
        this.$.score_dialog.open();
        this.showScore();
        window.onbeforeunload = null;
        this._storeResult();
    }

    showScore() {
        let dialogScore = this.$.dialog_score;
        let finishedHumansPercentage = Math.round((this._finishedHumans / this._globalData.numberOfHumans) * 100);
        let killedHumansPercentage = 100 - finishedHumansPercentage;
        let killedCritterPercentage = Math.round((this._killedCritters / this._globalData.numberOfCritters) * 100);
        let finishedCritterPercentage = 100 - killedCritterPercentage;
        let finishedCritters = this._globalData.numberOfCritters - this._killedCritters;
        let killedHumans = this._globalData.numberOfHumans - this._finishedHumans;
        dialogScore.insertData("finished_humans_line", this._finishedHumans * 50, finishedHumansPercentage, "%").then(() => {
            dialogScore.insertData("killed_humans_line", killedHumans * -100, killedHumansPercentage, "%").then(() => {
                dialogScore.insertData("killed_critters_line", this._killedCritters * 50, killedCritterPercentage, "%").then(() => {
                    dialogScore.insertData("finished_critters_line", finishedCritters * -100, finishedCritterPercentage, "%").then(() => {
                        dialogScore.insertData("mines_line", -25 * (this._globalData.countMines()), this._globalData.countMines()).then(() => {
                            dialogScore.insertData("time_line", 0, 0);
                        })
                    })
                })
            })
        })

    }

    _onCritterNumberChanged() {
        this.$.critterNumber.innerHTML = this._globalData.numberOfCritters;
        this.$.humansNumber.innerHTML = this._globalData.numberOfHumans;
    }

    _storeResult() {

        //Function disabled
        return;

        this._globalData.mines.forEach((mine) => {
            mine.code = mine.code.toString();
        });
        let req = document.createElement('iron-ajax');
        req.url = "/result";
        req.method = "POST";
        req.handleAs = 'json';
        req.contentType = 'application/json';
        req.bubbles = true;
        req.rejectWithRequest = true;
        req.body = {
            level: this._globalData.levelName,
            mines: this._globalData.mines,
            score: this._globalData.score,
            cookie: this.getCookie()
        };

        let genRequest = req.generateRequest();
        req.completes = genRequest.completes;
        return req;
    }

    setCookie(name, value) {
        document.cookie = name + "=" + value + ";" + ";path=/";
    }

    getCookie() {
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf('id') == 0) {
                return c.substring(3, c.length);
            }
        }
        let cookie = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        this.setCookie('id', cookie);
        return cookie;
    }
}

window.customElements.define(CritterGame.is, CritterGame);

