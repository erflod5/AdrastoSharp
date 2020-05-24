import { SymbolFunction } from "./SymbolFunction";
import { SymbolStruct } from "./SymbolStruct";
import { Symbol } from "./Symbol";

export class Enviorement{
    functions : Map<string,SymbolFunction>;
    structs: Map<string,SymbolStruct>;
    vars : Map<string,Symbol>;
    anterior : Enviorement | null;
    size : number;
    break : string | null;
    continue : string | null;
    return : string | null;

    constructor(anterior: Enviorement | null = null){
        this.functions = new Map();
        this.structs = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
    }
}