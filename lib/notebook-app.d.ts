import { CellId, CellType, ExecutionCount, JSONObject } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";
import * as Immutable from "immutable";
import * as React from "react";
import { Subject } from "rxjs";
interface AnyCellProps {
    id: string;
    tags: Immutable.Set<string>;
    contentRef: ContentRef;
    channels?: Subject<any>;
    cellType: "markdown" | "code" | "raw";
    theme: string;
    source: string;
    executionCount: ExecutionCount;
    outputs: Immutable.List<any>;
    pager: Immutable.List<any>;
    cellStatus: string;
    cellFocused: boolean;
    editorFocused: boolean;
    sourceHidden: boolean;
    executeCell: () => void;
    deleteCell: () => void;
    clearOutputs: () => void;
    toggleParameterCell: () => void;
    toggleCellInputVisibility: () => void;
    toggleCellOutputVisibility: () => void;
    toggleOutputExpansion: () => void;
    changeCellType: (to: CellType) => void;
    outputHidden: boolean;
    outputExpanded: boolean;
    selectCell: () => void;
    focusEditor: () => void;
    unfocusEditor: () => void;
    focusAboveCell: () => void;
    focusBelowCell: () => void;
    updateOutputMetadata: (index: number, metadata: JSONObject, mediaType: string) => void;
}
declare class AnyCell extends React.PureComponent<AnyCellProps> {
    toggleCellType: () => void;
    render(): JSX.Element;
}
export declare const ConnectedCell: import("react-redux").ConnectedComponentClass<typeof AnyCell, Pick<AnyCellProps, "id"> & {
    id: string;
    contentRef: string;
}>;
declare type NotebookProps = NotebookStateProps & NotebookDispatchProps;
interface NotebookStateProps {
    cellOrder: Immutable.List<any>;
    theme: string;
    contentRef: ContentRef;
}
interface NotebookDispatchProps {
    moveCell: (payload: {
        id: CellId;
        destinationId: CellId;
        above: boolean;
        contentRef: ContentRef;
    }) => void;
    focusCell: (payload: {
        id: CellId;
        contentRef: ContentRef;
    }) => void;
    executeFocusedCell: (payload: {
        contentRef: ContentRef;
    }) => void;
    focusNextCell: (payload: {
        id?: CellId;
        createCellIfUndefined: boolean;
        contentRef: ContentRef;
    }) => void;
    focusNextCellEditor: (payload: {
        id?: CellId;
        contentRef: ContentRef;
    }) => void;
    updateOutputMetadata: (payload: {
        id: CellId;
        metadata: JSONObject;
        contentRef: ContentRef;
        index: number;
        mediaType: string;
    }) => void;
}
export declare class NotebookApp extends React.PureComponent<NotebookProps> {
    static defaultProps: {
        theme: string;
    };
    constructor(props: NotebookProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    keyDown(e: KeyboardEvent): void;
    render(): JSX.Element;
}
export declare const ConnectedNotebook: typeof NotebookApp & import("react-dnd").ContextComponent<any>;
declare const _default: import("react-redux").ConnectedComponentClass<typeof NotebookApp & import("react-dnd").ContextComponent<any>, Pick<NotebookProps, never> & {
    contentRef: string;
}>;
export default _default;
