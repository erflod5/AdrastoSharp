import { Expression } from "../../Abstract/Expression";
import { Generator } from "../../Generator/Generator";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Type, Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Retorno } from "../../Utils/Retorno";

export class Pot extends Expression{
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(enviorement: Enviorement): Retorno {
        let left = this.left.compile(enviorement);
        let right = this.right.compile(enviorement);
        let generator = Generator.getInstance();
        let temp = generator.newTemporal();
        switch (left.type.type) {
            case Types.INTEGER:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                        let tempAux = generator.newTemporal();
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.value);
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.value);
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_pot');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, left.type);
                    default:
                        break;
                }
            case Types.CHAR:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                        let tempAux = generator.newTemporal();
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.value);
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.value);
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_pot');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.INTEGER));
                    default:
                        break;
                }
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede modular ${left.type.type} % ${right.type.type}`);
    }
}