"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const core_1 = require("@nteract/core");
const memoize_one_1 = __importDefault(require("memoize-one"));
const PureTransformMedia = (props) => {
    const { Media, mediaActions, mediaType, data, metadata, theme } = props;
    // If we had no valid result, return an empty output
    if (!mediaType || !data) {
        return null;
    }
    return (react_1.default.createElement(Media, Object.assign({}, mediaActions, { data: data, metadata: metadata, theme: theme })));
};
const richestMediaType = (output, order, handlers) => {
    const outputData = output.data;
    // Find the first mediaType in the output data that we support with a handler
    const mediaType = order.find(key => {
        return (outputData.hasOwnProperty(key) &&
            (handlers.hasOwnProperty(key) || handlers.get(key, false)));
    });
    return mediaType;
};
const makeMapStateToProps = (initialState, initialProps) => {
    const { contentRef, index, cellId } = initialProps;
    const memoizedMetadata = memoize_one_1.default(immutableMetadata => immutableMetadata ? immutableMetadata.toJS() : {});
    const mapStateToProps = (state) => {
        const output = state.core.entities.contents.byRef.getIn([contentRef, "model", "notebook", "cellMap", cellId, "outputs", index], null);
        // This component should only be used with display data and execute result
        if (!output ||
            !(output.output_type === "display_data" ||
                output.output_type === "execute_result")) {
            console.warn("connected transform media managed to get a non media bundle output");
            return {
                Media: () => null
            };
        }
        const handlers = core_1.selectors.transformsById(state);
        const order = core_1.selectors.displayOrder(state);
        const theme = core_1.selectors.userTheme(state);
        const mediaType = richestMediaType(output, order, handlers);
        if (mediaType) {
            const metadata = memoizedMetadata(output.metadata.get(mediaType));
            const data = output.data[mediaType];
            const Media = core_1.selectors.transform(state, { id: mediaType });
            return {
                Media,
                mediaType,
                data,
                metadata,
                theme
            };
        }
        return {
            Media: () => null,
            mediaType,
            output,
            theme
        };
    };
    return mapStateToProps;
};
const makeMapDispatchToProps = (initialDispath, initialProps) => {
    const { cellId, contentRef, index } = initialProps;
    const mapDispatchToProps = (dispatch) => {
        return {
            mediaActions: {
                onMetadataChange: (metadata, mediaType) => {
                    dispatch(core_1.actions.updateOutputMetadata({
                        id: cellId,
                        contentRef,
                        metadata,
                        index,
                        mediaType
                    }));
                }
            }
        };
    };
    return mapDispatchToProps;
};
const TransformMedia = react_redux_1.connect(makeMapStateToProps, makeMapDispatchToProps)(PureTransformMedia);
exports.default = TransformMedia;
