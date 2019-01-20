import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = "No never identifier"

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoNeverIdentifierRuleWalker(sourceFile, this.getOptions(), program)
    )
  }
}

class NoNeverIdentifierRuleWalker extends Lint.ProgramAwareRuleWalker {
  public visitIdentifier(node: ts.Identifier) {
    if (node.text === "name") {
      const nodeType = this.getTypeChecker().getTypeAtLocation(node)

      if (nodeType.flags === ts.TypeFlags.Never) {
        this.addFailure(
          this.createFailure(
            node.getStart(),
            node.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }

      super.visitIdentifier(node)
    }
  }
}
