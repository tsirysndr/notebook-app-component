import { ContentRef } from "@nteract/types";
import React from "react";
interface Props {
    lastSaved?: Date | null;
    kernelSpecDisplayName: string;
    kernelStatus: string;
}
export declare const LeftStatus: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const RightStatus: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Bar: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare class StatusBar extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props): boolean;
    render(): JSX.Element;
}
interface InitialProps {
    contentRef: ContentRef;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof StatusBar, Pick<Props, never> & InitialProps>;
export default _default;
