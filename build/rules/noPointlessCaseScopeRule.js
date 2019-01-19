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
        return this.applyWithWalker(new NoPointlessComputedPropertyNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "No pointless case scope. Remove the surrounding {}.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoPointlessComputedPropertyNameWalker = /** @class */ (function (_super) {
    __extends(NoPointlessComputedPropertyNameWalker, _super);
    function NoPointlessComputedPropertyNameWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoPointlessComputedPropertyNameWalker.prototype.visitCaseClause = function (node) {
        if (node.statements.length > 0) {
            var firstStmt = node.statements[0];
            if (ts.isBlock(firstStmt) &&
                firstStmt.statements.length === 1 &&
                ts.isReturnStatement(firstStmt.statements[0])) {
                this.addFailure(this.createFailure(firstStmt.getStart(), firstStmt.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitCaseClause.call(this, node);
    };
    return NoPointlessComputedPropertyNameWalker;
}(Lint.RuleWalker));
