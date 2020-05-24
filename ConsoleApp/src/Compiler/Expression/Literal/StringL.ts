import { Expression } from "../../Abstract/Expression";
import { Types, Type } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";

export class StringL extends Expression {
    private type: Types;
    private value: string;

    constructor(type: Types, value: string, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');
        for (let i = 0; i < this.value.length; i++) {
            generator.addSetHeap('h', this.value.charCodeAt(i));
            generator.nextHeap();
        }
        generator.addSetHeap('h', '-1');
        generator.nextHeap();
        return new Retorno(temp, true, new Type(this.type, 'String'));
    }
}