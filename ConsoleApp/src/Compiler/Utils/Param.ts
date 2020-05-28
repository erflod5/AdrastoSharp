import { Type, Types } from "./Type";

export class Param {
    id: string;
    type: Type;

    constructor(id: string, type: Type) {
        this.id = id.toLowerCase();
        this.type = type;
    }

    getUnicType() : string{
        if(this.type.type == Types.STRUCT){
            return this.type.typeId;
        }
        return this.type.type;
    }

    toString() : string{
        return `{id: ${this.id}, type: ${this.type}}`;
    }
}