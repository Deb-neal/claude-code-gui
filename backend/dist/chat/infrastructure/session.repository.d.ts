import type { ISessionRepository } from '../domain/interfaces/session.repository.interface';
import { Session } from '../domain/entities/session.entity';
import { Result } from '../../shared/domain/result';
export declare class SessionRepository implements ISessionRepository {
    private readonly sessions;
    save(session: Session): Promise<Result<Session>>;
    findById(id: string): Promise<Result<Session>>;
    findByProjectId(projectId: string): Promise<Result<Session[]>>;
    delete(id: string): Promise<Result<void>>;
}
