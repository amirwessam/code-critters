import {html, PolymerElement} from '/lib/@polymer/polymer/polymer-element.js';
import { afterNextRender } from '/lib/@polymer/polymer/lib/utils/render-status.js';
import '../critter-button/critter-button.js';
import '../critter-selector/critter-selector.js';

import '/lib/@polymer/iron-ajax/iron-ajax.js';

/*
# critter-insert

A Simple Button

## Example
```html
<critter-level-selector></critter-level-selector>
```

@demo
*/

class CritterLevelSelector extends PolymerElement {
    static get template() {
        return html`
            <style>
                #load_button{
                    margin: var( --margin-selector-button);
                }
            </style>
            <critter-selector values="{{levels}}" selected-value="{{selectedLevel}}"></critter-selector>
            <br>
            <critter-button id="load_button">Load Level</critter-button>
    `;
    }

    static get is() {
        return 'critter-level-selector';
    }

    static get properties() {
        return {
            levels: {
                type: []
            },

            selectedLevel: {
                type: String,
                value: ""
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();

        afterNextRender(this, function () {
            this.$.load_button.addEventListener("click", this._loadLevel.bind(this));
            this._initNames();
        });
    }

    /** gets all existing level names **/
    _initNames() {
        let req = document.createElement('iron-ajax');
        req.url = "/generator/names";
        req.method = "GET";
        req.handleAs = 'json';
        req.contentType = 'application/json';
        req.bubbles = true;
        req.rejectWithRequest = true;

        req.addEventListener('response', e => {
            this.levels = e.detail.__data.response;
        });

        let genRequest = req.generateRequest();
        req.completes = genRequest.completes;
        return req;
    }

    _loadLevel() {
        window.location.href = "/game?level=" + this.selectedLevel;
    }
}

window.customElements.define(CritterLevelSelector.is, CritterLevelSelector);
