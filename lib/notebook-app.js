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
const core_1 = require("@nteract/core");
const outputs_1 = require("@nteract/outputs");
const presentational_components_1 = require("@nteract/presentational-components");
const Immutable = __importStar(require("immutable"));
const React = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = __importDefault(require("react-dnd-html5-backend"));
const react_redux_1 = require("react-redux");
const cell_creator_1 = __importDefault(require("./cell-creator"));
const draggable_cell_1 = __importDefault(require("./draggable-cell"));
const editor_1 = __importDefault(require("./editor"));
const hijack_scroll_1 = require("./hijack-scroll");
const markdown_preview_1 = __importDefault(require("./markdown-preview"));
const notebook_helmet_1 = __importDefault(require("./notebook-helmet"));
const toolbar_1 = __importStar(require("./toolbar"));
const transform_media_1 = __importDefault(require("./transform-media"));
const styled_components_1 = __importDefault(require("styled-components"));
function getTheme(theme) {
    switch (theme) {
        case "dark":
            return React.createElement(presentational_components_1.DarkTheme, null);
        case "light":
        default:
            return React.createElement(presentational_components_1.LightTheme, null);
    }
}
const emptyList = Immutable.List();
const emptySet = Immutable.Set();
const Cell = styled_components_1.default(presentational_components_1.Cell).attrs((props) => ({
    className: props.isSelected ? "selected" : ""
})) `
  /*
   * Show the cell-toolbar-mask if hovering on cell,
   * cell was the last clicked
   */
  &:hover ${toolbar_1.CellToolbarMask}, &.selected ${toolbar_1.CellToolbarMask} {
    display: block;
  }
`;
Cell.displayName = "Cell";
const makeMapStateToCellProps = (initialState, { id, contentRef }) => {
    const mapStateToCellProps = (state) => {
        const model = core_1.selectors.model(state, { contentRef });
        if (!model || model.type !== "notebook") {
            throw new Error("Cell components should not be used with non-notebook models");
        }
        const kernelRef = model.kernelRef;
        const cell = core_1.selectors.notebook.cellById(model, { id });
        if (!cell) {
            throw new Error("cell not found inside cell map");
        }
        const cellType = cell.cell_type;
        const outputs = cell.get("outputs", emptyList);
        const sourceHidden = (cellType === "code" &&
            (cell.getIn(["metadata", "inputHidden"]) ||
                cell.getIn(["metadata", "hide_input"]))) ||
            false;
        const outputHidden = cellType === "code" &&
            (outputs.size === 0 || cell.getIn(["metadata", "outputHidden"]));
        const outputExpanded = cellType === "code" && cell.getIn(["metadata", "outputExpanded"]);
        const tags = cell.getIn(["metadata", "tags"]) || emptySet;
        const pager = model.getIn(["cellPagers", id]) || emptyList;
        let channels;
        if (kernelRef) {
            const kernel = core_1.selectors.kernel(state, { kernelRef });
            if (kernel) {
                channels = kernel.channels;
            }
        }
        return {
            cellFocused: model.cellFocused === id,
            cellStatus: model.transient.getIn(["cellMap", id, "status"]),
            cellType,
            channels,
            contentRef,
            editorFocused: model.editorFocused === id,
            executionCount: cell.get("execution_count", null),
            outputExpanded,
            outputHidden,
            outputs,
            pager,
            source: cell.get("source", ""),
            sourceHidden,
            tags,
            theme: core_1.selectors.userTheme(state)
        };
    };
    return mapStateToCellProps;
};
const makeMapDispatchToCellProps = (initialDispatch, { id, contentRef }) => {
    const mapDispatchToCellProps = (dispatch) => ({
        focusAboveCell: () => {
            dispatch(core_1.actions.focusPreviousCell({ id, contentRef }));
            dispatch(core_1.actions.focusPreviousCellEditor({ id, contentRef }));
        },
        focusBelowCell: () => {
            dispatch(core_1.actions.focusNextCell({ id, createCellIfUndefined: true, contentRef }));
            dispatch(core_1.actions.focusNextCellEditor({ id, contentRef }));
        },
        focusEditor: () => dispatch(core_1.actions.focusCellEditor({ id, contentRef })),
        selectCell: () => dispatch(core_1.actions.focusCell({ id, contentRef })),
        unfocusEditor: () => dispatch(core_1.actions.focusCellEditor({ id: undefined, contentRef })),
        changeCellType: (to) => dispatch(core_1.actions.changeCellType({
            contentRef,
            id,
            to
        })),
        clearOutputs: () => dispatch(core_1.actions.clearOutputs({ id, contentRef })),
        deleteCell: () => dispatch(core_1.actions.deleteCell({ id, contentRef })),
        executeCell: () => dispatch(core_1.actions.executeCell({ id, contentRef })),
        toggleCellInputVisibility: () => dispatch(core_1.actions.toggleCellInputVisibility({ id, contentRef })),
        toggleCellOutputVisibility: () => dispatch(core_1.actions.toggleCellOutputVisibility({ id, contentRef })),
        toggleOutputExpansion: () => dispatch(core_1.actions.toggleOutputExpansion({ id, contentRef })),
        toggleParameterCell: () => dispatch(core_1.actions.toggleParameterCell({ id, contentRef })),
        updateOutputMetadata: (index, metadata, mediaType) => {
            dispatch(core_1.actions.updateOutputMetadata({
                id,
                contentRef,
                metadata,
                index,
                mediaType
            }));
        }
    });
    return mapDispatchToCellProps;
};
const CellBanner = styled_components_1.default.div `
  background-color: darkblue;
  color: ghostwhite;
  padding: 9px 16px;

  font-size: 12px;
  line-height: 20px;
`;
CellBanner.displayName = "CellBanner";
class AnyCell extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.toggleCellType = () => {
            this.props.changeCellType(this.props.cellType === "markdown" ? "code" : "markdown");
        };
    }
    render() {
        const { executeCell, deleteCell, clearOutputs, toggleParameterCell, toggleCellInputVisibility, toggleCellOutputVisibility, toggleOutputExpansion, changeCellType, cellFocused, cellStatus, cellType, editorFocused, focusAboveCell, focusBelowCell, focusEditor, id, tags, theme, selectCell, unfocusEditor, contentRef, sourceHidden } = this.props;
        const running = cellStatus === "busy";
        const queued = cellStatus === "queued";
        let element = null;
        switch (cellType) {
            case "code":
                element = (React.createElement(React.Fragment, null,
                    React.createElement(presentational_components_1.Input, { hidden: this.props.sourceHidden },
                        React.createElement(presentational_components_1.Prompt, { counter: this.props.executionCount, running: running, queued: queued }),
                        React.createElement(presentational_components_1.Source, null,
                            React.createElement(editor_1.default, { id: id, contentRef: contentRef, focusAbove: focusAboveCell, focusBelow: focusBelowCell }))),
                    React.createElement(presentational_components_1.Pagers, null, this.props.pager.map((pager, key) => (React.createElement(outputs_1.RichMedia, { data: pager.data, metadata: pager.metadata },
                        React.createElement(outputs_1.Media.Json, null),
                        React.createElement(outputs_1.Media.JavaScript, null),
                        React.createElement(outputs_1.Media.HTML, null),
                        React.createElement(outputs_1.Media.Markdown, null),
                        React.createElement(outputs_1.Media.LaTeX, null),
                        React.createElement(outputs_1.Media.SVG, null),
                        React.createElement(outputs_1.Media.Image, null),
                        React.createElement(outputs_1.Media.Plain, null))))),
                    React.createElement(presentational_components_1.Outputs, { hidden: this.props.outputHidden, expanded: this.props.outputExpanded }, this.props.outputs.map((output, index) => (React.createElement(outputs_1.Output, { output: output, key: index },
                        React.createElement(transform_media_1.default, { output_type: "display_data", cellId: id, contentRef: contentRef, index: index }),
                        React.createElement(transform_media_1.default, { output_type: "execute_result", cellId: id, contentRef: contentRef, index: index }),
                        React.createElement(outputs_1.KernelOutputError, null),
                        React.createElement(outputs_1.StreamText, null)))))));
                break;
            case "markdown":
                element = (React.createElement(markdown_preview_1.default, { focusAbove: focusAboveCell, focusBelow: focusBelowCell, focusEditor: focusEditor, cellFocused: cellFocused, editorFocused: editorFocused, unfocusEditor: unfocusEditor, source: this.props.source },
                    React.createElement(presentational_components_1.Source, null,
                        React.createElement(editor_1.default, { id: id, contentRef: contentRef, focusAbove: focusAboveCell, focusBelow: focusBelowCell }))));
                break;
            case "raw":
                element = (React.createElement(presentational_components_1.Source, null,
                    React.createElement(editor_1.default, { id: id, contentRef: contentRef, focusAbove: focusAboveCell, focusBelow: focusBelowCell })));
                break;
            default:
                element = React.createElement("pre", null, this.props.source);
                break;
        }
        return (React.createElement(hijack_scroll_1.HijackScroll, { focused: cellFocused, onClick: selectCell },
            React.createElement(Cell, { isSelected: cellFocused },
                tags.has("parameters") ? (React.createElement(CellBanner, null, "Papermill - Parametrized")) : null,
                tags.has("default parameters") ? (React.createElement(CellBanner, null, "Papermill - Default Parameters")) : null,
                React.createElement(toolbar_1.default, { type: cellType, cellFocused: cellFocused, executeCell: executeCell, deleteCell: deleteCell, clearOutputs: clearOutputs, toggleParameterCell: toggleParameterCell, toggleCellInputVisibility: toggleCellInputVisibility, toggleCellOutputVisibility: toggleCellOutputVisibility, toggleOutputExpansion: toggleOutputExpansion, changeCellType: this.toggleCellType, sourceHidden: sourceHidden }),
                element)));
    }
}
exports.ConnectedCell = react_redux_1.connect(makeMapStateToCellProps, makeMapDispatchToCellProps)(AnyCell);
const makeMapStateToProps = (initialState, initialProps) => {
    const { contentRef } = initialProps;
    if (!contentRef) {
        throw new Error("<Notebook /> has to have a contentRef");
    }
    const mapStateToProps = (state) => {
        const content = core_1.selectors.content(state, { contentRef });
        const model = core_1.selectors.model(state, { contentRef });
        if (!model || !content) {
            throw new Error("<Notebook /> has to have content & model that are notebook types");
        }
        const theme = core_1.selectors.userTheme(state);
        if (model.type !== "notebook") {
            return {
                cellOrder: Immutable.List(),
                contentRef,
                theme
            };
        }
        if (model.type !== "notebook") {
            throw new Error("<Notebook /> has to have content & model that are notebook types");
        }
        return {
            cellOrder: model.notebook.cellOrder,
            contentRef,
            theme
        };
    };
    return mapStateToProps;
};
const Cells = styled_components_1.default.div `
  padding-top: var(--nt-spacing-m, 10px);
  padding-left: var(--nt-spacing-m, 10px);
  padding-right: var(--nt-spacing-m, 10px);
`;
const mapDispatchToProps = (dispatch) => ({
    executeFocusedCell: (payload) => dispatch(core_1.actions.executeFocusedCell(payload)),
    focusCell: (payload) => dispatch(core_1.actions.focusCell(payload)),
    focusNextCell: (payload) => dispatch(core_1.actions.focusNextCell(payload)),
    focusNextCellEditor: (payload) => dispatch(core_1.actions.focusNextCellEditor(payload)),
    moveCell: (payload) => dispatch(core_1.actions.moveCell(payload)),
    updateOutputMetadata: (payload) => dispatch(core_1.actions.updateOutputMetadata(payload))
});
// tslint:disable max-classes-per-file
class NotebookApp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.keyDown = this.keyDown.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.keyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown);
    }
    keyDown(e) {
        // If enter is not pressed, do nothing
        if (e.keyCode !== 13) {
            return;
        }
        const { executeFocusedCell, focusNextCell, focusNextCellEditor, contentRef } = this.props;
        let ctrlKeyPressed = e.ctrlKey;
        // Allow cmd + enter (macOS) to operate like ctrl + enter
        if (process.platform === "darwin") {
            ctrlKeyPressed = (e.metaKey || e.ctrlKey) && !(e.metaKey && e.ctrlKey);
        }
        const shiftXORctrl = (e.shiftKey || ctrlKeyPressed) && !(e.shiftKey && ctrlKeyPressed);
        if (!shiftXORctrl) {
            return;
        }
        e.preventDefault();
        // NOTE: Order matters here because we need it to execute _before_ we
        // focus the next cell
        executeFocusedCell({ contentRef });
        if (e.shiftKey) {
            // Couldn't focusNextCell just do focusing of both?
            focusNextCell({ id: undefined, createCellIfUndefined: true, contentRef });
            focusNextCellEditor({ id: undefined, contentRef });
        }
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(notebook_helmet_1.default, { contentRef: this.props.contentRef }),
            React.createElement(Cells, null,
                React.createElement(cell_creator_1.default, { id: this.props.cellOrder.get(0), above: true, contentRef: this.props.contentRef }),
                this.props.cellOrder.map(cellID => (React.createElement("div", { className: "cell-container", key: `cell-container-${cellID}` },
                    React.createElement(draggable_cell_1.default, { moveCell: this.props.moveCell, id: cellID, focusCell: this.props.focusCell, contentRef: this.props.contentRef },
                        React.createElement(exports.ConnectedCell, { id: cellID, contentRef: this.props.contentRef })),
                    React.createElement(cell_creator_1.default, { key: `creator-${cellID}`, id: cellID, above: false, contentRef: this.props.contentRef }))))),
            getTheme(this.props.theme)));
    }
}
NotebookApp.defaultProps = {
    theme: "light"
};
exports.NotebookApp = NotebookApp;
exports.ConnectedNotebook = react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default)(NotebookApp);
exports.default = react_redux_1.connect(makeMapStateToProps, mapDispatchToProps)(exports.ConnectedNotebook);
