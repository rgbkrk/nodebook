// @flow
import * as React from "react";
import {
  Cell as CellContainer,
  Source,
  Cells,
  Input,
  Prompt
} from "@nteract/presentational-components";

type CellID = string;

type CodeCell = {
  type: "code",
  source: string,
  outputs: Array<any>
};

type MarkdownCell = {
  type: "markdown",
  source: string
};

type Cell = CodeCell | MarkdownCell;

type AppState = {
  notebook: {
    cellList: Array<CellID>
  },
  cells: {
    [CellID]: Cell
  }
};

const initialProps: AppState = {
  notebook: {
    cellList: ["b", "a"]
  },
  cells: {
    b: { type: "markdown", source: "# hello" },
    a: { type: "markdown", source: "woo" }
  }
};

class Notebook extends React.Component<AppState, null> {
  render() {
    return this.props.notebook.cellList.map(cellID => (
      <pre key={cellID}>{cellID}</pre>
    ));
  }
}

export default class NotebookApp extends React.Component<null, null> {
  render() {
    return (
      <Notebook notebook={initialProps.notebook} cells={initialProps.cells} />
    );
  }
}
