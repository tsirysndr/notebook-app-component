import React from "react";
interface Props {
    source: string;
    focusEditor: () => void;
    unfocusEditor: () => void;
    focusAbove: () => void;
    focusBelow: () => void;
    cellFocused: boolean;
    editorFocused: boolean;
    children: React.ReactNode;
}
interface State {
    view: boolean;
}
export default class MarkdownCell extends React.Component<Props, State> {
    static defaultProps: {
        cellFocused: boolean;
        editorFocused: boolean;
        focusAbove: () => void;
        focusBelow: () => void;
        focusEditor: () => void;
        unfocusEditor: () => void;
        source: string;
    };
    rendered: HTMLDivElement | null;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentDidUpdate(): void;
    updateFocus(): void;
    /**
     * Handles when a keydown event occurs on the unrendered MD cell
     */
    editorKeyDown(e: React.KeyboardEvent): void;
    closeEditor(): void;
    openEditor(): void;
    /**
     * Handles when a keydown event occurs on the rendered MD cell
     */
    renderedKeyDown(e: React.KeyboardEvent): void;
    render(): JSX.Element;
}
export {};
