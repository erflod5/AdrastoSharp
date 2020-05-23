import { Type, Types } from "../Utils/Type";

export class Symbol{
    type : Type;
    identifier : string;
    position : number;
    isConst : boolean;
    isGlobal : boolean;
    isRef : boolean;

    constructor(type: Type, identifier: string, position: number, isConst: boolean, isGlobal: boolean, isRef : boolean){
        this.type = type;
        this.identifier = identifier;
        this.position = position;
        this.isConst = isConst;
        this.isGlobal = isGlobal;
        this.isRef = isRef;
    }
}