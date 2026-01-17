/**
 * 공통 도메인 타입 정의
 */

export type EntityId = string;

export interface IEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class Entity<T extends IEntity> {
  protected readonly _id: EntityId;
  protected props: T;

  constructor(props: T, id?: EntityId) {
    this._id = id || this.generateId();
    this.props = props;
  }

  get id(): EntityId {
    return this._id;
  }

  public equals(entity?: Entity<T>): boolean {
    if (!entity) {
      return false;
    }
    return this._id === entity._id;
  }

  private generateId(): EntityId {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
