import { SymbolStruct } from "../SymbolTable/SymbolStruct";

export enum Types{
    INTEGER = "integer",
    DOUBLE = "double",
    STRING = "string",
    BOOLEAN = "boolean",
    CHAR = "char",
    STRUCT = "struct",
    ARRAY = "array",
    NULL = "null",
    VOID = "void"
}

export class Type{
    type : Types;
    typeId : string;
    dimension : number;

    constructor(type: Types, typeId: string = '', dimension : number = 0){
        this.type = type;
        this.typeId = typeId;
        this.dimension = dimension;
     }
}