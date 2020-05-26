import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types } from "../../Utils/Type";

export class AccessId extends Expression {
    private id: string;
    private anterior: Expression | null;

    constructor(id: string, anterior: Expression | null, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.anterior = anterior;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        if(this.anterior == null){
            let symbol = enviorement.getVar(this.id);
            if(symbol == null){
                throw new Error(this.line,this.column,'Semantico',`No existe la variable: ${this.id}`);
            }
            const temp = generator.newTemporal();
            if(symbol.isGlobal){
                generator.addGetStack(temp,symbol.position);
                if(symbol.type.type != Types.BOOLEAN) return new Retorno(temp,true,symbol.type,symbol);
                
                const retorno = new Retorno('',false,symbol.type);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp,'1','==',this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
            else if(symbol.isRef){
                //TODO variables por referencia
            }
            else{
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                generator.addExpression(tempAux,'p',symbol.position,'+');
                generator.addGetStack(temp,tempAux);
                if(symbol.type.type != Types.BOOLEAN) return new Retorno(temp,true,symbol.type,symbol);

                const retorno = new Retorno('',false,symbol.type);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp,'1','==',this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
        }
        throw "No implementados los accesos";
    }
}