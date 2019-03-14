"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    };
    Rule.REACT_MEMO_FAILURE_STRING = "`React.Memo` uses a shallow compare by default. Consider providing a custom compare function to `React.Memo` as a second argument.";
    Rule.REACT_PURE_COMPONENT_FAILURE_STRING = "`React.PureComponent` uses a shallow compare. Either use `React.Memo` or extend `React.Component` and override `shouldComponentUpdate()`";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function complexProps(checker, props) {
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var p = props_1[_i];
        var nodeType = checker.getTypeAtLocation(p.declarations[0]);
        // tslint:disable-next-line:no-bitwise
        if (nodeType.flags & ts.TypeFlags.Object) {
            return true;
        }
    }
    return false;
}
/**
 * get type of function arg for ts.ArrowFunction, ts.FunctionExpression,
 * ts.FunctionDeclaration
 */
function getArgType(checker, arg) {
    if (ts.isIdentifier(arg)) {
        var declarations = checker.getTypeAtLocation(arg).symbol.declarations;
        if (declarations) {
            var declaration = declarations[0];
            if (ts.isFunctionDeclaration(declaration) && declaration.parameters) {
                return declaration.parameters[0].type;
            }
        }
    }
    if ((ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) &&
        arg.parameters) {
        return arg.parameters[0].type;
    }
    return undefined;
}
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.prototype.visitCallExpression = function (node) {
        if (ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.expression) &&
            node.expression.expression.text === "React" &&
            ts.isIdentifier(node.expression.name) &&
            node.expression.name.text === "memo" &&
            node.arguments.length === 1) {
            var firstArg = node.arguments[0];
            var checker = this.getTypeChecker();
            var argType = getArgType(checker, firstArg);
            if (argType) {
                var props = checker.getTypeAtLocation(argType).getProperties();
                if (complexProps(checker, props)) {
                    this.addFailure(this.createFailure(node.expression.getStart(), node.expression.getWidth(), Rule.REACT_MEMO_FAILURE_STRING));
                }
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    Walker.prototype.visitClassDeclaration = function (node) {
        if (node.heritageClauses && node.heritageClauses.length === 1) {
            var heritageClause = node.heritageClauses[0];
            if (heritageClause.types.length === 1) {
                var clause = heritageClause.types[0];
                if (ts.isExpressionWithTypeArguments(clause) &&
                    ts.isPropertyAccessExpression(clause.expression) &&
                    ts.isIdentifier(clause.expression.expression) &&
                    clause.expression.expression.text === "React" &&
                    ts.isIdentifier(clause.expression.name) &&
                    clause.expression.name.text === "PureComponent" &&
                    clause.typeArguments) {
                    var propTypeArgument = clause.typeArguments[0];
                    var checker = this.getTypeChecker();
                    var props = checker
                        .getTypeAtLocation(propTypeArgument)
                        .getProperties();
                    if (complexProps(checker, props)) {
                        this.addFailure(this.createFailure(clause.getStart(), clause.getWidth(), Rule.REACT_PURE_COMPONENT_FAILURE_STRING));
                    }
                }
            }
        }
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    return Walker;
}(Lint.ProgramAwareRuleWalker));
