import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { log, types } from "util";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";

export class NewStruct extends Expression {
    private id: string;

    constructor(id: string, line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    compile(enviorement: Enviorement): Retorno {
        const symStruct = enviorement.searchStruct(this.id);
        const generator = Generator.getInstance();
        if (symStruct == null)
            throw new Error(this.line, this.column, 'Semantico', `No existe el struct ${this.id} en este ambito`);
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h', '', '');
        //Llenar de valores por defecto
        symStruct.attributes.forEach((attribute) => {
            switch (attribute.type.type) {
                case Types.INTEGER:
                case Types.DOUBLE:
                case Types.CHAR:
                case Types.BOOLEAN:
                    generator.addSetHeap('h', '0');
                    break;
                case Types.STRING:
                case Types.STRUCT:
                case Types.ARRAY:
                    generator.addSetHeap('h','-1');
            }
            generator.nextHeap();
        })
        return new Retorno(temp,true,new Type(Types.STRUCT,symStruct.identifier,symStruct));
    }
}