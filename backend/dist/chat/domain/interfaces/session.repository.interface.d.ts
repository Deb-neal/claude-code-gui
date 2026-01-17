import { Session } from '../entities/session.entity';
import { Result } from '../../../shared/domain/result';
export interface ISessionRepository {
    save(session: Session): Promise<Result<Session>>;
    findById(id: string): Promise<Result<Session>>;
    findByProjectId(projectId: string): Promise<Result<Session[]>>;
    delete(id: string): Promise<Result<void>>;
}
export declare const SESSION_REPOSITORY: unique symbol;
