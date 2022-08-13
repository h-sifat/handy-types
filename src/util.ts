export class EPP extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}
