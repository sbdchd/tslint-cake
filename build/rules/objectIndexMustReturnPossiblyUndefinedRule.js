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
    Rule.FAILURE_STRING = "Value of an object index is possibly undefined. Add `undefined` to the key's value type.";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function isPossiblyUndefined(node, checker) {
    var nodeType = checker.getTypeAtLocation(node);
    if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
        return true;
    }
    if (ts.isUnionTypeNode(node)) {
        return node.types.some(function (x) { return isPossiblyUndefined(x, checker); });
    }
    else if (nodeType.isUnionOrIntersection() &&
        nodeType.types.some(function (x) { return x.flags === ts.TypeFlags.Undefined; })) {
        return true;
    }
    return false;
}
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.prototype.visitIndexSignatureDeclaration = function (node) {
        if (node.type) {
            var checker = this.getTypeChecker();
            if (!isPossiblyUndefined(node.type, checker)) {
                this.addFailure(this.createFailure(node.type.getStart(), node.type.getWidth(), Rule.FAILURE_STRING));
            }
            _super.prototype.visitIndexSignatureDeclaration.call(this, node);
        }
    };
    return Walker;
}(Lint.ProgramAwareRuleWalker));
