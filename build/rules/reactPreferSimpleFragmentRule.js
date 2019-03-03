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
        return this.applyWithWalker(new ReactPreferSimpleFragmentWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Prefer simple React fragments. Use <></> instead of <React.Fragment></React.Fragment>";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactPreferSimpleFragmentWalker = /** @class */ (function (_super) {
    __extends(ReactPreferSimpleFragmentWalker, _super);
    function ReactPreferSimpleFragmentWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactPreferSimpleFragmentWalker.prototype.visitJsxElement = function (node) {
        var tagName = node.openingElement.tagName;
        var badFragment = ts.isPropertyAccessExpression(tagName) &&
            ts.isIdentifier(tagName.expression) &&
            ts.isIdentifier(tagName.name) &&
            tagName.expression.text === "React" &&
            tagName.name.text === "Fragment";
        if (badFragment) {
            var fixOpeningEl = new Lint.Replacement(tagName.getStart(), tagName.getWidth(), "");
            var closingEl = node.closingElement.tagName;
            var fixClosingEl = new Lint.Replacement(closingEl.getStart(), closingEl.getWidth(), "");
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING, [fixOpeningEl, fixClosingEl]));
        }
        _super.prototype.visitJsxElement.call(this, node);
    };
    return ReactPreferSimpleFragmentWalker;
}(Lint.RuleWalker));
