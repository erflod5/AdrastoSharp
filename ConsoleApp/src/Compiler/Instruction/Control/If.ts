import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class If extends Instruction {
    private condition: Expression;
    private instruction: Instruction;
    private elseI: Instruction | null;

    constructor(condition: Expression, instruction: Instruction, elseI: Instruction | null, line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instruction = instruction;
        this.elseI = elseI;
    }

    compile(enviorement: Enviorement) : void{
        const generator = Generator.getInstance();
        generator.addComment('Inicia If');
        const condition = this.condition?.compile(enviorement);
        const newEnv = new Enviorement(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            generator.addLabel(condition.trueLabel);
            this.instruction.compile(newEnv);
            if(this.elseI != null){
                const tempLbl = generator.newLabel();
                generator.addGoto(tempLbl);
                generator.addLabel(condition.falseLabel);
                this.elseI.compile(enviorement);
                generator.addLabel(tempLbl);
            }
            else{
                generator.addLabel(condition.falseLabel);
            }
            return;
        }
        throw new Error(this.line,this.column,'Semantico',`La condicion no es booleana: ${condition?.type.type}`);
    }
}