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
        if (symbol?.isGlobal) {
            if (target.type.type == Types.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetStack(symbol.position, '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetStack(symbol.position, '0');
                generator.addLabel(templabel);
            }
            else {
                generator.addSetStack(symbol.position, value.getValue());
            }
        }
        else if (symbol?.isRef) {
            //TODO variables por referencia
        }
        else if (symbol?.isHeap) {
            if (target.type.type == Types.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetHeap(symbol.position, '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetHeap(symbol.position, '0');
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