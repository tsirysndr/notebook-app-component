# Notebook App Component

A monolithic notebook app, in a component

## Installation
```
npm install --save git+https://github.com/realtsiry/notebook-app-component.git
```

## Usage

This component is not for the faint of heart. It requires you to setup the redux store used by the other nteract apps. You can check out desktop or jupyter extension for examples.

```jsx
import NotebookApp from "notebook-app-component";

<NotebookApp
  // The desktop app always keeps the same contentRef in a
  // browser window
  contentRef={contentRef}
/>
```
