/**
 * FileNode Value Object
 * 파일 시스템의 노드를 표현하는 불변 객체
 */
export type FileType = 'file' | 'directory';

export interface FileNodeProps {
  name: string;
  path: string;
  type: FileType;
  children?: FileNodeProps[];
}

export class FileNode {
  private readonly _name: string;
  private readonly _path: string;
  private readonly _type: FileType;
  private readonly _children?: FileNode[];

  private constructor(props: FileNodeProps) {
    this._name = props.name;
    this._path = props.path;
    this._type = props.type;
    this._children = props.children?.map(child => FileNode.create(child));

    Object.freeze(this);
  }

  get name(): string {
    return this._name;
  }

  get path(): string {
    return this._path;
  }

  get type(): FileType {
    return this._type;
  }

  get children(): FileNode[] | undefined {
    return this._children;
  }

  public isDirectory(): boolean {
    return this._type === 'directory';
  }

  public isFile(): boolean {
    return this._type === 'file';
  }

  public static create(props: FileNodeProps): FileNode {
    return new FileNode(props);
  }

  public static createFile(name: string, path: string): FileNode {
    return new FileNode({ name, path, type: 'file' });
  }

  public static createDirectory(name: string, path: string, children?: FileNode[]): FileNode {
    return new FileNode({ name, path, type: 'directory', children });
  }

  public toJSON(): FileNodeProps {
    return {
      name: this._name,
      path: this._path,
      type: this._type,
      children: this._children?.map((child) => child.toJSON()),
    };
  }
}
