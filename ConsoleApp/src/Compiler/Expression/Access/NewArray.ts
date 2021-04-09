
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";

export class NewArray extends Expression {
    private size: Expression;

    constructor(size: Expression, line: number, column: number) {
        super(line, column);
        this.size = size;
    }

    compile(enviorement: Enviorement): Retorno {
        const size = this.size.compile(enviorement);
        if (size.type.type != Types.INTEGER)
            throw new Error(this.line, this.column, 'Semantico', 'El tamanio no es de tipo integer');

        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');
        generator.addSetHeap('h', size.getValue());
        generator.addExpression('h', 'h', size.getValue(), '+');
        generator.nextHeap();
        return new Retorno(temp, true, new Type(Types.ARRAY, '', 1));
    }
}