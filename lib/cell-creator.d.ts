import { CellType } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";
import * as React from "react";
interface Props {
    above: boolean;
    createCell: (type: "code" | "markdown") => void;
}
interface ConnectedProps {
    above: boolean;
    createCellAppend: (payload: {
        cellType: CellType;
        contentRef: ContentRef;
    }) => void;
    createCellAbove: (payload: {
        cellType: CellType;
        id?: string;
        contentRef: ContentRef;
    }) => void;
    createCellBelow: (payload: {
        cellType: CellType;
        id?: string;
        source: string;
        contentRef: ContentRef;
    }) => void;
    id?: string;
    contentRef: ContentRef;
}
export declare const CellCreatorMenu: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare class PureCellCreator extends React.PureComponent<Props> {
    createMarkdownCell: () => void;
    createCodeCell: () => void;
    render(): JSX.Element;
}
declare class CellCreator extends React.PureComponent<ConnectedProps> {
    createCell: (type: "code" | "markdown") => void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof CellCreator, Pick<ConnectedProps, "id" | "above" | "contentRef">>;
export default _default;
