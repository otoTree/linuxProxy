import * as pty from 'node-pty';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  id: string;
  process: pty.IPty;
  buffer: string;
  lastActivity: number;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // 定期清理过期会话
    setInterval(() => this.cleanupSessions(), 60 * 1000);
  }

  createSession(): string {
    const shell = process.env.SHELL || 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.cwd(),
      env: process.env as any
    });

    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      process: ptyProcess,
      buffer: '',
      lastActivity: Date.now()
    };

    ptyProcess.onData((data) => {
      session.buffer += data;
      session.lastActivity = Date.now();
    });

    ptyProcess.onExit(() => {
      this.sessions.delete(sessionId);
    });

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  write(sessionId: string, data: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.process.write(data);
    session.lastActivity = Date.now();
    return true;
  }

  read(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    const data = session.buffer;
    session.buffer = ''; // 清空缓冲区
    session.lastActivity = Date.now();
    return data;
  }

  resize(sessionId: string, cols: number, rows: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.process.resize(cols, rows);
    return true;
  }

  destroy(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.process.kill();
    this.sessions.delete(sessionId);
    return true;
  }

  private cleanupSessions() {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        console.log(`Cleaning up inactive session: ${id}`);
        session.process.kill();
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionManager = new SessionManager();
