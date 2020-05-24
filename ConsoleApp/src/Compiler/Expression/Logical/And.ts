import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";

export class And extends Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        this.left.trueLabel = generator.newLabel();
        this.right.trueLabel = this.trueLabel;
        this.left.falseLabel = this.right.falseLabel = this.falseLabel;

        const left = this.left.compile(enviorement);
        generator.addLabel(this.left.trueLabel);
        const right = this.right.compile(enviorement);

        if(left.type.type == Types.BOOLEAN && right.type.type == Types.BOOLEAN){
            const retorno = new Retorno('',false,left.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.right.falseLabel;
            return retorno;
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede And: ${left.type.type} && ${right.type.type}`);
    }
}