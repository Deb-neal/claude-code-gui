import { Entity, EntityId, IEntity } from '../../../shared/domain/types';
export type MessageRole = 'user' | 'assistant' | 'system';
export interface MessageProps extends IEntity {
    sessionId: string;
    role: MessageRole;
    content: string;
}
export declare class Message extends Entity<MessageProps> {
    private constructor();
    get sessionId(): string;
    get role(): MessageRole;
    get content(): string;
    get createdAt(): Date;
    static create(props: Omit<MessageProps, 'id' | 'createdAt' | 'updatedAt'>, id?: EntityId): Message;
    toJSON(): {
        id: string;
        sessionId: string;
        role: MessageRole;
        content: string;
        timestamp: number;
    };
}
