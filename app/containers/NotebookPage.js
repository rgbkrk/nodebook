// @flow
import React, { Component } from "react";
import Notebook from "../components/Notebook";

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return <Notebook />;
  }
}
