import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";

export class Print extends Instruction {
    private value: Expression;

    constructor(value: Expression, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        const value = this.value.compile(enviorement);
        const generator = Generator.getInstance();
        switch (value.type.type) {
            case Types.INTEGER:
                generator.addPrint('e', value.getValue());
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
                generator.addNextEnv(enviorement.size);
                generator.addSetStack('p', value.getValue());
                generator.addCall('native_print_str');
                generator.addAntEnv(enviorement.size);
                break;
            case Types.NULL:
                generator.addPrintNull();
                break;
            case Types.STRUCT:
            //TODO print struct
            case Types.ARRAY:
            //TODO print array
        }
    }
}