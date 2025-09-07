export interface Message {
  id: number | string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: "real" | "fake" | "uncertain";
}