"use strict";
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Fix up a11y eslint here
// TODO: All the `<li>` below that have role button should just be `<button>` with proper styling
const dropdown_menu_1 = require("@nteract/dropdown-menu");
const octicons_1 = require("@nteract/octicons");
const React = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
exports.CellToolbar = styled_components_1.default.div `
  background-color: var(--theme-cell-toolbar-bg);
  opacity: 0.4;
  transition: opacity 0.4s;

  & > div {
    display: inline-block;
  }

  :hover {
    opacity: 1;
  }

  @media print {
    display: none ;
  }

  button {
    display: inline-block;

    width: 22px;
    height: 20px;
    padding: 0px 4px;

    text-align: center;

    border: none;
    outline: none;
    background: none;
  }

  span {
    font-size: 15px;
    line-height: 1;
    color: var(--theme-cell-toolbar-fg);
  }

  button span:hover {
    color: var(--theme-cell-toolbar-fg-hover);
  }

  .octicon {
    transition: color 0.5s;
  }

  span.spacer {
    display: inline-block;
    vertical-align: middle;
    margin: 1px 5px 3px 5px;
    height: 11px;
  }
`;
exports.CellToolbarMask = styled_components_1.default.div.attrs(props => ({
    style: {
        display: props.cellFocused
            ? "block"
            : props.sourceHidden
                ? "block"
                : "none"
    }
})) `
  z-index: 9999;
  position: absolute;
  top: 0px;
  right: 0px;
  height: 34px;

  /* Set the left padding to 50px to give users extra room to move their
              mouse to the toolbar without causing the cell to go out of focus and thus
              hide the toolbar before they get there. */
  padding: 0px 0px 0px 50px;
`;
class PureToolbar extends React.PureComponent {
    render() {
        const { executeCell, deleteCell, sourceHidden } = this.props;
        return (React.createElement(exports.CellToolbarMask, { sourceHidden: sourceHidden, cellFocused: this.props.cellFocused },
            React.createElement(exports.CellToolbar, null,
                this.props.type !== "markdown" && (React.createElement("button", { onClick: executeCell, title: "execute cell", className: "executeButton" },
                    React.createElement("span", { className: "octicon" },
                        React.createElement(octicons_1.TriangleRightOcticon, null)))),
                React.createElement(dropdown_menu_1.DropdownMenu, null,
                    React.createElement(dropdown_menu_1.DropdownTrigger, null,
                        React.createElement("button", { title: "show additional actions" },
                            React.createElement("span", { className: "octicon toggle-menu" },
                                React.createElement(octicons_1.ChevronDownOcticon, null)))),
                    this.props.type === "code" ? (React.createElement(dropdown_menu_1.DropdownContent, null,
                        React.createElement("li", { onClick: this.props.clearOutputs, className: "clearOutput", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Clear Cell Output")),
                        React.createElement("li", { onClick: this.props.toggleCellInputVisibility, className: "inputVisibility", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Toggle Input Visibility")),
                        React.createElement("li", { onClick: this.props.toggleCellOutputVisibility, className: "outputVisibility", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Toggle Output Visibility")),
                        React.createElement("li", { onClick: this.props.toggleOutputExpansion, className: "outputExpanded", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Toggle Expanded Output")),
                        React.createElement("li", { onClick: this.props.toggleParameterCell, role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Toggle Parameter Cell")),
                        React.createElement("li", { onClick: this.props.changeCellType, className: "changeType", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Convert to Markdown Cell")))) : (React.createElement(dropdown_menu_1.DropdownContent, null,
                        React.createElement("li", { onClick: this.props.changeCellType, className: "changeType", role: "option", "aria-selected": "false", tabIndex: 0 },
                            React.createElement("a", null, "Convert to Code Cell"))))),
                React.createElement("span", { className: "spacer" }),
                React.createElement("button", { onClick: deleteCell, title: "delete cell", className: "deleteButton" },
                    React.createElement("span", { className: "octicon" },
                        React.createElement(octicons_1.TrashOcticon, null))))));
    }
}
PureToolbar.defaultProps = {
    type: "code"
};
exports.PureToolbar = PureToolbar;
exports.default = PureToolbar;
