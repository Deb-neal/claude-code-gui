import { Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../domain/interfaces/session.repository.interface';
import { Session } from '../domain/entities/session.entity';
import { Result } from '../../shared/domain/result';

/**
 * In-Memory Session Repository
 */
@Injectable()
export class SessionRepository implements ISessionRepository {
  private readonly sessions: Map<string, Session> = new Map();

  async save(session: Session): Promise<Result<Session>> {
    try {
      this.sessions.set(session.id, session);
      return Result.ok(session);
    } catch (error) {
      return Result.fail(`Failed to save session: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Result<Session>> {
    const session = this.sessions.get(id);
    if (!session) {
      return Result.fail(`Session not found: ${id}`);
    }
    return Result.ok(session);
  }

  async findByProjectId(projectId: string): Promise<Result<Session[]>> {
    const sessions = Array.from(this.sessions.values()).filter(
      (session) => session.projectId === projectId,
    );
    return Result.ok(sessions);
  }

  async delete(id: string): Promise<Result<void>> {
    if (!this.sessions.has(id)) {
      return Result.fail(`Session not found: ${id}`);
    }
    this.sessions.delete(id);
    return Result.ok();
  }
}
