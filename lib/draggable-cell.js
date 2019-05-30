"use strict";
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const styled_components_1 = __importDefault(require("styled-components"));
/**
  The cell drag preview image is just a little stylized version of

   [ ]

  It matches nteract's default light theme

 */
const cellDragPreviewImage = [
    "data:image/png;base64,",
    "iVBORw0KGgoAAAANSUhEUgAAADsAAAAzCAYAAAApdnDeAAAAAXNSR0IArs4c6QAA",
    "AwNJREFUaAXtmlFL3EAUhe9MZptuoha3rLWgYC0W+lj/T3+26INvXbrI2oBdE9km",
    "O9Nzxu1S0LI70AQScyFmDDfkfvdMZpNwlCCccwq7f21MaVM4FPtkU0o59RdoJBMx",
    "WZINBg+DQWGKCAk+2kIKFh9JlSzLYVmOilEpR1Kh/iUbQFiNQTSbzWJrbYJximOJ",
    "cSaulpVRoqh4K8JhjprIVJWqFlCpQNG51roYj8cLjJcGf5RMZWC1TYw1o2LxcEmy",
    "0jeEo3ZFWVHIx0ji4eeKHFOx8l4sVVVZnBE6tWLHq7xO7FY86YpPeVjeo5y61tlR",
    "JyhXEOQhF/lw6BGWixHvUWXVTpdgyUMu8q1h/ZJbqQhdiLsESx4FLvL9gcV6q3Cs",
    "0liq2IHuBHjItYIV3rMvJnrYrkrdK9sr24EO9NO4AyI+i/CilOXbTi1xeXXFTyAS",
    "GSOfzs42XmM+v5fJ5JvP29/fl8PDw43nhCbUpuzFxYXs7OxKmqZb1WQGkc/P80K+",
    "T6dbnROaVJuyfPY+Pj7aup7h66HP/1Uu5O7u59bnhSTWpmxIEU3l9rBNdbrp6/TK",
    "Nt3xpq7XK9tUp5u+Tm2/s/jYJdfX12LwBHVycrKRK89zmeJhYnZ7K3Fcz3e/2mDP",
    "z7/waZEf8zaC+gSkKa3l4OBA3uztbXdOYFZtsKcfToNKSZNUPp6GnRN0AST3C1Ro",
    "x9qS3yvbFqVC6+yVDe1YW/J7ZduiVGidvbKhHWtLfq9sW5QKrdMri9cxB6OFhQmO",
    "TrDuBHjIRT5CEZZj0i7xOkYnWGeCPOQiHqC8lc/R60cLnNPuvjOkns7dk4t8/Jfv",
    "s46mRlWqQiudxebVV3gAj7C9hXsmgZeztnfe/91YODEr3IoF/JY/sE2gbGaVLci3",
    "hh0tRtWNvsm16JmNcOs6N9dW72LP7yOtWbEhjAUkZ+icoJ5HbE6+NSxMjKWe6cKb",
    "GkUWgMwiFbXSlRpFkXelUlF4F70rVd7Bd4oZ/LL8xiDmtPV2Nwyf2zOlTfHERY7i",
    "Haa1+w2+iFqx0aIgvgAAAABJRU5ErkJggg=="
].join("");
const cellSource = {
    beginDrag(props) {
        return {
            id: props.id
        };
    }
};
const DragHandle = styled_components_1.default.div.attrs({
    role: "presentation"
}) `
  position: absolute;
  z-index: 200;
  width: var(--prompt-width, 50px);
  height: 100%;
  cursor: move;
`;
const DragArea = styled_components_1.default.div.attrs(props => ({
    style: {
        opacity: props.isDragging ? 0.25 : 1,
        borderTop: props.isOver && props.hoverUpperHalf
            ? "3px lightgray solid"
            : "3px transparent solid",
        borderBottom: props.isOver && !props.hoverUpperHalf
            ? "3px lightgray solid"
            : "3px transparent solid"
    }
})) `
  position: relative;
  padding: 10px;
`; // Somehow setting the type on `attrs` isn't propagating properly;
function isDragUpper(props, monitor, el) {
    const hoverBoundingRect = el.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    return hoverClientY < hoverMiddleY;
}
const cellTarget = {
    drop(props, monitor, component) {
        if (monitor) {
            const hoverUpperHalf = isDragUpper(props, monitor, component.el);
            // DropTargetSpec monitor definition could be undefined. we'll need a check for monitor in order to pass validation.
            props.moveCell({
                id: monitor.getItem().id,
                destinationId: props.id,
                above: hoverUpperHalf,
                contentRef: props.contentRef
            });
        }
    },
    hover(props, monitor, component) {
        if (monitor) {
            component.setState({
                hoverUpperHalf: isDragUpper(props, monitor, component.el)
            });
        }
    }
};
function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    };
}
function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}
class DraggableCellView extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hoverUpperHalf: true
        };
        this.selectCell = () => {
            const { focusCell, id, contentRef } = this.props;
            focusCell({ id, contentRef });
        };
    }
    componentDidMount() {
        const connectDragPreview = this.props.connectDragPreview;
        const img = new window.Image();
        img.src = cellDragPreviewImage;
        img.onload = /*dragImageLoaded*/ () => {
            connectDragPreview(img);
        };
    }
    render() {
        return this.props.connectDropTarget(
        // Sadly connectDropTarget _has_ to take a React element for a DOM element (no styled-divs)
        React.createElement("div", null,
            React.createElement(DragArea, { isDragging: this.props.isDragging, hoverUpperHalf: this.state.hoverUpperHalf, isOver: this.props.isOver, ref: el => {
                    this.el = el;
                } },
                this.props.connectDragSource(
                // Same thing with connectDragSource... It also needs a React Element that matches a DOM element
                React.createElement("div", null,
                    React.createElement(DragHandle, { onClick: this.selectCell }))),
                this.props.children)));
    }
}
const source = react_dnd_1.DragSource("CELL", cellSource, collectSource);
const target = react_dnd_1.DropTarget("CELL", cellTarget, collectTarget);
exports.default = source(target(DraggableCellView));
