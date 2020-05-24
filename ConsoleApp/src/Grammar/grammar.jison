%{
    const {If} = require('../Compiler/Instruction/Control/If');
    const {DoWhile} = require('../Compiler/Instruction/Control/DoWhile');
    const {While} = require('../Compiler/Instruction/Control/While');
    const {InstrBody} = require('../Compiler/Instruction/Control/InstrBody');
    const {Print} = require('../Compiler/Instruction/Functions/Print');

    const {Div} = require('../Compiler/Expression/Arithmetic/Div');
    const {Minus} = require('../Compiler/Expression/Arithmetic/Minus');
    const {Mod} = require('../Compiler/Expression/Arithmetic/Mod');
    const {Plus} = require('../Compiler/Expression/Arithmetic/Plus');
    const {Pot} = require('../Compiler/Expression/Arithmetic/Pot');
    const {Times} = require('../Compiler/Expression/Arithmetic/Times');

    const {PrimitiveL} = require('../Compiler/Expression/Literal/PrimitiveL');
    const {StringL} = require('../Compiler/Expression/Literal/StringL');

    const {And} = require('../Compiler/Expression/Logical/And');
    const {Not} = require('../Compiler/Expression/Logical/Not');
    const {Or} = require('../Compiler/Expression/Logical/Or');

    const {Equals} = require('../Compiler/Expression/Relational/Equals');
    const {Greater} = require('../Compiler/Expression/Relational/Greater');
    const {Less} = require('../Compiler/Expression/Relational/Less');
    const {NotEquals} = require('../Compiler/Expression/Relational/NotEquals');

    const {Types} = require('../Compiler/Utils/Type');

%}

%lex
%options case-insensitive
entero [0-9]+
decimal {entero}"."{entero}
%%

\s+     {}
"//".*
[/][*][^*]*[*]+([^/*][^*][*]+)*[/]  {}

{decimal}             return 'LDECIMAL'
{entero}              return 'LINTEGER' 
"*"                   return '*'
"/"                   return '/'
";"                   return ';'
"-"                   return '-'
"+"                   return '+'
"||"                  return '||'
"&&"                  return '&&'
"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"=="                  return '=='
"!="                  return '!='
"="                   return '='
"("                   return '('
")"                   return ')'  
"["                   return '['
"]"                   return ']'
"}"                   return 'RBRACE'
"{"                   return 'LBRACE'
","                   return ','
"integer"             return 'INTEGER'
"double"              return 'DOUBLE'
"string"              return 'STRING'
"boolean"             return 'BOOLEAN'
"true"                return 'TRUE'
"false"               return 'FALSE'
"if"                  return 'IF'
"else"                return 'ELSE'
"void"                return 'VOID'
"while"               return 'WHILE'
"do"                  return 'DO'
"return"              return 'RETURN'
"print"               return 'PRINT'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*       return 'ID'
[\']([^\t\'\"\n]|(\\\")|(\\n)|(\\\')|(\\t))?[\'] { yytext = yytext.substr(1,yyleng-2).replace("\\n", "\n").replace("\\t", "\t").replace("\\r", "\r").replace("\\\\", "\\").replace("\\\"", "\""); return 'LCHAR'; }

\"[^"]+\" { yytext = yytext.slice(1,-1).replace("\\n", "\n").replace("\\t", "\t").replace("\\r", "\r").replace("\\\\", "\\").replace("\\\"", "\""); return 'LSTRING'; }

<<EOF>>				  return 'EOF'

. { 
    console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);        
}

/lex

%left ELSE
%left '||'
%left '&&'
%left '==' '!='
%left '<' '>' '<=' '>='
%left '+' '-'
%left '*' '/' '%'
%left UMENOS '!'
%left '(' ')' '[' ']' '{' '}'

%start Init

%%

Init 
    : Instructions EOF {
        return $1;
    }
;

Instructions
    : Instructions Instruction {
        $$ = $1; 
        $$.push($2);
    }
    | Instruction {
        $$ = [$1]; 
    }
;

Instruction 
    : IfSt {
        $$ = $1;
    }
    | PrintSt ';' {
        $$ = $1;
    }
    | DoWhileSt ';' {
        $$ = $1;
    }
    | WhileSt {
        $$ = $1;
    }
    | InstructionSt {
        $$ = $1;
    }
;

InstructionSt 
    : LBRACE Instructions RBRACE {
        $$ = new InstrBody($2,@1.first_line,@1.first_column);
    }
;

IfSt 
    : IF '(' Expression ')' InstructionSt {
        $$ = new If($3, $5, null, @1.first_line, @1.first_column);
    }
    | IF '(' Expression ')' InstructionSt ELSE InstructionSt {
        $$ = new If($3, $5, $7, @1.first_line, @1.first_column);
    }
    | IF '(' Expression ')' InstructionSt ELSE IfSt {
        $$ = new If($3, $5, $7, @1.first_line, @1.first_column);
    } 
;

WhileSt 
    : WHILE '(' Expression ')' InstructionSt {
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;

DoWhileSt 
    : DO InstructionSt WHILE '(' Expression ')' { 
        $$ = new DoWhile($5, $2, @1.first_line, @1.first_column); 
    }
;

PrintSt 
    : PRINT '(' Expression ')' {
        $$ = new Print($3,@1.first_line,@1.first_column);
    }
;

Expression 
    : '-' Expression %prec UMENOS { 
        $$ = null;
    }
    | Expression '+' Expression { 
        $$ = new Plus($1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '-' Expression { 
        $$ = new Minus($1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '*' Expression { 
        $$ = new Times($1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '/' Expression { 
        $$ = new Div($1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '<' Expression { 
        $$ = new Less(false,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '>' Expression { 
        $$ = new Greater(false,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '<=' Expression { 
        $$ = new Less(true,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '>=' Expression { 
        $$ = new Greater(true,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '==' Expression { 
        $$ = new Equals($1, $3, @1.first_line, @1.first_column); 
    }
    | Expression '!=' Expression { 
        $$ = new NotEquals($1, $3, @1.first_line, @1.first_column); 
    }
    | LINTEGER { 
        $$ = new PrimitiveL(Types.INTEGER, $1, @1.first_line, @1.first_column); 
    }
    | LCHAR { 
        $$ = new PrimitiveL(Types.CHAR, $1.charCodeAt(0), @1.first_line, @1.first_column); 
    } 
    | LDECIMAL { 
        $$ = new PrimitiveL(Types.DOUBLE, $1, @1.first_line, @1.first_column); 
    }
    | TRUE { 
        $$ = new PrimitiveL(Types.BOOLEAN, true, @1.first_line, @1.first_column); 
    }
    | FALSE { 
        $$ = new PrimitiveL(Types.BOOLEAN, false, @1.first_line, @1.first_column); 
    }
    | LSTRING {  
        $$ = new StringL(Types.STRING,$1,@1.first_line,@1.first_column);
    }  
    | '(' Expression ')' { 
        $$ = $2; 
    }
;