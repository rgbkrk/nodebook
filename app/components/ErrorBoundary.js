// @flow

import * as React from 'react';

type Props = {
  children: React.Node
};

type State = {
  error: ?{
    name: string,
    message: string,
    stack: string
  }
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.children !== this.props.children) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    const { name } = error;
    const message = error.message.replace(/\n.*/g, '');
    const stack = info.componentStack.replace(
      /in (.+) \(at (.+)\)/gm,
      'at $1 ($2)'
    );
    this.setState({ error: { name, message, stack } });
  }

  render() {
    if (this.state.error) {
      return JSON.stringify(this.state.error);
    }
    if (this.props.children instanceof Error) {
      return JSON.stringify(this.props.children);
    }
    if (
      (React.isValidElement(this.props.children) &&
        typeof (this.props.children: any).type === 'function') ||
      ['string', 'number', 'boolean'].includes(typeof this.props.children) ||
      this.props.children === null
    ) {
      return this.props.children;
    }
    if ((this.props.children: any).toString)
      return (this.props.children: any).toString();
    return null;
  }
}
