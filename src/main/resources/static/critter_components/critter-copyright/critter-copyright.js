/*-
 * #%L
 * Code Critters
 * %%
 * Copyright (C) 2019 Michael Gruber
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import {html, PolymerElement} from '/lib/@polymer/polymer/polymer-element.js';
import {afterNextRender} from '/lib/@polymer/polymer/lib/utils/render-status.js';
import {critterStyle} from '/style/critter-botstrap.js';
import {I18n} from '../critter-i18n/critter-i18n-mixin.js';

/*
# critter-copyright

Copyright notice for Code Critters

## Example
```html
<critter-copyright></critter-copyright>
```

@demo
*/

class CritterCopyright extends I18n(PolymerElement) {
    static get template() {
        return html`
            <style>
                h6 {
                    color: #ffa600;
                }
                
                .row {
                    text-align: center;
                }
            </style>
            
            ${critterStyle}
            
            <div class="row">
                <div class="col-sm-12">
                    <p>Copyright &copy; 2020 Code Critters<br>
                    Universität Passau, Innstraße 33, 94032 Passau<br>
                    Lehrstuhl für Software Engineering II, Prof.Dr. Gordon Fraser<br>
                    E-Mail: ?????</p>
                    <p>
                        <a href="https://www.uni-passau.de/impressum/" style="text-decoration: none; color: #ffa600; margin: 2em;" target="_blank">[[__('legal')]]</a>
                        <a href="https://www.uni-passau.de/datenschutzerklaerung/" style="text-decoration: none; color: #ffa600; margin: 2em;" target="_blank">[[__('privacy')]]</a>
                    </p>
                </div>
            </div>
        `
    }

    static get is() {
        return 'critter-copyright';
    }
}

window.customElements.define(CritterCopyright.is, CritterCopyright);