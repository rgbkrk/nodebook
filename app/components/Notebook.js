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
type Cell = {};

type AppState = {
  notebook: {
    cellList: Array<CellID>
  },
  cells: {
    [CellID]: Cell
  }
};

const initialProps = {
  notebook: {
    cellList: ["b", "a"]
  },
  cells: {
    b: {},
    a: {}
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
