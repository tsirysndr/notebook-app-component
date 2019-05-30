"use strict";
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
const actions = __importStar(require("@nteract/actions"));
const octicons_1 = require("@nteract/octicons");
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
exports.CellCreatorMenu = styled_components_1.default.div `
  display: none;
  background: var(--theme-cell-creator-bg);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  pointer-events: all;
  position: relative;
  top: -5px;

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

  button span {
    font-size: 15px;
    line-height: 1;

    color: var(--theme-cell-creator-fg);
  }

  button span:hover {
    color: var(--theme-cell-creator-fg-hover);
  }

  .octicon {
    transition: color 0.5s;
  }
`;
const CreatorHoverMask = styled_components_1.default.div `
  display: block;
  position: relative;
  overflow: visible;
  height: 0px;

  @media print{
    display: none;
  }
`;
const CreatorHoverRegion = styled_components_1.default.div `
  position: relative;
  overflow: visible;
  top: -10px;
  height: 60px;
  text-align: center;

  &:hover ${exports.CellCreatorMenu} {
    display: inline-block;
  }
`;
class PureCellCreator extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.createMarkdownCell = () => {
            this.props.createCell("markdown");
        };
        this.createCodeCell = () => {
            this.props.createCell("code");
        };
    }
    render() {
        return (React.createElement(CreatorHoverMask, null,
            React.createElement(CreatorHoverRegion, null,
                React.createElement(exports.CellCreatorMenu, null,
                    React.createElement("button", { onClick: this.createMarkdownCell, title: "create text cell", className: "add-text-cell" },
                        React.createElement("span", { className: "octicon" },
                            React.createElement(octicons_1.MarkdownOcticon, null))),
                    React.createElement("button", { onClick: this.createCodeCell, title: "create code cell", className: "add-code-cell" },
                        React.createElement("span", { className: "octicon" },
                            React.createElement(octicons_1.CodeOcticon, null)))))));
    }
}
exports.PureCellCreator = PureCellCreator;
// tslint:disable max-classes-per-file
class CellCreator extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.createCell = (type) => {
            const { above, createCellBelow, createCellAppend, createCellAbove, id, contentRef } = this.props;
            if (id === undefined || typeof id !== "string") {
                createCellAppend({ cellType: type, contentRef });
                return;
            }
            above
                ? createCellAbove({ cellType: type, id, contentRef })
                : createCellBelow({ cellType: type, id, source: "", contentRef });
        };
    }
    render() {
        return (React.createElement(PureCellCreator, { above: this.props.above, createCell: this.createCell }));
    }
}
const mapDispatchToProps = (dispatch) => ({
    createCellAbove: (payload) => dispatch(actions.createCellAbove(payload)),
    createCellAppend: (payload) => dispatch(actions.createCellAppend(payload)),
    createCellBelow: (payload) => dispatch(actions.createCellBelow(payload))
});
exports.default = react_redux_1.connect(null, mapDispatchToProps)(CellCreator);
