import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = "null/undefined to string."
  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    )
  }
}

function getNullableBinaryExpressionNode(
  checker: ts.TypeChecker,
  node: ts.BinaryExpression
): ts.Expression | null {
  const nodeTypeLeft = checker.getTypeAtLocation(node.left)
  const nodeTypeRight = checker.getTypeAtLocation(node.right)

  if (isNullableOrUndefined(nodeTypeLeft)) {
    return node.left
  }

  if (isNullableOrUndefined(nodeTypeRight)) {
    return node.right
  }

  return null
}

function isNullableOrUndefined(nodeType: ts.Type): boolean {
  // tslint:disable:no-bitwise
  return Boolean(
    nodeType.flags & ts.TypeFlags.Null ||
      nodeType.flags & ts.TypeFlags.Undefined
  )
}

class Walker extends Lint.ProgramAwareRuleWalker {
  public visitBinaryExpression(node: ts.BinaryExpression) {
    if (node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const checker = this.getTypeChecker()
      const maybeNode = getNullableBinaryExpressionNode(checker, node)
      if (maybeNode) {
        this.addFailure(
          this.createFailure(
            maybeNode.getStart(),
            maybeNode.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }
    }
  }
  public visitJsxExpression(node: ts.JsxExpression) {
    if (node.expression) {
      const nodeType = this.getTypeChecker().getTypeAtLocation(node.expression)
      if (isNullableOrUndefined(nodeType)) {
        this.addFailure(
          this.createFailure(
            node.expression.getStart(),
            node.expression.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }
    }
  }
  public visitCallExpression(node: ts.CallExpression) {
    if (
      ts.isIdentifier(node.expression) &&
      node.expression.text === "String" &&
      node.arguments
    ) {
      const argNode = node.arguments[0]
      const nodeType = this.getTypeChecker().getTypeAtLocation(argNode)
      if (isNullableOrUndefined(nodeType)) {
        this.addFailure(
          this.createFailure(
            argNode.getStart(),
            argNode.getWidth(),
            Rule.FAILURE_STRING
          )
        )
      }
    }
  }
  public visitTemplateExpression(node: ts.TemplateExpression) {
    if (node.templateSpans) {
      node.templateSpans.forEach(span => {
        const spanType = this.getTypeChecker().getTypeAtLocation(
          span.expression
        )
        if (isNullableOrUndefined(spanType)) {
          this.addFailure(
            this.createFailure(
              span.expression.getStart(),
              span.expression.getWidth(),
              Rule.FAILURE_STRING
            )
          )
        }
      })
    }
  }
}
