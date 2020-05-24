import { SymbolFunction } from "./SymbolFunction";
import { SymbolStruct } from "./SymbolStruct";
import { Symbol } from "./Symbol";
import { Type } from "../Utils/Type";
import { Error } from "../Utils/Error";

export class Enviorement {
    functions: Map<string, SymbolFunction>;
    structs: Map<string, SymbolStruct>;
    vars: Map<string, Symbol>;
    anterior: Enviorement | null;
    size: number;
    break: string | null;
    continue: string | null;
    return: string | null;

    constructor(anterior: Enviorement | null = null) {
        this.functions = new Map();
        this.structs = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
    }

    public addVar(id: string, type: Type, isConst: boolean, isRef: boolean): Symbol | null {
        id = id.toLowerCase();
        if (this.vars.get(id) != undefined) {
            return null;
        }
        const newVar = new Symbol(type, id, this.size++, isConst, this.anterior == null, isRef)
        this.vars.set(id, newVar);
        return newVar;
    }

    public getVar(id: string) : Symbol | null{
        let enviorement : Enviorement | null = this;
        id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.vars.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }
}