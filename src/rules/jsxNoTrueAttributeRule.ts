import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Prefer simple boolean attribute"

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new JsxNoTrueAttributeWalker(sourceFile, this.getOptions())
    )
  }
}

class JsxNoTrueAttributeWalker extends Lint.RuleWalker {
  public visitJsxAttribute(node: ts.JsxAttribute) {
    if (
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression &&
      node.initializer.expression.kind === ts.SyntaxKind.TrueKeyword
    ) {
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          Rule.FAILURE_STRING
        )
      )
    }

    super.visitJsxAttribute(node)
  }
}
