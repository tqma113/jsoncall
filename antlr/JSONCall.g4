grammar JSONCall;

// Start json expand
callDefinition: 'call' callName ':' type '=>' type;

callName: name;

defiveDefinition: 'derive' typeName 'from' name;

importStatement: 'import' moduleItems 'from' path;

path: stringType;

moduleItems
    : '{' (typeName ',')* (typeName ','?)? '}'
    ;

// Start json base 
typeDefinition: 'type' typeName '=' type; 

typeName: name;

type: typeName | unionOrIntersectionOrPrimaryType;

primaryType: 
	stringType
	| booleanType
	| nullType
	| listType
	| objectType
    | tupleType
   ;

numberType: NUMBER;

booleanType
	:	'true'
	|	'false'
	;

nullType: 'null';

stringType : STRING;

listType: '[' ']'
    | '[' type+ ']'
    ;

tupleType: '(' ')'
    | '(' (type ',')* (type ','?)? ')'
    ;

objectType: '{' objectField* '}';

objectField: name ':' type;

unionOrIntersectionOrPrimaryType:
    unionOrIntersectionOrPrimaryType '|' unionOrIntersectionOrPrimaryType
    | unionOrIntersectionOrPrimaryType '|' unionOrIntersectionOrPrimaryType
    | primaryType
   ;

name: NAME;

// Start lexer
NAME: [_A-Za-z] [_0-9A-Za-z]*;

fragment CHARACTER: ( ESC | ~ ["\\]);
STRING: '"' CHARACTER* '"';
ID: STRING;
fragment ESC: '\\' ( ["\\/bfnrt] | UNICODE);

fragment UNICODE: 'u' HEX HEX HEX HEX;

fragment HEX: [0-9a-fA-F];

fragment NONZERO_DIGIT: [1-9];
fragment DIGIT: [0-9];
fragment FRACTIONAL_PART: '.' DIGIT+;
fragment EXPONENTIAL_PART: EXPONENT_INDICATOR SIGN? DIGIT+;
fragment EXPONENT_INDICATOR: [eE];
fragment SIGN: [+-];
fragment NEGATIVE_SIGN: '-';

NUMBER: INT FRACTIONAL_PART
    | INT EXPONENTIAL_PART
    | INT FRACTIONAL_PART EXPONENTIAL_PART
    ;

INT: NEGATIVE_SIGN? '0'
    | NEGATIVE_SIGN? NONZERO_DIGIT DIGIT*
    ;

PUNCTUATOR: '!'
    | '$'
    | '(' | ')'
    | '...'
    | ':'
    | '='
    | '@'
    | '[' | ']'
    | '{' | '}'
    | '|'
    ;

// no leading zeros

fragment EXP: [Ee] [+\-]? INT;

// \- since - means "range" inside [...]

WS: [ \t\n\r]+ -> skip;
COMMA: ',' -> skip;
LineComment
    :   '#' ~[\r\n]*
        -> skip
    ;

UNICODE_BOM: (UTF8_BOM
    | UTF16_BOM
    | UTF32_BOM
    ) -> skip
    ;

UTF8_BOM: '\uEFBBBF';
UTF16_BOM: '\uFEFF';
UTF32_BOM: '\u0000FEFF';
