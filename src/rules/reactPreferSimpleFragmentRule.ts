import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "Prefer simple React fragments. Use <></> instead of <React.Fragment></React.Fragment>"

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new ReactPreferSimpleFragmentWalker(sourceFile, this.getOptions())
    )
  }
}

class ReactPreferSimpleFragmentWalker extends Lint.RuleWalker {
  public visitJsxElement(node: ts.JsxElement) {
    const tagName = node.openingElement.tagName
    const badFragment =
      ts.isPropertyAccessExpression(tagName) &&
      ts.isIdentifier(tagName.expression) &&
      ts.isIdentifier(tagName.name) &&
      tagName.expression.text === "React" &&
      tagName.name.text === "Fragment"

    if (badFragment) {
      const fixOpeningEl = new Lint.Replacement(
        tagName.getStart(),
        tagName.getWidth(),
        ""
      )

      const closingEl = node.closingElement.tagName
      const fixClosingEl = new Lint.Replacement(
        closingEl.getStart(),
        closingEl.getWidth(),
        ""
      )

      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          Rule.FAILURE_STRING,
          [fixOpeningEl, fixClosingEl]
        )
      )
    }

    super.visitJsxElement(node)
  }
}
