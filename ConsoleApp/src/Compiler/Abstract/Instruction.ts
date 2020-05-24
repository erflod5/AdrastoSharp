import { Enviorement } from "../SymbolTable/Enviorement";

export abstract class Instruction{
    line : number;
    column : number;

    constructor(line: number, column: number){
        this.line = line;
        this.column = column;
    }

    public abstract compile(env: Enviorement) : any;
}