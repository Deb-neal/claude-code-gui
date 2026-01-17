import { Entity, EntityId, IEntity } from '../../../shared/domain/types';
export interface ProjectProps extends IEntity {
    name: string;
    path: string;
    lastAccessedAt: Date;
}
export declare class Project extends Entity<ProjectProps> {
    private constructor();
    get name(): string;
    get path(): string;
    get createdAt(): Date;
    get lastAccessedAt(): Date;
    updateLastAccessed(): void;
    static create(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>, id?: EntityId): Project;
    toJSON(): {
        id: string;
        name: string;
        path: string;
        createdAt: number;
        lastAccessedAt: number;
    };
}
