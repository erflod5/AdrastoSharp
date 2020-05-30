import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Retorno } from "../../Utils/Retorno";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";

export class PostDecrement extends Expression {
    private access: Expression;

    constructor(access: Expression, line: number, column: number) {
        super(line, column);
        this.access = access;
    }

    compile(enviorement: Enviorement): Retorno {
        const access = this.access.compile(enviorement);
        const symbol = access.symbol;
        const generator = Generator.getInstance();
        if(symbol == null) throw new Error(this.line,this.column,'Semantico','-- no aplicable aqui');
        switch (access.type.type) {
            case Types.INTEGER:
            case Types.DOUBLE:
            case Types.CHAR:
                const temp = generator.newTemporal();
                const tempaux = generator.newTemporal(); generator.freeTemp(tempaux);
                if(symbol?.isGlobal){
                    generator.addGetStack(temp,symbol.position);
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetStack(symbol.position,tempaux);
                }
                else if(symbol?.isHeap){
                    generator.addGetHeap(temp,access.getValue());
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetHeap(access.getValue(),tempaux);
                }
                else{
                    generator.addGetStack(temp,access.getValue());
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetStack(access.getValue(),tempaux);
                }
                return new Retorno(temp,true,symbol.type);
            default:
                break;
        }
        throw new Error(this.line, this.column, 'Semantico', 'Aun no lo hago :(');
    }
}