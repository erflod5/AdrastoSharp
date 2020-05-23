import { Type, Types } from "./Type";

export class Struct extends Type{
    attributes : Map<string,any>;
    size : number;

    constructor(identifier: string, attributes: Map<string,any>){
        super(Types.STRUCT,identifier);
        this.attributes = attributes;
        this.size = this.attributes.size;
    }
}