export declare class SelectProjectDto {
    path: string;
}
export declare class ProjectResponseDto {
    id: string;
    name: string;
    path: string;
    createdAt: number;
    lastAccessedAt: number;
}
export declare class FileNodeDto {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNodeDto[];
}
export declare class FileContentDto {
    path: string;
    content: string;
}
