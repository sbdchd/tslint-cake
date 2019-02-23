import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING =
    "Value of an object index is possibly undefined. Add `undefined` to the key's value type."

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    )
  }
}

function isPossiblyUndefined(
  node: ts.TypeNode,
  checker: ts.TypeChecker
): boolean {
  const nodeType = checker.getTypeAtLocation(node)

  if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return true
  }

  if (ts.isUnionTypeNode(node)) {
    return node.types.some(x => isPossiblyUndefined(x, checker))
  }

  if (
    nodeType.isUnionOrIntersection() &&
    nodeType.types.some(x => x.flags === ts.TypeFlags.Undefined)
  ) {
    return true
  }

  return false
}

class Walker extends Lint.ProgramAwareRuleWalker {
  public visitIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration) {
    if (node.type) {
      const checker = this.getTypeChecker()
      if (!isPossiblyUndefined(node.type, checker)) {
        this.addFailure(
          this.createFailure(
            node.type.getStart(),
            node.type.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }
      super.visitIndexSignatureDeclaration(node)
    }
  }
}
