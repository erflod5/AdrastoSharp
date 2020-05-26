import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";

export class InstrBody extends Instruction {
    private instructions: Array<Instruction> | null;

    constructor(instructions: Array<Instruction> | null, line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    compile(enviorement: Enviorement): any {
        const newEnv = enviorement.actualFunc == null ? new Enviorement(enviorement) : enviorement;
        this.instructions?.forEach((instruction)=>{
            try {
                instruction.compile(newEnv);
            } catch (error) {
                console.log(error);
            }
        });
    }
}