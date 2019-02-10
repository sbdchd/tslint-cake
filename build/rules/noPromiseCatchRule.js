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
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoPromiseCatchWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "No promise catch. Instead of throwing an error, use a union or result type.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoPromiseCatchWalker = /** @class */ (function (_super) {
    __extends(NoPromiseCatchWalker, _super);
    function NoPromiseCatchWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoPromiseCatchWalker.prototype.visitPropertyAccessExpression = function (node) {
        var ident = node.name;
        if (ident.text === "catch") {
            this.addFailure(this.createFailure(ident.getStart(), ident.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    return NoPromiseCatchWalker;
}(Lint.RuleWalker));
