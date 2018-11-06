import {html, PolymerElement} from '/lib/@polymer/polymer/polymer-element.js';


/*
# critter-insert

A Simple Button

## Example
```html
<critter-insert>text</critter-insert>
```

@demo
*/

class CritterInput extends PolymerElement {
    static get template() {
        return html`
            <style>
                #input *{
                    height: 30px;
                }
        
                #input span{
                    cursor: default;
                    text-align: center;
                    justify-content: center;
                    align-items: center;
                }
        
                #input input{
                    margin-left: 10px;
                    padding: 0 5px;
                    font-size: 1em;
                    background-color: transparent;
                    border: none;
                    border-bottom: 2px solid #039BE5;
                }
        
                #input input:focus{
                    border: none;
                    border-bottom: 2px solid #039BE5;
                    outline: none;
                }
        
                #input input:invalid{
                    border: none;
                    border-bottom: 2px solid #e5424a;
                    outline: none;
                }
            </style>
             <div id="input">
                 <span>[[label]]</span>
                 <input id="field" type="text" value="{{value::input}}" placeholder$="{{placeholder}}">
             </div>
        `;
    }

    static get is() {
        return 'critter-input';
    }

    static get properties() {
        return {
            value: {
                type: String,
                observer: "_onValueChange",
                notify: true
            },

            placeholder: {
                type: String
            },

            label: {
                type: String
            },

            valid: {
                type: Boolean,
                value: true,
                observer: "_onValidChange"
            }
        }
    }

    _onValueChange() {
        this.dispatchEvent(new CustomEvent('valueChanged', {
            detail: {name: this.value},
            bubbles: true,
            composed: true
        }));
    }

    _onValidChange() {
        this.$.field.setCustomValidity(this.valid ? "" : "name already exists");
    }
}

window.customElements.define(CritterInput.is, CritterInput);