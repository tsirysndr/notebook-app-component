"use strict";
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class HijackScroll extends React.Component {
    constructor() {
        super(...arguments);
        this.el = null;
    }
    scrollIntoViewIfNeeded(prevFocused) {
        // Check if the element is being hovered over.
        const hovered = this.el &&
            this.el.parentElement &&
            this.el.parentElement.querySelector(":hover") === this.el;
        if (this.props.focused &&
            prevFocused !== this.props.focused &&
            // Don't scroll into view if already hovered over, this prevents
            // accidentally selecting text within the codemirror area
            !hovered) {
            if (this.el && "scrollIntoViewIfNeeded" in this.el) {
                // This is only valid in Chrome, WebKit
                this.el.scrollIntoViewIfNeeded();
            }
            else if (this.el) {
                // Make a best guess effort for older platforms
                this.el.scrollIntoView();
            }
        }
    }
    componentDidUpdate(prevProps) {
        this.scrollIntoViewIfNeeded(prevProps.focused);
    }
    componentDidMount() {
        this.scrollIntoViewIfNeeded();
    }
    render() {
        return (React.createElement("div", { onClick: this.props.onClick, role: "presentation", ref: el => {
                this.el = el;
            } }, this.props.children));
    }
}
exports.HijackScroll = HijackScroll;
