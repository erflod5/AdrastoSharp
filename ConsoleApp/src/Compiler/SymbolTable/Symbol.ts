import { Type, Types } from "../Utils/Type";

export class Symbol {
    type: Type;
    identifier: string;
    position: number;
    isConst: boolean;
    isGlobal: boolean;
    isHeap: boolean;

    constructor(type: Type, identifier: string, position: number, isConst: boolean, isGlobal: boolean, isHeap: boolean = false) {
        this.type = type;
        this.identifier = identifier;
        this.position = position;
        this.isConst = isConst;
        this.isGlobal = isGlobal;
        this.isHeap = isHeap;
    }
}