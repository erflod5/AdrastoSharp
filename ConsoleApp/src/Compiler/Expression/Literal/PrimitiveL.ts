import { Expression } from "../../Abstract/Expression";
import { Type, Types } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class PrimitiveL extends Expression {
    private type: Types;
    private value: any;

    constructor(type: Types, value: any, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(enviorement: Enviorement): Retorno {
        switch (this.type) {
            case Types.INTEGER:
            case Types.DOUBLE:
            case Types.CHAR:
                return new Retorno(this.value,false,new Type(this.type));
            case Types.BOOLEAN:
                const generator = Generator.getInstance();
                const retorno = new Retorno('',false,new Type(this.type));
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                this.value ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            case Types.NULL:
                return new Retorno('-1',false,new Type(this.type));
            default:
                throw new Error(this.line,this.column,'Semantico','Tipo de dato no reconocido');
        }
    }
}