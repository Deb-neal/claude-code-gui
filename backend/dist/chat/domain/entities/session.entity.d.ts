import { Entity, EntityId, IEntity } from '../../../shared/domain/types';
import { Message } from './message.entity';
export interface SessionProps extends IEntity {
    projectId: string;
    messages: Message[];
}
export declare class Session extends Entity<SessionProps> {
    private constructor();
    get projectId(): string;
    get messages(): Message[];
    get createdAt(): Date;
    get updatedAt(): Date;
    addMessage(message: Message): void;
    static create(props: Omit<SessionProps, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, id?: EntityId): Session;
    toJSON(): {
        id: string;
        projectId: string;
        messages: {
            id: string;
            sessionId: string;
            role: import("./message.entity").MessageRole;
            content: string;
            timestamp: number;
        }[];
        createdAt: number;
        updatedAt: number;
    };
}
