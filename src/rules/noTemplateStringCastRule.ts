import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "Using template string as cast. Use String() or .toString() instead."

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoTemplateStringCastWalker(sourceFile, this.getOptions())
    )
  }
}

class NoTemplateStringCastWalker extends Lint.RuleWalker {
  public visitTemplateExpression(node: ts.TemplateExpression) {
    if (
      node.head.text === "" &&
      node.templateSpans.length === 1 &&
      node.templateSpans[0].literal.text === ""
    ) {
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          Rule.FAILURE_STRING
        )
      )
    }

    super.visitTemplateExpression(node)
  }
}
