
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";

export class ArrayExpr extends Expression {
    private values : Expression[];

    constructor(values: Expression[], line: number, column: number) {
        super(line, column);
        this.values = values;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        const tempAux = generator.newTemporal();

        let dim = 0;
        let type = Types.NULL;

        generator.addExpression(temp, 'h');
        generator.addExpression(tempAux, temp, '1', '+');
        generator.addSetHeap('h', this.values.length);
        generator.addExpression('h', 'h', this.values.length + 1, '+');

        this.values.forEach((value, index)=>{

            const result = value.compile(enviorement);
            dim = result.type.dimension + 1;
            generator.addSetHeap(tempAux, result.getValue());

            if(index != this.values.length -1)
                generator.addExpression(tempAux, tempAux, '1', '+');
            type = result.type.type;
        });

        generator.freeTemp(tempAux);
        return new Retorno(temp, true, new Type(type, '', dim))
    }
}