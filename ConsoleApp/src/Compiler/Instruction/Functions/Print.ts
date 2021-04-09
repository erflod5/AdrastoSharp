import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class Print extends Instruction {
    private value: Expression;
    private isLine: boolean;

    constructor(value: Expression, isLine: boolean, line: number, column: number) {
        super(line, column);
        this.value = value;
        this.isLine = isLine;
    }

    compile(enviorement: Enviorement): void {
        const value = this.value.compile(enviorement);
        const generator = Generator.getInstance();
        switch (value.type.type) {
            case Types.INTEGER:
                generator.addPrint('i', value.getValue());
                break;
            case Types.DOUBLE:
                generator.addPrint('d', value.getValue());
                break;
            case Types.CHAR:
                generator.addPrint('c', value.getValue());
                break;
            case Types.BOOLEAN:
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addPrintTrue();
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addPrintFalse();
                generator.addLabel(templabel);
                break;
            case Types.STRING:
                generator.addExpression('T1', value.getValue());
                generator.addCall('native_print_str');
                break;
            case Types.NULL:
                generator.addPrintNull();
                break;
            default: 
                throw new Error(this.line,this.column,'Semantico',`No se puede imprimir el tipo de dato ${value.type.type}`);
        }
        if(this.isLine){
            generator.addPrint('c',10);
        }
    }
}