import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";

export class Call extends Instruction{
    private call: Expression;

    constructor(call: Expression, line: number, column: number){
        super(line,column);
        this.call = call;
    }

    compile(enviorement: Enviorement){
        const value = this.call.compile(enviorement);
        value.getValue(); //Para limpiar temporal
    }
}