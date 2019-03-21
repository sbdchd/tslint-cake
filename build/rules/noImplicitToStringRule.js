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
    Rule.FAILURE_STRING = "null/undefined to string.";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function getNullableBinaryExpressionNode(checker, node) {
    var nodeTypeLeft = checker.getTypeAtLocation(node.left);
    var nodeTypeRight = checker.getTypeAtLocation(node.right);
    if (isNullableOrUndefinedOrObject(nodeTypeLeft)) {
        return node.left;
    }
    if (isNullableOrUndefinedOrObject(nodeTypeRight)) {
        return node.right;
    }
    return null;
}
function isNullableOrUndefinedOrObject(nodeType) {
    // tslint:disable:no-bitwise
    return Boolean(nodeType.flags & ts.TypeFlags.Null ||
        nodeType.flags & ts.TypeFlags.Undefined ||
        nodeType.flags & ts.TypeFlags.Object);
}
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.prototype.visitBinaryExpression = function (node) {
        if (node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            var checker = this.getTypeChecker();
            var maybeNode = getNullableBinaryExpressionNode(checker, node);
            if (maybeNode) {
                this.addFailure(this.createFailure(maybeNode.getStart(), maybeNode.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    Walker.prototype.visitJsxExpression = function (node) {
        if (node.expression) {
            var nodeType = this.getTypeChecker().getTypeAtLocation(node.expression);
            if (isNullableOrUndefinedOrObject(nodeType)) {
                this.addFailure(this.createFailure(node.expression.getStart(), node.expression.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    Walker.prototype.visitCallExpression = function (node) {
        if (ts.isIdentifier(node.expression) &&
            node.expression.text === "String" &&
            node.arguments) {
            var argNode = node.arguments[0];
            var nodeType = this.getTypeChecker().getTypeAtLocation(argNode);
            if (isNullableOrUndefinedOrObject(nodeType)) {
                this.addFailure(this.createFailure(argNode.getStart(), argNode.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    Walker.prototype.visitTemplateExpression = function (node) {
        var _this = this;
        if (node.templateSpans) {
            node.templateSpans.forEach(function (span) {
                var spanType = _this.getTypeChecker().getTypeAtLocation(span.expression);
                if (isNullableOrUndefinedOrObject(spanType)) {
                    _this.addFailure(_this.createFailure(span.expression.getStart(), span.expression.getWidth(), Rule.FAILURE_STRING));
                }
            });
        }
    };
    return Walker;
}(Lint.ProgramAwareRuleWalker));
