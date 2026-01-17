import { Entity, EntityId, IEntity } from '../../../shared/domain/types';
import { Message } from './message.entity';

/**
 * Session Entity
 * 채팅 세션을 표현하는 도메인 엔티티
 */
export interface SessionProps extends IEntity {
  projectId: string;
  messages: Message[];
}

export class Session extends Entity<SessionProps> {
  private constructor(props: SessionProps, id?: EntityId) {
    super(props, id);
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get messages(): Message[] {
    return this.props.messages;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public addMessage(message: Message): void {
    this.props.messages.push(message);
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<SessionProps, 'id' | 'createdAt' | 'updatedAt' | 'messages'>,
    id?: EntityId,
  ): Session {
    const now = new Date();
    return new Session(
      {
        ...props,
        id: id || '',
        createdAt: now,
        updatedAt: now,
        messages: [],
      },
      id,
    );
  }

  public toJSON() {
    return {
      id: this._id,
      projectId: this.projectId,
      messages: this.messages.map((msg) => msg.toJSON()),
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
    };
  }
}
