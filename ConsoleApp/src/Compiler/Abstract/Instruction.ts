import { Enviorement } from "../SymbolTable/Enviorement";
import { Types, Type } from "../Utils/Type";

export abstract class Instruction{
    line : number;
    column : number;

    constructor(line: number, column: number){
        this.line = line;
        this.column = column;
    }

    public abstract compile(env: Enviorement) : any;

    public sameType(type1: Type, type2: Type) : boolean{
        //TODO casteos implicitos
        if(type1.type == type2.type){
            if(type1.type == Types.STRUCT){
                return type1.typeId === type2.typeId;
            }
            return true;
        }
        return false;
    }
}