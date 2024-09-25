"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTypeDeclaration = parseTypeDeclaration;
exports.parseType = parseType;
exports.parseTypeAliasDeclaration = parseTypeAliasDeclaration;
exports.parseTypeNode = parseTypeNode;
const ts = __importStar(require("typescript"));
const extractTypes_1 = require("./utils/extractTypes");
function parseProperty(node) {
    if (ts.isArrayTypeNode(node)) {
        return node.elementType.getText() + "[]";
    }
    if (ts.isTypeReferenceNode(node)) {
        // This can be another type or something else
        return node.typeName.getText();
    }
    if (ts.isTypeQueryNode(node)) {
        // since this is a type query EX: typeof value, this will return a string
        return "string";
    }
    if (ts.isToken(node) && ts.isTokenKind(node.kind)) {
        return node.getText();
    }
    if (ts.isUnionTypeNode(node)) {
        let union = {
            text: node.getText(),
            type: [],
        };
        node.forEachChild((n) => {
            if (ts.isTypeLiteralNode(n)) {
                union.type.push(n.getText());
                return;
            }
            else if (ts.isToken(n)) {
                union.type.push(n.getText());
                return;
            }
            else if (ts.isTypeReferenceNode(n)) {
                union.type.push(n.typeName.getText());
                return;
            }
            union.type.push(n.getText());
        });
        return union;
    }
    if (ts.isFunctionTypeNode(node)) {
        return {
            type: "function",
            text: node.getText(),
        };
    }
    else if (ts.isTypeLiteralNode(node)) {
        const propTypes = {};
        node.members.forEach((param) => {
            if (ts.isPropertySignature(param) && param.name) {
                propTypes[param.name.getText()] = parsePropertySignature(param);
                return;
            }
        });
        return propTypes;
    }
    return {
        type: "Unknown Type Property",
        text: node.getText(),
    };
}
function parsePropertySignature(node) {
    // Determine the type of the node, or set it to "unknown Type" if not available
    const nodeType = node.type
        ? parseProperty(node.type)
        : {
            type: "unknown Type",
            text: node.getText(),
        };
    // Check if the node is optional
    const optional = !!node.questionToken;
    // Return the TypeDeclaration object
    return {
        optional: optional,
        type: nodeType,
        text: node.getText(),
    };
}
function parseTypeDeclaration(node) {
    return {
        name: "tmp",
        implementation: {},
        optional: true,
        type: "",
        text: "",
    };
}
// Parses Objects to JsonImplemations
function parseType(node) {
    let implementation = {};
    // console.log(node.kind, node.getText());
    return implementation;
}
/**
 * Creates a type declaration of the key:value pairs
 * type CarYear = number
 * type CarType = string
 * type CarModel = string
 * type Car = {
 *  year: CarYear,
 *  type: CarType,
 *  model: CarModel
 * }
 * @param node
 */
function parseTypeAliasDeclaration(node) {
    //no need to parse through the members assume name to be type
    const nodeName = node.name.getText();
    let implementation = {};
    // Single object declaration means
    node.type.forEachChild((param) => {
        // Update the parsing here to only parse the name
        const paramName = param.getText().split(":")[0] || "unknown";
        // use if not able to parse
        const paramType = param.getText() ? (0, extractTypes_1.extractTypeFromString)(param.getText()) : "any";
        const optional = paramName.includes("?");
        if (!param.getText().includes(":")) {
            // is not a type property
            implementation[paramName] = parseProperty(param);
            return;
        }
        if (ts.isTypeLiteralNode(param)) {
            // property is a literal
            // ex: type car = "honda"
            implementation = parseProperty(param);
            return;
        }
        if (ts.isPropertySignature(param)) {
            implementation[param.name.getText()] = parsePropertySignature(param);
            return;
        }
        // dont parse the node just use the name
        if (ts.isTypeNode(param) || ts.isTypeAliasDeclaration(param)) {
            // let paramType = parseTypeNode(param);
            implementation[paramName] = param.getText();
            return;
        }
        implementation[paramName] = {
            optional: optional,
            type: paramType,
            text: param.getText(),
        };
    });
    return {
        name: nodeName,
        implementation: implementation,
        text: node.getText(),
    };
}
function parseTypeNode(node) {
    // Check if the node is a TypeAliasDeclaration and has a name
    if (ts.isTypeAliasDeclaration(node) && node.name) {
        const typeDeclaration = parseTypeAliasDeclaration(node);
        // If no implementation details were added, handle it as a possible assignment
        if (Object.keys(typeDeclaration.implementation).length === 0) {
            // Example: export type Action = 'prev' | 'prev2' | 'next' | 'next2' | 'onChange' | 'drillUp' | 'drillDown';
            const nodeName = node.getText().split(":")[0] || "unknown";
            const nodeType = parseProperty(node.type);
            const optional = nodeName.includes("?");
            return {
                name: node.name.getText(),
                implementation: {},
                optional: optional,
                type: nodeType,
                text: node.getText(),
            };
        }
        return typeDeclaration;
    }
    else if (ts.isTypeNode(node)) {
        // If the node is a TypeNode, parse it directly
        return parseTypeDeclaration(node);
    }
    else {
        // Handle the case where the node is neither a TypeNode nor a TypeAliasDeclaration
        let erroredUnableToParse = {
            text: node.getText(),
            implementation: {},
            name: "Error Unable to Parse node Not type or interface",
        };
        return erroredUnableToParse;
    }
}
