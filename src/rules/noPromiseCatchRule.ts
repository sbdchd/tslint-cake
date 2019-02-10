import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "No promise catch. Instead of throwing an error, use a union or result type."

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoPromiseCatchWalker(sourceFile, this.getOptions())
    )
  }
}

class NoPromiseCatchWalker extends Lint.RuleWalker {
  public visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
    const ident = node.name
    if (ident.text === "catch") {
      this.addFailure(
        this.createFailure(
          ident.getStart(),
          ident.getWidth(),
          Rule.FAILURE_STRING
        )
      )
    }

    super.visitPropertyAccessExpression(node)
  }
}
