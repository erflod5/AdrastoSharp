import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class While extends Instruction {
    private condition: Expression;
    private instruction: Instruction;

    constructor(condition: Expression, instruction: Instruction, line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instruction = instruction;
    }

    compile(enviorement: Enviorement) : void{
        const generator = Generator.getInstance();
        const newEnv = new Enviorement(enviorement);
        const lblWhile = generator.newLabel();
        generator.addLabel(lblWhile);
        const condition = this.condition.compile(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            const breakLabel = generator.newLabel();
            const continueLabel = generator.newLabel();
            newEnv.break = breakLabel;
            newEnv.continue = continueLabel;
            generator.addLabel(condition.trueLabel);
            this.instruction.compile(newEnv);
            generator.addGoto(lblWhile);
            generator.addLabel(condition.falseLabel);
            return;
        }
        throw new Error(this.line,this.column,'Semantico',`La condicion no es booleana: ${condition?.type.type}`);
    }
}