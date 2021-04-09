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
                return type1.typeId.toLocaleLowerCase() === type2.typeId.toLocaleLowerCase() && type1.dimension == type2.dimension;
            }
            return type1.dimension == type2.dimension;
        }
        else if(type1.type == Types.STRUCT || type2.type == Types.STRUCT || type1.type == Types.ARRAY || type2.type == Types.ARRAY){
            if(type1.type == Types.NULL || type2.type == Types.NULL){
                return true;
            }
            else if(type1.type == Types.ARRAY){
                return type1.dimension > 0;
            }
            else if( type2.type == Types.ARRAY){
                return type1.dimension > 0;
            }
        }
        return false;
    }
}