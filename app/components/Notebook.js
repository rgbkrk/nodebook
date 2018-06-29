// @flow
import * as React from "react";

import ErrorBoundary from "./ErrorBoundary";

import {
  Cell as CellContainer,
  Source,
  Cells,
  Input,
  Prompt,
  Outputs
} from "@nteract/presentational-components";

import Editor from "@nteract/editor";

import evalWithContext from "../runtime/vm.js";

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

/**
 *
 *
 *
 *
 *
 */

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
      outputs: [
        //1, 2,
        Array.from(new Uint32Array(20)).map(x => ".")
        // [3, 4, 325, 3252, 98, 125],
        // { a: 2, b: 3 }
      ]
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

            const runCell = () => {
              const input = cell.source;
              let output;
              try {
                output = evalWithContext(input);
              } catch (err) {
                output = err;
              }

              this.setState(state => {
                const originalCell = state.cells[cellID];

                return {
                  cells: {
                    ...state.cells,
                    [cellID]: { ...originalCell, outputs: [output] }
                  }
                };
              });
            };

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
                      options={{
                        mode: "javascript",
                        extraKeys: {
                          "Cmd-Enter": runCell
                        }
                      }}
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
                </Input>
                {cell.type === "markdown" ? null : (
                  <Outputs>
                    {cell.outputs.map(output => {
                      // Cheap hack to check for react elements as the output so we can render as is
                      if (
                        output &&
                        output.hasOwnProperty("$$typeof") &&
                        output.$$typeof.toString() === "Symbol(react.element)"
                      ) {
                        return output;
                      }
                      if (Array.isArray(output)) {
                        return (
                          <ul>
                            {output.map((item, idx) => {
                              const hue = 360 / output.length * idx;

                              return (
                                <li
                                  style={{
                                    backgroundColor: `hsl(${hue}, 80%, 76%)`
                                  }}
                                >
                                  {item}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }
                      switch (typeof output) {
                        case "number":
                          return (
                            <pre
                              style={{
                                color: "white",
                                fontSize: "50px",
                                backgroundColor: "DeepPink",
                                padding: "5px"
                              }}
                            >
                              {output}
                            </pre>
                          );
                      }
                      console.log(typeof output);
                      return <pre>{JSON.stringify(output, null, 2)}</pre>;
                    })}
                  </Outputs>
                )}
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
