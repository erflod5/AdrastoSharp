import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";

export class Return extends Instruction {
    private value: Expression | null;

    constructor(value: Expression | null, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(enviorement: Enviorement) : void{
        //TODO return values
    }
}