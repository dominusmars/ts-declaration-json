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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleDeclarations = getModuleDeclarations;
const ts = __importStar(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const parseInterfaceNode_1 = require("./parseInterfaceNode");
const parseTypeNode_1 = require("./parseTypeNode");
function getModuleDeclarations(modulePath) {
    const files = fs_1.default.readdirSync(modulePath);
    const props = {};
    files.forEach((file) => {
        const filePath = path_1.default.join(modulePath, file);
        if (fs_1.default.statSync(filePath).isDirectory()) {
            let basename = path_1.default.basename(filePath);
            props[basename] = getModuleDeclarations(filePath);
            return;
        }
        const fileContent = fs_1.default.readFileSync(filePath, "utf-8");
        const sourceFile = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);
        ts.forEachChild(sourceFile, (node) => {
            if (ts.isInterfaceDeclaration(node) && node.name) {
                props[node.name.getText()] = (0, parseInterfaceNode_1.parseInterfaceNode)(node);
            }
            if (ts.isTypeAliasDeclaration(node) && node.name) {
                props[node.name.getText()] = (0, parseTypeNode_1.parseTypeNode)(node);
            }
            if (ts.isTypeNode(node)) {
                if (!node.name) {
                    // check parent for name
                    if (ts.isTypeAliasDeclaration(node.parent)) {
                        props[node.parent.name.getText()] = (0, parseTypeNode_1.parseTypeNode)(node);
                    }
                    else {
                        // Unable to find name just use node text
                        // props[node.getText()] = parseTypeNode(node);
                    }
                }
                else
                    props[node.name.getText()] = (0, parseTypeNode_1.parseTypeNode)(node);
            }
        });
    });
    return props;
}
