import {html, PolymerElement} from '/lib/@polymer/polymer/polymer-element.js';
import '/lib/@polymer/iron-icons/iron-icons.js';

/*
# critter-insert

A Simple Button

## Example
```html
<critter-toaster></critter-toaster>
```

@demo
*/
window.Core = window.Core || {};
window.Core.toasts = window.Core.toasts || [];

class CritterToaster extends PolymerElement {
    static get template() {
        return html`
            <style>
    
                #toaster {
                    border: 1px solid grey;
                    position: fixed;
                    right: 40px;
                    top: -45px;
                    transition: 500ms;
                }
    
                #toaster * {
                    float: left;
                }
    
                iron-icon {
                    height: 30px;
                    width: 30px;
                }
    
                #icon {
                    height: 40px;
                    width: 40px;
                    text-align: center;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    background-color: white;
                }
    
                #msg {
                    height: 30px;
                    cursor: default;
                    text-align: center;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    padding: 5px 10px;
                    background-color: ghostwhite;
                }
    
                #info {
                    color: #039BE5
                }
    
                #error {
                    color: #e5424a
                }
    
                #success {
                    color: #7ae561
                }
    
            </style>
            <div id="toaster">
                <div id="icon">
                    <iron-icon id="error" icon="icons:cancel"></iron-icon>
                    <iron-icon id="info" icon="icons:error"></iron-icon>
                    <iron-icon id="success" icon="icons:check-circle"></iron-icon>
                </div>
                <div id="msg">[[msg]]</div>
            </div>
        `;
    }

    static get is() {
        return 'critter-toaster';
    }

    static get properties() {
        return {
            msg: {
                type: String
            },

            type: {
                type: String,
                value: '',
                observer: '_typeChanged'
            },

            _top: {
                type: Number
            }
        }
    }

    _typeChanged() {
        if (this.type === 'error') {
            this.$.success.style.display = "none";
            this.$.error.style.display = "block";
            this.$.info.style.display = "none";
        } else if (this.type === 'success') {
            this.$.success.style.display = "block";
            this.$.error.style.display = "none";
            this.$.info.style.display = "none";
        } else {
            this.$.success.style.display = "none";
            this.$.error.style.display = "none";
            this.$.info.style.display = "block";
        }
    }

    show(timeout) {
        window.Core.toasts.forEach((toaster) => {
            toaster.lower();
        });
        window.Core.toasts.push(this);
        setTimeout(() => {
            this.$.toaster.style.top = "20px";
        }, 100);
        this._top = 20;
        setTimeout(() => {
            var index = window.Core.toasts.indexOf(this);
            if (index > -1) {
                window.Core.toasts.splice(index, 1);
            }
            this.$.toaster.style.display = "none";
            setTimeout(() => {
                this.getRootNode().removeChild(this);
            }, 1000);
        }, timeout);
    }

    lower() {
        this._top += 45;
        this.$.toaster.style.top = this._top + "px";
    }
}

window.customElements.define(CritterToaster.is, CritterToaster);
