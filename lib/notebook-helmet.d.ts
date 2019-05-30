import { ContentRef } from "@nteract/types";
import React from "react";
interface Props {
    filePath: string | null;
}
export declare class NotebookHelmet extends React.PureComponent<Props> {
    render(): JSX.Element;
}
interface InitialProps {
    contentRef: ContentRef;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof NotebookHelmet, Pick<Props, never> & InitialProps>;
export default _default;
