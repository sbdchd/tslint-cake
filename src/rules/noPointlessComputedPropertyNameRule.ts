import * as ts from "typescript"
import * as Lint from "tslint"
import { isValidPropertyName } from "../ruleUtils"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "No pointless computed property names. Remove the surrounding []."

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoPointlessComputedPropertyNameWalker(sourceFile, this.getOptions())
    )
  }
}

class NoPointlessComputedPropertyNameWalker extends Lint.RuleWalker {
  public visitPropertyAssignment(node: ts.PropertyAssignment) {
    if (
      ts.isComputedPropertyName(node.name) &&
      isValidPropertyName(node.name)
    ) {
      this.addFailure(
        this.createFailure(
          node.name.getStart(),
          node.name.getWidth(),
          Rule.FAILURE_STRING
        )
      )
    }

    super.visitPropertyAssignment(node)
  }
}
