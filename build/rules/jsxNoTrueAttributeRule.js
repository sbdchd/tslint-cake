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
        return this.applyWithWalker(new JsxNoTrueAttributeWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Prefer simple boolean attribute";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var JsxNoTrueAttributeWalker = /** @class */ (function (_super) {
    __extends(JsxNoTrueAttributeWalker, _super);
    function JsxNoTrueAttributeWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsxNoTrueAttributeWalker.prototype.visitJsxAttribute = function (node) {
        if (node.initializer &&
            ts.isJsxExpression(node.initializer) &&
            node.initializer.expression &&
            node.initializer.expression.kind === ts.SyntaxKind.TrueKeyword) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitJsxAttribute.call(this, node);
    };
    return JsxNoTrueAttributeWalker;
}(Lint.RuleWalker));
