import { Expression } from "../../Abstract/Expression";
import { Generator } from "../../Generator/Generator";
import { Retorno } from "../../Utils/Retorno";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Type, Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";

export class Times extends Expression{
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
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.value, right.value, '*');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : left.type);
                    default:
                        break;
                }
            case Types.DOUBLE:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.value, right.value, '*');
                        return new Retorno(temp, true, left.type);
                    default:
                        break;
                }
            case Types.CHAR:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.value, right.value, '*');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : new Type(Types.INTEGER));
                    default:
                        break;
                }
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede multiplicar ${left.type.type} * ${right.type.type}`);
    }
}