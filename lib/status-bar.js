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
const selectors = __importStar(require("@nteract/selectors"));
const distance_in_words_to_now_1 = __importDefault(require("date-fns/distance_in_words_to_now"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const NOT_CONNECTED = "not connected";
const styled_components_1 = __importDefault(require("styled-components"));
exports.LeftStatus = styled_components_1.default.div `
  float: left;
  display: block;
  padding-left: 10px;
`;
exports.RightStatus = styled_components_1.default.div `
  float: right;
  padding-right: 10px;
  display: block;
`;
exports.Bar = styled_components_1.default.div `
  padding-top: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 12px;
  line-height: 0.5em;
  background: var(--status-bar);
  z-index: 99;
  @media print {
     display: none;
  }
`;
class StatusBar extends react_1.default.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.lastSaved !== nextProps.lastSaved ||
            this.props.kernelStatus !== nextProps.kernelStatus) {
            return true;
        }
        return false;
    }
    render() {
        const name = this.props.kernelSpecDisplayName || "Loading...";
        return (react_1.default.createElement(exports.Bar, null,
            react_1.default.createElement(exports.RightStatus, null, this.props.lastSaved ? (react_1.default.createElement("p", null,
                " Last saved ",
                distance_in_words_to_now_1.default(this.props.lastSaved),
                " ")) : (react_1.default.createElement("p", null, " Not saved yet "))),
            react_1.default.createElement(exports.LeftStatus, null,
                react_1.default.createElement("p", null,
                    name,
                    " | ",
                    this.props.kernelStatus))));
    }
}
exports.StatusBar = StatusBar;
const makeMapStateToProps = (initialState, initialProps) => {
    const { contentRef } = initialProps;
    const mapStateToProps = (state) => {
        const content = selectors.content(state, { contentRef });
        if (!content || content.type !== "notebook") {
            return {
                kernelStatus: NOT_CONNECTED,
                kernelSpecDisplayName: "no kernel",
                lastSaved: null
            };
        }
        const kernelRef = content.model.kernelRef;
        let kernel = null;
        if (kernelRef) {
            kernel = selectors.kernel(state, { kernelRef });
        }
        const lastSaved = content && content.lastSaved ? content.lastSaved : null;
        const kernelStatus = kernel != null && kernel.status != null ? kernel.status : NOT_CONNECTED;
        // TODO: We need kernels associated to the kernelspec they came from
        //       so we can pluck off the display_name and provide it here
        let kernelSpecDisplayName = " ";
        if (kernelStatus === NOT_CONNECTED) {
            kernelSpecDisplayName = "no kernel";
        }
        else if (kernel != null && kernel.kernelSpecName != null) {
            kernelSpecDisplayName = kernel.kernelSpecName;
        }
        else if (content !== undefined && content.type === "notebook") {
            kernelSpecDisplayName =
                selectors.notebook.displayName(content.model) || " ";
        }
        return {
            kernelSpecDisplayName,
            kernelStatus,
            lastSaved
        };
    };
    return mapStateToProps;
};
exports.default = react_redux_1.connect(makeMapStateToProps)(StatusBar);
