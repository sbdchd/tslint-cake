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
        return this.applyWithWalker(new NoTemplateStringCastWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Using template string as cast. Use String() or .toString() instead.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoTemplateStringCastWalker = /** @class */ (function (_super) {
    __extends(NoTemplateStringCastWalker, _super);
    function NoTemplateStringCastWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoTemplateStringCastWalker.prototype.visitTemplateExpression = function (node) {
        if (node.head.text === "" &&
            node.templateSpans.length === 1 &&
            node.templateSpans[0].literal.text === "") {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitTemplateExpression.call(this, node);
    };
    return NoTemplateStringCastWalker;
}(Lint.RuleWalker));
