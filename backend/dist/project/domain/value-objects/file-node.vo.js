"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNode = void 0;
class FileNode {
    _name;
    _path;
    _type;
    _children;
    constructor(props) {
        this._name = props.name;
        this._path = props.path;
        this._type = props.type;
        this._children = props.children?.map(child => FileNode.create(child));
        Object.freeze(this);
    }
    get name() {
        return this._name;
    }
    get path() {
        return this._path;
    }
    get type() {
        return this._type;
    }
    get children() {
        return this._children;
    }
    isDirectory() {
        return this._type === 'directory';
    }
    isFile() {
        return this._type === 'file';
    }
    static create(props) {
        return new FileNode(props);
    }
    static createFile(name, path) {
        return new FileNode({ name, path, type: 'file' });
    }
    static createDirectory(name, path, children) {
        return new FileNode({ name, path, type: 'directory', children });
    }
    toJSON() {
        return {
            name: this._name,
            path: this._path,
            type: this._type,
            children: this._children?.map((child) => child.toJSON()),
        };
    }
}
exports.FileNode = FileNode;
//# sourceMappingURL=file-node.vo.js.map