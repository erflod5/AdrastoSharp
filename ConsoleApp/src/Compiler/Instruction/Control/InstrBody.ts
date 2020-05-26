import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";

export class InstrBody extends Instruction {
    private instructions: Array<Instruction> | null;

    constructor(instructions: Array<Instruction> | null, line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    compile(enviorement: Enviorement): any {
        //TODO bug variables repetidas 
        const newEnv = new Enviorement(enviorement);
        this.instructions?.forEach((instruction)=>{
            try {
                instruction.compile(newEnv);
            } catch (error) {
                console.log(error);
            }
        });
    }
}