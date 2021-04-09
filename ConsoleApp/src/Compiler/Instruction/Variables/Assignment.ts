import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";

export class Assignment extends Instruction {
    private target: Expression;
    private value: Expression;

    constructor(target: Expression, value: Expression, line: number, column: number) {
        super(line, column);
        this.target = target;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        const target = this.target.compile(enviorement);
        const value = this.value.compile(enviorement);

        const generator = Generator.getInstance();
        const symbol = target.symbol;

        if (!this.sameType(target.type, value.type)) {
            throw new Error(this.line,this.column,'Semantico','Tipos de dato diferentes');
        }

        if(value.type.type == Types.ARRAY){
            const temp = generator.newTemporal(); generator.freeTemp(temp);
            const label1 = generator.newLabel(), label2 = generator.newLabel();
            generator.addExpression(temp, value.getValue(), '1', '+');
            generator.addLabel(label1);
            generator.addIf(temp, 'h', '==', label2);
            if(target.type.dimension == value.type.dimension){
                //Llenar de valores por defecto
                target.type.type != Types.STRING && target.type.type != Types.STRUCT ? generator.addSetHeap(temp, '0') : generator.addSetHeap(temp, '-1');
            }
            else{
                //Llenar de -1
                generator.addSetHeap(temp, '-1');
            }
            generator.addExpression(temp, temp, '1', '+');
            generator.addGoto(label1);
            generator.addLabel(label2);
        }
        
        if (symbol?.isHeap || symbol == null) {
            if (target.type.type == Types.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetHeap(target.getValue(), '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetHeap(target.getValue(), '0');
                generator.addLabel(templabel);
            }
            else {
                generator.addSetHeap(target.getValue(), value.getValue());
            }
        }
        else {
            if (target.type.type == Types.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetStack(target.getValue(), '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetStack(target.getValue(), '0');
                generator.addLabel(templabel);
            }
            else {
                generator.addSetStack(target.getValue(), value.getValue());
            }
        }
        
    }
}