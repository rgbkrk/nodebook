// @flow

import vm from "vm";
import React from "react";
import { transform, transformFromAst } from "babel-core";

function asyncify(input: string): string {
  return `(
		async function() {
			${input}
		}
	)()`;
}

function getLastExpression(ast: Object): Object {
  const { callee } = ast.program.body[ast.program.body.length - 1].expression;
  if (callee.body) return callee.body.body[callee.body.body.length - 1];
  callee.arguments.forEach(argument => {
    if (argument.body) return argument.body.body[argument.body.body.length - 1];
  });
}

function returnify(ast: Object): Object {
  const lastExpression = getLastExpression(ast);
  if (!lastExpression) return ast;
  lastExpression.type = "ReturnStatement";
  if (lastExpression.expression) {
    lastExpression.argument = lastExpression.expression;
    delete lastExpression.expression;
  }
  return ast;
}

function babelify(input: string): string {
  const { ast } = transform(input);
  const transformedCode = returnify(ast);
  return transformFromAst(transformedCode).code;
}

export default function evalWithContext(input: string): any {
  const sandbox = { require: require, React, console };
  const context = vm.createContext(sandbox);
  const { code } = transform(input);
  babelify(asyncify(input));
  return vm.runInContext(code, context);
}
