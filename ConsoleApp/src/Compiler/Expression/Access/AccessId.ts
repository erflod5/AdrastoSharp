import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";
import { Symbol } from "../../SymbolTable/Symbol";

export class AccessId extends Expression {
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
            let symbol = enviorement.getVar(this.id);
            if (symbol == null) {
                throw new Error(this.line, this.column, 'Semantico', `No existe la variable: ${this.id}`);
            }
            const temp = generator.newTemporal();
            if (symbol.isGlobal) {
                generator.addGetStack(temp, symbol.position);
                if (symbol.type.type != Types.BOOLEAN) return new Retorno(temp, true, symbol.type, symbol);

                const retorno = new Retorno('', false, symbol.type,symbol);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp, '1', '==', this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
            else {
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                generator.addExpression(tempAux, 'p', symbol.position, '+');
                generator.addGetStack(temp, tempAux);
                if (symbol.type.type != Types.BOOLEAN) return new Retorno(temp, true, symbol.type, symbol);

                const retorno = new Retorno('', false, symbol.type);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp, '1', '==', this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
        }
        else {
            //TODO faltan booleanos
            const anterior = this.anterior.compile(enviorement);
            const symStruct = enviorement.getStruct(anterior.type.typeId);
            if (anterior.type.type != Types.STRUCT || symStruct == null)
                throw new Error(this.line, this.column, 'Semantico', `Acceso no valido para el tipo ${anterior.type.type}`);
            const attribute = symStruct.getAttribute(this.id);
            if (attribute.value == null)
                throw new Error(this.line, this.column, 'Semantico', `El struct ${symStruct.identifier} no tiene el atributo ${this.id}`);

            const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
            const temp = generator.newTemporal();

            generator.addExpression(tempAux, anterior.getValue(), attribute.index, '+'); //Busca la posicion del atributo
            generator.addGetHeap(temp, tempAux); //Trae el valor del heap

            return new Retorno(temp, true, attribute.value.type);
        }
    }
}