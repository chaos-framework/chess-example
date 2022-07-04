import { CONNECTION, ProcessEffectGenerator } from "@chaos-framework/core";

export async function* initialize(options: any = {}) {
    // create a simple world and add some entities
}
  
export function shutdown(): void { }

export async function* play() {
    // ??
}

export async function* onPlayerConnect(message: CONNECTION) {
    // ??
}

export async function* onPlayerDisconnect(options: any) {
    // ??
}
