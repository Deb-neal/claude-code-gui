export type FileType = 'file' | 'directory';
export interface FileNodeProps {
    name: string;
    path: string;
    type: FileType;
    children?: FileNodeProps[];
}
export declare class FileNode {
    private readonly _name;
    private readonly _path;
    private readonly _type;
    private readonly _children?;
    private constructor();
    get name(): string;
    get path(): string;
    get type(): FileType;
    get children(): FileNode[] | undefined;
    isDirectory(): boolean;
    isFile(): boolean;
    static create(props: FileNodeProps): FileNode;
    static createFile(name: string, path: string): FileNode;
    static createDirectory(name: string, path: string, children?: FileNode[]): FileNode;
    toJSON(): FileNodeProps;
}
