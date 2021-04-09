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
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);

        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        switch (left.type.type) {
            case Types.INTEGER:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : left.type);
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_int_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    default:
                        break;
                }
            case Types.DOUBLE:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, left.type);
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_dbl_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    default:
                        break;
                }
            case Types.CHAR:
                switch (right.type.type) {
                    case Types.INTEGER:
                    case Types.CHAR:
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, right.type.type == Types.DOUBLE ? right.type : new Type(Types.INTEGER));
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_chr_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    default:
                        break;
                }
            case Types.STRING:
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                switch (right.type.type) {
                    case Types.INTEGER:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_int');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.CHAR:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_chr');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.DOUBLE:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_dbl');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.STRING:
                        generator.addExpression('T1', left.getValue());
                        generator.addExpression('T2', right.getValue());
                        generator.addCall('native_concat_str_str');
                        generator.addExpression(temp, 'T3');
                        // generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        // generator.addSetStack(tempAux,left.getValue());
                        // generator.addExpression(tempAux,tempAux,'1','+');
                        // generator.addSetStack(tempAux,right.getValue());
                        // generator.addNextEnv(enviorement.size);
                        // generator.addCall('native_concat_str_str');
                        // generator.addGetStack(temp,'p');
                        // generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.BOOLEAN:
                        const lblTemp = generator.newLabel();
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');

                        generator.addLabel(right.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(lblTemp);

                        generator.addLabel(right.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(lblTemp);

                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_bol');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));

                    default:
                        break;
                }
            case Types.BOOLEAN:
                switch (right.type.type) {
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        const lblTemp = generator.newLabel();
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addLabel(left.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(lblTemp);
                        generator.addLabel(left.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(lblTemp);
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_bol_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    default:
                        break;
                }
        }
        throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
    }
}