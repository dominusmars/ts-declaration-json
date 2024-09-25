"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInterfaceNode = parseInterfaceNode;
const extractTypes_1 = require("./utils/extractTypes");
function parseInterfaceNode(node) {
    const propTypes = {
        name: node.name.getText(),
        implementation: {},
        text: node.getText(),
    };
    node.members.forEach((param) => {
        var _a;
        const paramName = ((_a = param.name) === null || _a === void 0 ? void 0 : _a.getText()) || "unknown";
        const paramType = param.getText() ? (0, extractTypes_1.extractTypeFromString)(param.getText()) : "any";
        const optional = paramName.includes("?");
        propTypes.implementation[paramName] = {
            text: param.getText(),
            optional: optional,
            type: paramType,
        };
    });
    return propTypes;
}
