import { Enviorement } from "../SymbolTable/Enviorement";
import { Retorno } from "../Utils/Retorno";

export abstract class Expression{
    trueLabel : string;
    falseLabel : string;
    line: number;
    column : number;

    constructor(line: number, column: number){
        this.trueLabel = this.falseLabel = '';
        this.line = line;
        this.column = column;
    }

    public abstract compile(env: Enviorement) : Retorno;
}