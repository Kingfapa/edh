export interface Session {
  userID: string;
  username: string;
  connected: boolean;
}

class InMemorySessionStore {
  sessions = new Map<string, Session>();

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: Session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

export { InMemorySessionStore };
