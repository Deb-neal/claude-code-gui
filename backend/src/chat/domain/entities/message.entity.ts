import { Entity, EntityId, IEntity } from '../../../shared/domain/types';

/**
 * Message Entity
 * 채팅 메시지를 표현하는 도메인 엔티티
 */
export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageProps extends IEntity {
  sessionId: string;
  role: MessageRole;
  content: string;
}

export class Message extends Entity<MessageProps> {
  private constructor(props: MessageProps, id?: EntityId) {
    super(props, id);
  }

  get sessionId(): string {
    return this.props.sessionId;
  }

  get role(): MessageRole {
    return this.props.role;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Omit<MessageProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: EntityId,
  ): Message {
    const now = new Date();
    return new Message(
      {
        ...props,
        id: id || '',
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  public toJSON() {
    return {
      id: this._id,
      sessionId: this.sessionId,
      role: this.role,
      content: this.content,
      timestamp: this.createdAt.getTime(),
    };
  }
}
