import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";

export class Not extends Expression {
    private value: Expression;

    constructor(value: Expression, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        this.value.trueLabel = this.falseLabel;
        this.value.falseLabel = this.trueLabel;

        const value = this.value.compile(enviorement);
        if(value.type.type == Types.BOOLEAN){
            const retorno = new Retorno('',false,value.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        throw new Error(this.line,this.column,'Semantico',`No se puede Not del tipo ${value.type.type}`);
    }
}