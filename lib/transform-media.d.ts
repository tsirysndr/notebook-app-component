import Immutable from "immutable";
import React from "react";
import { ImmutableDisplayData, ImmutableExecuteResult, JSONObject } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";
interface OwnProps {
    output_type: string;
    cellId: string;
    contentRef: ContentRef;
    index: number;
}
interface MappedProps {
    Media: React.ComponentType<any>;
    mediaType?: string;
    output?: ImmutableDisplayData | ImmutableExecuteResult;
    data?: any;
    metadata?: Immutable.Map<string, any>;
    theme?: string;
}
interface DispatchProps {
    mediaActions: {
        onMetadataChange: (metadata: JSONObject, mediaType: string) => void;
    };
}
declare const TransformMedia: import("react-redux").ConnectedComponentClass<(props: MappedProps & DispatchProps) => JSX.Element | null, Pick<MappedProps & DispatchProps, never> & OwnProps>;
export default TransformMedia;
