import * as ts from "typescript";
import { Implementation, TypeDeclaration } from "./types";
export declare function parseTypeDeclaration(node: ts.TypeNode): TypeDeclaration;
export declare function parseType(node: ts.Node): Implementation;
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
export declare function parseTypeAliasDeclaration(node: ts.TypeAliasDeclaration): TypeDeclaration;
export declare function parseTypeNode(node: ts.TypeNode | ts.TypeAliasDeclaration): TypeDeclaration;
