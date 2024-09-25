import * as ts from "typescript";
import { InterfaceDeclaration } from "../types";
import { extractTypeFromString } from "./utils/extractTypes";
export function parseInterfaceNode(node: ts.InterfaceDeclaration) {
    const propTypes: InterfaceDeclaration = {
        name: node.name.getText(),
        implementation: {},
        text: node.getText(),
    };

    node.members.forEach((param) => {
        const paramName = param.name?.getText() || "unknown";
        const paramType = param.getText() ? extractTypeFromString(param.getText()) : "any";
        const optional = paramName.includes("?");
        propTypes.implementation[paramName] = {
            text: param.getText(),
            optional: optional,
            type: paramType,
        };
    });

    return propTypes;
}
