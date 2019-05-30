import { ContentRef } from "@nteract/types";
import * as React from "react";
interface Props {
    focusCell: (payload: any) => void;
    id: string;
    moveCell: (payload: any) => void;
    children: React.ReactNode;
    contentRef: ContentRef;
}
declare const _default: import("react-dnd").DndComponentClass<Props>;
export default _default;
