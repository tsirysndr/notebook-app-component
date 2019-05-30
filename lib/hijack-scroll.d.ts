import * as React from "react";
interface HijackScrollProps {
    focused: boolean;
    onClick: () => void;
    children: React.ReactNode;
}
export declare class HijackScroll extends React.Component<HijackScrollProps> {
    el: HTMLDivElement | null;
    scrollIntoViewIfNeeded(prevFocused?: boolean): void;
    componentDidUpdate(prevProps: HijackScrollProps): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
