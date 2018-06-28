// @flow
import * as React from "react";

import {
  Cell as CellContainer,
  Source,
  Cells,
  Input,
  Prompt,
  Outputs
} from "@nteract/presentational-components";

import Editor from "@nteract/editor";

type CellID = string;

type CodeCell = {
  type: "code",
  executeOrder: number,
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

const initialState: AppState = {
  notebook: {
    cellList: ["g", "b", "a"]
  },
  cells: {
    g: {
      type: "code",
      executeOrder: 2,
      source: "console.log('hey')",
      outputs: []
    },
    b: { type: "markdown", source: "# hello" },
    a: { type: "markdown", source: "woo" }
  }
};

class Notebook extends React.Component<*, AppState> {
  state = initialState;

  render() {
    const { cellList } = this.state.notebook;
    const { cells } = this.state;

    return (
      <div>
        <Cells>
          {cellList.map(cellID => {
            const cell = cells[cellID];

            return (
              <CellContainer key={cellID}>
                <Input>
                  <Prompt
                    blank={cell.type === "markdown"}
                    counter={cell.type === "code" ? cell.executeOrder : null}
                  />
                  <Source>
                    <Editor
                      theme="light"
                      options={{}}
                      channels={null}
                      completion={false}
                      editorFocused={false}
                      focusAbove={() => {}}
                      focusBelow={() => {}}
                      value={cell.source}
                      language="javascript"
                      onChange={value => {
                        this.setState(state => {
                          const originalCell = state.cells[cellID];

                          return {
                            cells: {
                              ...state.cells,
                              [cellID]: { ...originalCell, source: value }
                            }
                          };
                        });
                      }}
                    />
                  </Source>
                  {cell.type === "markdown" ? null : <Outputs />}
                </Input>
              </CellContainer>
            );
          })}
        </Cells>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

export default class NotebookApp extends React.Component<null, null> {
  render() {
    return <Notebook />;
  }
}
