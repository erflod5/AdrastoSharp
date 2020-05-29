import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";
import { Retorno } from "../../Utils/Retorno";

export class Return extends Instruction {
    private value: Expression | null;

    constructor(value: Expression | null, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        const value = this.value?.compile(enviorement) || new Retorno('0', false, new Type(Types.VOID));
        const symFunc = enviorement.actualFunc;
        const generator = Generator.getInstance();

        if (symFunc == null)
            throw new Error(this.line, this.column, 'Semantico', 'Return fuera de una funcion');

        if (!this.sameType(symFunc.type, value.type))
            throw new Error(this.line, this.column, 'Semantico', `Se esperaba ${symFunc.type.type} y se obtuvo ${value.type.type}`);

        if(symFunc.type.type == Types.BOOLEAN){
            const templabel = generator.newLabel();
            generator.addLabel(value.trueLabel);
            generator.addSetStack('p', '1');
            generator.addGoto(templabel);
            generator.addLabel(value.falseLabel);
            generator.addSetStack('p', '0');
            generator.addLabel(templabel);
        } 
        else if (symFunc.type.type != Types.VOID)
            generator.addSetStack('p', value.getValue());

        generator.addGoto(enviorement.return || '');
    }
}