import { SymbolFunction } from "./SymbolFunction";
import { SymbolStruct } from "./SymbolStruct";
import { Symbol } from "./Symbol";
import { Type, Types } from "../Utils/Type";
import { Error } from "../Utils/Error";
import { FunctionSt } from "../Instruction/Functions/FunctionSt";

export class Enviorement {
    functions: Map<string, SymbolFunction>;
    structs: Map<string, SymbolStruct>;
    vars: Map<string, Symbol>;
    anterior: Enviorement | null;
    size: number;
    break: string | null;
    continue: string | null;
    return: string | null;
    prop : string;
    actualFunc: SymbolFunction | null = null;

    constructor(anterior: Enviorement | null = null) {
        this.functions = new Map();
        this.structs = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
        this.prop = 'main';
    }

    setEnviorementFunc(prop: string, actualFunc : SymbolFunction, ret : string){
        this.size = 1; //1 porque la posicion 0 es para el return
        this.prop = prop;
        this.return = ret;
        this.actualFunc = actualFunc;
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

    public addFunc(func: FunctionSt, uniqueId: string) : boolean{
        if(this.functions.has(func.id.toLowerCase())){
            return false;
        }
        this.functions.set(func.id.toLowerCase(),new SymbolFunction(func,uniqueId));
        return true;
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

    public getFunc(id: string) : SymbolFunction | undefined{
        return this.functions.get(id.toLocaleLowerCase());
    }

    public searchFunc(id: string) : SymbolFunction | null{
        let enviorement : Enviorement | null = this;
        id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.functions.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }

    public structExists(id: string){
        return this.structs.get(id.toLocaleLowerCase()) == undefined;
    }
}