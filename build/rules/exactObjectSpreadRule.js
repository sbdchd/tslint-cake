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
    Rule.FAILURE_STRING = "Object spread must be exact.";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function validProps(typeProps, props) {
    if (typeProps.size !== props.size) {
        return false;
    }
    props.forEach(function (p) {
        if (!typeProps.has(p)) {
            return false;
        }
    });
    return true;
}
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.prototype.visitObjectLiteralExpression = function (node) {
        // General idea here is that we find a spread assignment, then we check if
        // the properties in the spread all exist on the object being spread
        if (node.properties.some(ts.isSpreadAssignment)) {
            var spreadNode = node.properties.find(ts.isSpreadAssignment);
            if (spreadNode &&
                (ts.isIdentifier(spreadNode.expression) ||
                    ts.isPropertyAccessExpression(spreadNode.expression))) {
                var checker = this.getTypeChecker();
                var typeProperties = new Set(checker
                    .getTypeAtLocation(spreadNode.expression)
                    .getProperties()
                    .map(function (x) { return x.escapedName.toString(); }));
                var actualProperties = new Set(checker
                    .getTypeAtLocation(node)
                    .getProperties()
                    .map(function (x) { return x.escapedName.toString(); }));
                if (!validProps(typeProperties, actualProperties)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }
        _super.prototype.visitObjectLiteralExpression.call(this, node);
    };
    return Walker;
}(Lint.ProgramAwareRuleWalker));
