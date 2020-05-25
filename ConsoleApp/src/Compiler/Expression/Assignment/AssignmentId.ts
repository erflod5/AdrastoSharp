import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class AssignmentId extends Expression {
    private id: string;
    private anterior: Expression | null;

    constructor(id: string, anterior: Expression | null, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.anterior = anterior;
    }

    compile(enviorement: Enviorement) : Retorno{
        const generator = Generator.getInstance();
        if(this.anterior == null){
            const symbol = enviorement.getVar(this.id);
            if(symbol == null) throw new Error(this.line,this.column,'Semantico',`No existe la variable ${this.id}`);
            
            if(symbol.isGlobal){
                return new Retorno(symbol.position + '',false,symbol.type,symbol);
            }
            else if(symbol.isRef){
                //TODO variables por referencia
            }
            else{
                const temp = generator.newTemporal();
                generator.addExpression(temp,'p',symbol.position,'+');
                return new Retorno(temp,true,symbol.type,symbol);
            }
        }
        else{
            //TODO accesos de id
        }
        throw new Error(this.line,this.column,'Semantico','Aun no lo hago wey');
    }
}