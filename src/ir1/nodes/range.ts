import * as AST from "../../ast";
import { getOutPorts } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Type } from "../types/type";
import { ComplexNode } from "./complex";
import { Scatter } from "./scatter";

export class Range extends ComplexNode {
  public results: Array<[string, Port]>;
  constructor(definition: AST.RangeList, scope: Scope, fs: FunctionScope) {
    super("Range");
    this.cloneParamsFromScope(scope);
    this.results = [];
    for (let i = 0; i < definition.names.length; i++) {
      const scatter = new Scatter(definition.ranges, this, fs);
      if (scatter.outPorts.length != 1) {
        throw new Error("Scatter must have one resulting port");
      }
      const outPort = new Port(this.id, scatter.outPorts[0].type);
      this.addEdge([scatter.outPorts[0], outPort]);
      this.outPorts.push(outPort);
      this.results.push([definition.names[i], outPort]);
    }
  }

  public getResults(): Array<[string, Type]> {
    const result: Array<[string, Type]> = [];
    for (const [name, p] of this.results) {
      result.push([name, p.type]);
    }
    return result;
  }
}
