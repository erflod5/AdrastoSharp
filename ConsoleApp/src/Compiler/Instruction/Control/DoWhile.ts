import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class DoWhile extends Instruction {
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
        generator.addComment('Inicia DoWhile');
        newEnv.continue = this.condition.trueLabel = generator.newLabel();
        newEnv.break = this.condition.falseLabel = generator.newLabel();
        generator.addLabel(this.condition.trueLabel);
        this.instruction.compile(newEnv);
        const condition = this.condition.compile(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            generator.addLabel(condition.falseLabel);
            generator.addComment('Finaliza DoWhile');
            return;
        }
        throw new Error(this.line,this.column,'Semantico',`La condicion no es booleana: ${condition?.type.type}`);
    }
}