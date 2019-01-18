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
var ruleUtils_1 = require("../ruleUtils");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoPointlessComputedPropertyNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "No pointless computed property names. Remove the surrounding [].";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoPointlessComputedPropertyNameWalker = /** @class */ (function (_super) {
    __extends(NoPointlessComputedPropertyNameWalker, _super);
    function NoPointlessComputedPropertyNameWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoPointlessComputedPropertyNameWalker.prototype.visitPropertyAssignment = function (node) {
        if (ts.isComputedPropertyName(node.name) &&
            ruleUtils_1.isValidPropertyName(node.name)) {
            this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitPropertyAssignment.call(this, node);
    };
    return NoPointlessComputedPropertyNameWalker;
}(Lint.RuleWalker));
