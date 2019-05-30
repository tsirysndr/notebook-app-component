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
const react_1 = __importDefault(require("react"));
const react_helmet_1 = require("react-helmet");
const react_redux_1 = require("react-redux");
class NotebookHelmet extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_helmet_1.Helmet, null,
                react_1.default.createElement("base", { href: this.props.filePath || "." }))));
    }
}
exports.NotebookHelmet = NotebookHelmet;
const makeMapStateToProps = (initialState, initialProps) => {
    const { contentRef } = initialProps;
    const mapStateToProps = (state) => {
        const filePath = selectors.filepath(state, { contentRef });
        return {
            filePath
        };
    };
    return mapStateToProps;
};
exports.default = react_redux_1.connect(makeMapStateToProps)(NotebookHelmet);
