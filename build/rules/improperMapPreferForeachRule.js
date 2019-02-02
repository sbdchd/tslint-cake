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
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImproperMapPreferForEachWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Improper use of `map`. Use `forEach` instead.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ImproperMapPreferForEachWalker = /** @class */ (function (_super) {
    __extends(ImproperMapPreferForEachWalker, _super);
    function ImproperMapPreferForEachWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImproperMapPreferForEachWalker.prototype.visitExpressionStatement = function (node) {
        if (ts.isCallExpression(node.expression)) {
            var callExpr = node.expression;
            if (ts.isPropertyAccessExpression(callExpr.expression)) {
                var ident = callExpr.expression.name;
                if (ts.isIdentifier(ident) && ident.text === "map") {
                    this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }
        _super.prototype.visitExpressionStatement.call(this, node);
    };
    return ImproperMapPreferForEachWalker;
}(Lint.RuleWalker));
