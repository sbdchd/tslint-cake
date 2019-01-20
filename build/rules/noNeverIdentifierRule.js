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
        return this.applyWithWalker(new NoNeverIdentifierRuleWalker(sourceFile, this.getOptions(), program));
    };
    Rule.FAILURE_STRING = "No never identifier";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
var NoNeverIdentifierRuleWalker = /** @class */ (function (_super) {
    __extends(NoNeverIdentifierRuleWalker, _super);
    function NoNeverIdentifierRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoNeverIdentifierRuleWalker.prototype.visitIdentifier = function (node) {
        if (node.text === "name") {
            var nodeType = this.getTypeChecker().getTypeAtLocation(node);
            if (nodeType.flags === ts.TypeFlags.Never) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
            _super.prototype.visitIdentifier.call(this, node);
        }
    };
    return NoNeverIdentifierRuleWalker;
}(Lint.ProgramAwareRuleWalker));
