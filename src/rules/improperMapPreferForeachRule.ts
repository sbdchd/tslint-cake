import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Improper use of `map`. Use `forEach` instead."

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new ImproperMapPreferForEachWalker(sourceFile, this.getOptions())
    )
  }
}

class ImproperMapPreferForEachWalker extends Lint.RuleWalker {
  public visitExpressionStatement(node: ts.ExpressionStatement) {
    if (ts.isCallExpression(node.expression)) {
      const callExpr = node.expression
      if (ts.isPropertyAccessExpression(callExpr.expression)) {
        const ident = callExpr.expression.name
        if (ts.isIdentifier(ident) && ident.text === "map") {
          this.addFailure(
            this.createFailure(
              ident.getStart(),
              ident.getWidth(),
              Rule.FAILURE_STRING
            )
          )
        }
      }
    }

    super.visitExpressionStatement(node)
  }
}
