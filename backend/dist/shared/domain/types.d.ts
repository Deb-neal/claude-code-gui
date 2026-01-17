export type EntityId = string;
export interface IEntity {
    id: EntityId;
    createdAt: Date;
    updatedAt: Date;
}
export declare abstract class Entity<T extends IEntity> {
    protected readonly _id: EntityId;
    protected props: T;
    constructor(props: T, id?: EntityId);
    get id(): EntityId;
    equals(entity?: Entity<T>): boolean;
    private generateId;
}
