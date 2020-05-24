import { Expression } from "../../Abstract/Expression";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";

export class Mod extends Expression{
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(enviorement: Enviorement): Retorno {
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        switch (left.type.type) {
            case Types.INTEGER:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                        generator.addExpression(temp, left.value, right.value, '%');
                        return new Retorno(temp, true, left.type);
                    default:
                        break;
                }
            case Types.CHAR:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                        generator.addExpression(temp, left.value, right.value, '%');
                        return new Retorno(temp, true, new Type(Types.INTEGER));
                    default:
                        break;
                }
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede modular ${left.type.type} % ${right.type.type}`);
    }
}