import * as React from "react";
import { StyledComponent } from "styled-components";
import { CellType } from "@nteract/commutable";
export interface PureToolbarProps {
    type: CellType;
    executeCell: () => void;
    deleteCell: () => void;
    clearOutputs: () => void;
    toggleParameterCell: () => void;
    toggleCellInputVisibility: () => void;
    toggleCellOutputVisibility: () => void;
    toggleOutputExpansion: () => void;
    changeCellType: () => void;
    cellFocused: boolean;
    sourceHidden: boolean;
}
export declare const CellToolbar: StyledComponent<"div", any, {}, never>;
interface CellToolbarMaskProps {
    sourceHidden: boolean;
    cellFocused: boolean;
}
export declare const CellToolbarMask: StyledComponent<"div", any, CellToolbarMaskProps, never>;
export declare class PureToolbar extends React.PureComponent<PureToolbarProps> {
    static defaultProps: Partial<PureToolbarProps>;
    render(): JSX.Element;
}
export default PureToolbar;
