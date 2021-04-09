import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Type, Types } from "../../Utils/Type";
import { Symbol } from "../../SymbolTable/Symbol";

export class AssignmentArray extends Expression {
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
            throw new Error(this.line, this.column, 'Semantico', `Acceso no valido ya que no es un arreglo`);

        if (index.type.type != Types.INTEGER || index.type.dimension != 0)
            throw new Error(this.line, this.column, 'Semantico', `Index no valido`);

        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
        const temp = generator.newTemporal();

        if (anterior.symbol != null && !anterior.symbol.isHeap) {
            generator.addGetStack(tempAux, anterior.getValue());
        }
        else {
            generator.addGetHeap(tempAux, anterior.getValue());
        }

        generator.addExpression(temp,tempAux,index.getValue(),'+');
        generator.addExpression(temp, temp, '1', '+'); 
        return new Retorno(temp,true, new Type(anterior.type.type, anterior.type.typeId, anterior.type.dimension - 1));
    }
}