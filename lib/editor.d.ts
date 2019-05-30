import EditorView, { CodeMirrorEditorProps } from "@nteract/editor";
import { ContentRef } from "@nteract/types";
interface InitialProps {
    id: string;
    contentRef: ContentRef;
    focusAbove: () => void;
    focusBelow: () => void;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof EditorView, Pick<CodeMirrorEditorProps, "placeholder" | "readOnly" | "preserveScrollPosition" | "indentUnit" | "smartIndent" | "tabSize" | "indentWithTabs" | "electricChars" | "rtlMoveVisually" | "keyMap" | "extraKeys" | "lineNumbers" | "firstLineNumber" | "lineNumberFormatter" | "gutters" | "foldGutter" | "fixedGutter" | "scrollbarStyle" | "showCursorWhenSelecting" | "undoDepth" | "historyEventDelay" | "tabindex" | "autofocus" | "dragDrop" | "onDragEvent" | "onKeyEvent" | "cursorHeight" | "workTime" | "workDelay" | "pollInterval" | "flattenSpans" | "maxHighlightLength" | "viewportMargin" | "lint" | "showHint" | "hintOptions" | "matchBrackets"> & InitialProps>;
export default _default;
