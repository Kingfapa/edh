interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "private message": (message: { content: string; to: string }) => void;
}

interface ClientToServerEvents {
  users: (users: { userID: string; username: string }[]) => void;
  "private message": (message: { content: string; from: string }) => void;
  "user connected": (user: { userID: string; username: string }) => void;
  "user disconnected": (userID: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  username: string;
  userID: string;
  sessionID: string;
}
