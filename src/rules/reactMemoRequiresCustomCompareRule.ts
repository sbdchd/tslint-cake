import * as ts from "typescript"
import * as Lint from "tslint"

export class Rule extends Lint.Rules.TypedRule {
  public static REACT_MEMO_FAILURE_STRING =
    "`React.Memo` uses a shallow compare by default. Consider providing a custom compare function to `React.Memo` as a second argument."
  public static REACT_PURE_COMPONENT_FAILURE_STRING =
    "`React.PureComponent` uses a shallow compare. Either use `React.Memo` or extend `React.Component` and override `shouldComponentUpdate()`"

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions(), program)
    )
  }
}

function complexProps(checker: ts.TypeChecker, props: ts.Symbol[]): boolean {
  for (const p of props) {
    const nodeType = checker.getTypeAtLocation(p.declarations[0])
    // tslint:disable-next-line:no-bitwise
    if (nodeType.flags & ts.TypeFlags.Object) {
      return true
    }
  }
  return false
}

/**
 * get type of function arg for ts.ArrowFunction, ts.FunctionExpression,
 * ts.FunctionDeclaration
 */
function getArgType(
  checker: ts.TypeChecker,
  arg: ts.Expression
): ts.TypeNode | undefined {
  if (ts.isIdentifier(arg)) {
    const declarations = checker.getTypeAtLocation(arg).symbol.declarations
    if (declarations) {
      const declaration = declarations[0]
      if (ts.isFunctionDeclaration(declaration) && declaration.parameters) {
        return declaration.parameters[0].type
      }
    }
  }
  if (
    (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) &&
    arg.parameters
  ) {
    return arg.parameters[0].type
  }

  return undefined
}

class Walker extends Lint.ProgramAwareRuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    if (
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === "React" &&
      ts.isIdentifier(node.expression.name) &&
      node.expression.name.text === "memo" &&
      node.arguments.length === 1
    ) {
      const firstArg = node.arguments[0]
      const checker = this.getTypeChecker()
      const argType = getArgType(checker, firstArg)
      if (argType) {
        const props = checker.getTypeAtLocation(argType).getProperties()
        if (complexProps(checker, props)) {
          this.addFailure(
            this.createFailure(
              node.expression.getStart(),
              node.expression.getWidth(),
              Rule.REACT_MEMO_FAILURE_STRING
            )
          )
        }
      }
    }

    super.visitCallExpression(node)
  }

  public visitClassDeclaration(node: ts.ClassDeclaration) {
    if (node.heritageClauses && node.heritageClauses.length === 1) {
      const heritageClause = node.heritageClauses[0]
      if (heritageClause.types.length === 1) {
        const clause = heritageClause.types[0]
        if (
          ts.isExpressionWithTypeArguments(clause) &&
          ts.isPropertyAccessExpression(clause.expression) &&
          ts.isIdentifier(clause.expression.expression) &&
          clause.expression.expression.text === "React" &&
          ts.isIdentifier(clause.expression.name) &&
          clause.expression.name.text === "PureComponent" &&
          clause.typeArguments
        ) {
          const propTypeArgument = clause.typeArguments[0]
          const checker = this.getTypeChecker()
          const props = checker
            .getTypeAtLocation(propTypeArgument)
            .getProperties()
          if (complexProps(checker, props)) {
            this.addFailure(
              this.createFailure(
                clause.getStart(),
                clause.getWidth(),
                Rule.REACT_PURE_COMPONENT_FAILURE_STRING
              )
            )
          }
        }
      }
    }

    super.visitClassDeclaration(node)
  }
}
