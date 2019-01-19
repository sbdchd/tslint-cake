import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "No pointless case scope. Remove the surrounding {}."

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoPointlessComputedPropertyNameWalker(sourceFile, this.getOptions())
    )
  }
}

class NoPointlessComputedPropertyNameWalker extends Lint.RuleWalker {
  public visitCaseClause(node: ts.CaseClause) {
    if (node.statements.length > 0) {
      const firstStmt = node.statements[0]
      if (
        ts.isBlock(firstStmt) &&
        firstStmt.statements.length === 1 &&
        ts.isReturnStatement(firstStmt.statements[0])
      ) {
        this.addFailure(
          this.createFailure(
            firstStmt.getStart(),
            firstStmt.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }
    }

    super.visitCaseClause(node)
  }
}
