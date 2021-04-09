import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";

export class AccessArray extends Expression {
    private index: Expression;
    private anterior: Expression;

    constructor(index : Expression, anterior: Expression, line: number, column: number) {
        super(line, column);
        this.index = index;
        this.anterior = anterior;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        const anterior = this.anterior.compile(enviorement);
        const index = this.index.compile(enviorement);

        if (anterior.type.dimension == 0)
            throw new Error(this.line, this.column, 'Semantico', `No es un arreglo`);
        
        if(index.type.type != Types.INTEGER || index.type.dimension != 0)
            throw new Error(this.line, this.column, 'Semantico', 'No es un entero');

        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
        const temp = generator.newTemporal();

        generator.addExpression(tempAux, anterior.getValue(), index.getValue(), '+');
        generator.addExpression(tempAux, tempAux, '1', '+');

        generator.addGetHeap(temp, tempAux); //Trae el valor del heap
        return new Retorno(temp, true, new Type(anterior.type.type, anterior.type.typeId, anterior.type.dimension - 1));    
    }
}