export enum Types{
    INTEGER,
    DOUBLE,
    STRING,
    BOOLEAN,
    CHAR,
    STRUCT,
    ARRAY,
    NULL
}

export class Type{
    type : Types;
    typeId : string;

    constructor(type: Types, typeId: string = ''){
        this.type = type;
        this.typeId = typeId;
    }
}