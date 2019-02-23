import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = "Object spread must be exact."

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    )
  }
}

function validProps(typeProps: Set<string>, props: Set<string>): boolean {
  if (typeProps.size !== props.size) {
    return false
  }
  props.forEach(p => {
    if (!typeProps.has(p)) {
      return false
    }
  })
  return true
}

class Walker extends Lint.ProgramAwareRuleWalker {
  public visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
    // General idea here is that we find a spread assignment, then we check if
    // the properties in the spread all exist on the object being spread
    if (node.properties.some(ts.isSpreadAssignment)) {
      const spreadNode = node.properties.find(ts.isSpreadAssignment)
      if (
        spreadNode &&
        (ts.isIdentifier(spreadNode.expression) ||
          ts.isPropertyAccessExpression(spreadNode.expression))
      ) {
        const checker = this.getTypeChecker()
        const typeProperties = new Set(
          checker
            .getTypeAtLocation(spreadNode.expression)
            .getProperties()
            .map(x => x.escapedName.toString())
        )

        const actualProperties = new Set(
          checker
            .getTypeAtLocation(node)
            .getProperties()
            .map(x => x.escapedName.toString())
        )

        if (!validProps(typeProperties, actualProperties)) {
          this.addFailure(
            this.createFailure(
              node.getStart(),
              node.getWidth(),
              Rule.FAILURE_STRING
            )
          )
        }
      }
    }

    super.visitObjectLiteralExpression(node)
  }
}
