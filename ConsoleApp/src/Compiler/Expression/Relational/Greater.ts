import { Expression } from "../../Abstract/Expression";
import { Retorno } from "../../Utils/Retorno";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types, Type } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class Greater extends Expression{
    private left: Expression;
    private right: Expression;
    private isGrtEqual: boolean;

    constructor(isGrtEqual: boolean, left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.isGrtEqual = isGrtEqual; 
    }

    compile(enviorement: Enviorement): Retorno {
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);

        const lefType = left.type.type;
        const rightType = right.type.type;

        if ((lefType == Types.CHAR || lefType == Types.INTEGER || lefType == Types.DOUBLE) &&
            (rightType == Types.CHAR || rightType == Types.INTEGER || rightType == Types.DOUBLE)) {
            const generator = Generator.getInstance();
            this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
            if(this.isGrtEqual){
                generator.addIf(left.getValue(),right.getValue(),'>=',this.trueLabel);
            }
            else{
                generator.addIf(left.getValue(),right.getValue(),'>',this.trueLabel);
            }
            generator.addGoto(this.falseLabel);
            const retorno = new Retorno('',false,new Type(Types.BOOLEAN));
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede ${lefType} > ${rightType}`);
    }
}