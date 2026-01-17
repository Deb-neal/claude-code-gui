import { Entity, EntityId, IEntity } from '../../../shared/domain/types';

/**
 * Project Entity
 * 도메인의 핵심 비즈니스 객체
 */
export interface ProjectProps extends IEntity {
  name: string;
  path: string;
  lastAccessedAt: Date;
}

export class Project extends Entity<ProjectProps> {
  private constructor(props: ProjectProps, id?: EntityId) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        lastAccessedAt: props.lastAccessedAt || new Date(),
      },
      id,
    );
  }

  get name(): string {
    return this.props.name;
  }

  get path(): string {
    return this.props.path;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastAccessedAt(): Date {
    return this.props.lastAccessedAt;
  }

  public updateLastAccessed(): void {
    this.props.lastAccessedAt = new Date();
  }

  public static create(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>, id?: EntityId): Project {
    const now = new Date();
    return new Project(
      {
        ...props,
        id: id || '',
        createdAt: now,
        updatedAt: now,
        lastAccessedAt: now,
      },
      id,
    );
  }

  public toJSON() {
    return {
      id: this._id,
      name: this.name,
      path: this.path,
      createdAt: this.createdAt.getTime(),
      lastAccessedAt: this.lastAccessedAt.getTime(),
    };
  }
}
