export class C {
  static run() { this.#priv(); }
  static #priv() { /* 静的プライベート */ }
}

