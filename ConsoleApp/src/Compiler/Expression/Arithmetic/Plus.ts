import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";
import { Error } from "../../Utils/Error";

export class Plus extends Expression {
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
                        generator.addExpression(temp, left.value, right.value, '+');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : left.type);
                    case Types.STRING:
                    //TODO Integer + String
                    default:
                        break;
                }
            case Types.DOUBLE:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.value, right.value, '+');
                        return new Retorno(temp, true, left.type);
                    case Types.STRING:
                    //TODO Double + String
                    default:
                        break;
                }
            case Types.CHAR:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.value, right.value, '+');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : new Type(Types.INTEGER));
                    case Types.STRING:
                    //TODO Char + String
                    default:
                        break;
                }
            case Types.STRING:
                switch (right.type.type) {
                    case Types.INTEGER:
                    //TODO String + Integer
                    case Types.CHAR:
                    //TODO String + Char
                    case Types.DOUBLE:
                    //TODO String + Double
                    case Types.STRING:
                    //TODO String + String
                    case Types.BOOLEAN:
                    //TODO String + Boolean
                    default:
                        break;
                }
            case Types.BOOLEAN:
                switch (right.type.type) {
                    case Types.STRING:
                    //TODO Boolean + String
                    default:
                        break;
                }
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
    }
}