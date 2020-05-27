import { Param } from "../Utils/Param";

export class SymbolStruct{
    identifier : string;
    size : number;
    attributes : Array<Param>;

    constructor(identifier: string, size: number,attributs: Array<Param>){
        this.identifier = identifier;
        this.size = size;
        this.attributes = attributs;
    }
}