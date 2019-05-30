"use strict";
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-tabindex: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_1 = __importDefault(require("@nteract/markdown"));
const presentational_components_1 = require("@nteract/presentational-components");
const react_1 = __importDefault(require("react"));
const noop = () => { };
// TODO: Consider whether this component is really something like two components:
//
//       * a behavioral component that tracks focus (possibly already covered elsewhere)
//       * the actual markdown previewer
//
//       Since I'm really unsure and don't want to write a silly abstraction that
//       only I (@rgbkrk) understand, I'll wait for others to reflect on this
//       within the code base (or leave it alone, which is totally cool too). :)
class MarkdownCell extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: true
        };
        this.openEditor = this.openEditor.bind(this);
        this.editorKeyDown = this.editorKeyDown.bind(this);
        this.renderedKeyDown = this.renderedKeyDown.bind(this);
        this.closeEditor = this.closeEditor.bind(this);
    }
    componentDidMount() {
        this.updateFocus();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            view: !nextProps.editorFocused
        });
    }
    componentDidUpdate() {
        this.updateFocus();
    }
    updateFocus() {
        if (this.rendered &&
            this.state &&
            this.state.view &&
            this.props.cellFocused) {
            this.rendered.focus();
            if (this.props.editorFocused) {
                this.openEditor();
            }
        }
    }
    /**
     * Handles when a keydown event occurs on the unrendered MD cell
     */
    editorKeyDown(e) {
        const shift = e.shiftKey;
        const ctrl = e.ctrlKey;
        if ((shift || ctrl) && e.key === "Enter") {
            this.closeEditor();
        }
    }
    closeEditor() {
        this.setState({ view: true });
        this.props.unfocusEditor();
    }
    openEditor() {
        this.setState({ view: false });
        this.props.focusEditor();
    }
    /**
     * Handles when a keydown event occurs on the rendered MD cell
     */
    renderedKeyDown(e) {
        const shift = e.shiftKey;
        const ctrl = e.ctrlKey;
        if ((shift || ctrl) && e.key === "Enter") {
            if (this.state.view) {
                return;
            }
            // This likely isn't even possible, as we _should_ be in view mode
            this.closeEditor();
            return;
        }
        switch (e.key) {
            case "Enter":
                this.openEditor();
                e.preventDefault();
                return;
            case "ArrowUp":
                this.props.focusAbove();
                break;
            case "ArrowDown":
                this.props.focusBelow();
                break;
            default:
        }
        return;
    }
    render() {
        const source = this.props.source;
        return this.state && this.state.view ? (react_1.default.createElement("div", { onDoubleClick: this.openEditor, onKeyDown: this.renderedKeyDown, ref: rendered => {
                this.rendered = rendered;
            }, tabIndex: this.props.cellFocused ? 0 : undefined, style: {
                outline: "none"
            } },
            react_1.default.createElement(presentational_components_1.Outputs, null,
                react_1.default.createElement(markdown_1.default, { source: source
                        ? source
                        : "*Empty markdown cell, double click me to add content.*" })))) : (react_1.default.createElement("div", { onKeyDown: this.editorKeyDown },
            react_1.default.createElement(presentational_components_1.Input, null,
                react_1.default.createElement(presentational_components_1.PromptBuffer, null),
                this.props.children),
            react_1.default.createElement(presentational_components_1.Outputs, { hidden: source === "" },
                react_1.default.createElement(markdown_1.default, { source: source
                        ? source
                        : "*Empty markdown cell, double click me to add content.*" }))));
    }
}
MarkdownCell.defaultProps = {
    cellFocused: false,
    editorFocused: false,
    focusAbove: noop,
    focusBelow: noop,
    focusEditor: noop,
    unfocusEditor: noop,
    source: ""
};
exports.default = MarkdownCell;
