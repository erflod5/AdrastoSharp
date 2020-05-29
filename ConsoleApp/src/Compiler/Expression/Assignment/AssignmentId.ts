import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types } from "../../Utils/Type";
import { Symbol } from "../../SymbolTable/Symbol";

export class AssignmentId extends Expression {
    private id: string;
    private anterior: Expression | null;

    constructor(id: string, anterior: Expression | null, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.anterior = anterior;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        if (this.anterior == null) {
            const symbol = enviorement.getVar(this.id);
            if (symbol == null) throw new Error(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);

            if (symbol.isGlobal) {
                return new Retorno(symbol.position + '', false, symbol.type, symbol);
            }
            else if (symbol.isRef) {
                //TODO variables por referencia
            }
            else {
                const temp = generator.newTemporal();
                generator.addExpression(temp, 'p', symbol.position, '+');
                return new Retorno(temp, true, symbol.type, symbol);
            }
        }
        else {
            const anterior = this.anterior.compile(enviorement);
            const symStruct = anterior.type.struct;
            if (anterior.type.type != Types.STRUCT)
                throw new Error(this.line, this.column, 'Semantico', `Acceso no valido para el tipo ${anterior.type.type}`);

            const attribute = symStruct?.getAttribute(this.id) || anterior.type.struct?.getAttribute(this.id);
            if (attribute == undefined || attribute.value == null)
                throw new Error(this.line, this.column, 'Semantico', `El struct ${symStruct?.identifier} no tiene el atributo ${this.id}`);

            const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
            const temp = generator.newTemporal();
            if (anterior.symbol != null && !anterior.symbol.isHeap) {
                //TODO variables por referencia
                generator.addGetStack(tempAux, anterior.getValue());
            }
            else {
                generator.addGetHeap(tempAux, anterior.getValue());
            }

            generator.addExpression(temp,tempAux,attribute.index,'+'); 
            return new Retorno(temp,true,attribute.value.type,new Symbol(attribute.value.type,this.id,attribute.index,false,false,false,true));
        }
        throw new Error(this.line, this.column, 'Semantico', 'Aun no lo hago wey');
    }
}