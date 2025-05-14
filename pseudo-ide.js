import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm';

// Register the new language
monaco.languages.register({ id: 'cie-pseudocode' });

const dataTypes = ['INTEGER', 'REAL', 'STRING', 'BOOLEAN', 'CHAR', 'ARRAY']

const keywords = [
    'IF', 'THEN', 'ELSE', 'ENDIF',
    'WHILE', 'ENDWHILE',
    'REPEAT', 'UNTIL',
    'FOR', 'TO', 'NEXT',
    'OUTPUT', 'INPUT', 'PRINT',
    'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION', 'ENDFUNCTION', 'CALL', 'RETURNS',
    'TRUE', 'FALSE',
    'AND', 'OR', 'NOT',
    'DIV', 'MOD', 'OF',
    'OPENFILE', 'CLOSEFILE', 'READFILE', 'WRITEFILE', 'FOR'
];

const fileModes = [
    'READ', 'WRITE', 'APPEND'
];

const functions = [
    'LENGTH', 'LEFT', 'RIGHT', 'MID', 'TO_UPPER', 'TO_LOWER',
    'NUM_TO_STR', 'STR_TO_NUM', 'IS_NUM',
    'LCASE', 'UCASE', 'ASC', 'CHR',
    'INT', 'RAND', 'POW', 'EXP', 'LN',
    'SIN', 'COS', 'TAN', 'ASIN', 'ACOS', 'ATAN', 'ATAN2',
    'LOG', 'SQRT',
    'EOF'
];

const declarations = [
    'DECLARE', 'CONSTANT', 'TYPE', 'ENDTYPE'
];

const constants = [];

const returns = ['RETURN']

const SUGGESTIONS = [
    {
        label: 'IF',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'IF ${1:condition} THEN\n\t$0\nENDIF',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Conditional statement',
    },
    {
        label: 'THEN',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'THEN\n\t',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Follows an IF condition and continues to actions.',
    },
    {
        label: 'ELSE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ELSE\n\t',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Alternative block if IF is false',
    },
    {
        label: 'ENDIF',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ENDIF\n',
        documentation: 'End of a Conditional Statement',
    },
    {
        label: 'WHILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'WHILE ${1:condition} \n\t\nENDWHILE',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Start of a WHILE loop',
    },
    {
        label: 'ENDWHILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ENDWHILE\n',
        documentation: 'End of a WHILE loop',
    },
    {
        label: 'REPEAT',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'REPEAT\n\t${1:actions}\nUNTIL ${2:condition}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Start of a REPEAT loop',
    },
    {
        label: 'UNTIL',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'UNTIL ${1:condition}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Condition to end a REPEAT loop',
    },
    {
        label: 'FOR',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'FOR ${1:variable} <- ${2:start} TO ${3:end} \n\t${4:actions}\nNEXT ${1}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Start of a FOR loop',
    },
    {
        label: 'TO',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'TO ${1:end}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines the end of a FOR loop',
    },
    {
        label: 'NEXT',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'NEXT ${1:variable}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'End of a FOR loop',
    },
    {
        label: 'OUTPUT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'OUTPUT ${1:message}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Prints a message to the terminal',
    },
    {
        label: 'INPUT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'INPUT ${1:variable}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Receives user input and assign it to a variable',
    },
    {
        label: 'PRINT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'PRINT ${1:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Prints a value to the terminal',
    },
    {
        label: 'RETURN',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'RETURN ${1:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns a value from a function',
    },
    {
        label: 'PROCEDURE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'PROCEDURE ${1:name}(${2:parameters}) \n\t${3:actions}\nENDPROCEDURE',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Start of a procedure block',
    },
    {
        label: 'ENDPROCEDURE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ENDPROCEDURE',
        documentation: 'End of a procedure block',
    },
    {
        label: 'FUNCTION',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'FUNCTION ${1:name}(${2:parameters}) \n\t${3:actions}\n\tRETURN ${4:value}\nENDFUNCTION',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Start of a function block',
    },
    {
        label: 'CALL',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CALL ${1:name}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Calls a function or procedure',
    },
    {
        label: 'TRUE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'TRUE',
        documentation: 'Boolean true',
    },
    {
        label: 'FALSE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'FALSE',
        documentation: 'Boolean false',
    },
    {
        label: 'AND',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'AND ',
        documentation: 'Logical AND',
    },
    {
        label: 'OR ',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'OR',
        documentation: 'Logical OR',
    },
    {
        label: 'NOT',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'NOT',
        documentation: 'Logical NOT',
    },
    {
        label: 'DIV',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'DIV',
        documentation: 'Integer division',
    },
    {
        label: 'MOD',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'MOD',
        documentation: 'Modulo division',
    },
    {
        label: 'LENGTH',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'LENGTH(${1:string})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the length of a string',
    },
    {
        label: 'LEFT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'LEFT(${1:string}, ${2:length})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the leftmost n characters of a string',
    },
    {
        label: 'RIGHT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'RIGHT(${1:string}, ${2:length})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the rightmost n characters of a string',
    },
    {
        label: 'MID',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'MID(${1:string}, ${2:start}, ${3:length})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns a substring starting at position start with specified length',
    },
    {
        label: 'TO_UPPER',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'TO_UPPER(${1:string})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a string to uppercase',
    },
    {
        label: 'TO_LOWER',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'TO_LOWER(${1:string})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a string to lowercase',
    },
    {
        label: 'NUM_TO_STR',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'NUM_TO_STR(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a number to a string',
    },
    {
        label: 'STR_TO_NUM',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'STR_TO_NUM(${1:string})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a string to a number',
    },
    {
        label: 'IS_NUM',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'IS_NUM(${1:string})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Checks if a string can be converted to a number',
    },
    {
        label: 'LCASE',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'LCASE(${1:character})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a character to lowercase',
    },
    {
        label: 'UCASE',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'UCASE(${1:character})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Converts a character to uppercase',
    },
    {
        label: 'ASC',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'ASC(${1:character})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the ASCII code of a character',
    },
    {
        label: 'CHR',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'CHR(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the character corresponding to an ASCII code',
    },
    {
        label: 'INT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'INT(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the integer part of a number',
    },
    {
        label: 'RAND',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'RAND(${1:max})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns a random number between 0 and max-1',
    },
    {
        label: 'POW',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'POW(${1:base}, ${2:exponent})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns base raised to the power of exponent',
    },
    {
        label: 'EXP',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'EXP(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns e raised to the power of number',
    },
    {
        label: 'LN',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'LN(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the natural logarithm of a number',
    },
    {
        label: 'SIN',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'SIN(${1:angle})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the sine of an angle in radians',
    },
    {
        label: 'COS',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'COS(${1:angle})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the cosine of an angle in radians',
    },
    {
        label: 'TAN',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'TAN(${1:angle})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the tangent of an angle in radians',
    },
    {
        label: 'ASIN',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'ASIN(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the arcsine of a number in radians',
    },
    {
        label: 'ACOS',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'ACOS(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the arccosine of a number in radians',
    },
    {
        label: 'ATAN',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'ATAN(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the arctangent of a number in radians',
    },
    {
        label: 'ATAN2',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'ATAN2(${1:y}, ${2:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the arctangent of y/x in radians',
    },
    {
        label: 'LOG',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'LOG(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the base-10 logarithm of a number',
    },
    {
        label: 'SQRT',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'SQRT(${1:number})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the square root of a number',
    },
    {
        label: 'DECLARE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'DECLARE ${1:variable} : ${2:type}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Declares a variable',
    },
    {
        label: 'CONSTANT',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CONSTANT ${1:name} = ${3:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Assigns a read-only value to a name',
    },
    {
        label: 'TYPE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'TYPE ${1:name}\n\t${2:declarations}\nENDTYPE',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Defines a new type',
    },
    {
        label: 'OF',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'OF',
        documentation: 'Defines the type of an array',
    },
    {
        label: 'ENDTYPE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ENDTYPE',
        documentation: 'Ends a type definition',
    },
    {
        label: 'INTEGER',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'INTEGER',
        documentation: 'Integer data type',
    },
    {
        label: 'REAL',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'REAL',
        documentation: 'Real data type',
    },
    {
        label: 'STRING',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'STRING',
        documentation: 'String data type',
    },
    {
        label: 'BOOLEAN',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'BOOLEAN',
        documentation: 'Boolean data type',
    },
    {
        label: 'CHAR',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CHAR',
        documentation: 'Character data type',
    },
    {
        label: 'ARRAY',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'ARRAY[${1:start}:${2:end}] OF ${3:type}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Array data type',
    },
    {
        label: 'OPENFILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'OPENFILE ${1:filename} FOR ${2:mode}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Opens a file for further operations',
    },
    {
        label: 'CLOSEFILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'CLOSEFILE ${1:filename}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Closes a file',
    },
    {
        label: 'READFILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'READFILE ${1:filename}, ${2:variable}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Reads one line from a file to a variable',
    },
    {
        label: 'WRITEFILE',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'WRITEFILE ${1:filename}, ${2:variable}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Writes a variable as a line to a file',
    },
    {
        label: 'FOR',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'FOR ${1:IOMode}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Specifies the access mode of the file',
    },
    {
        label: 'EOF',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'EOF(${1:filename})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Checks if the end of a file has been reached',
    }
];

// Define tokens for syntax highlighting
monaco.languages.setMonarchTokensProvider('cie-pseudocode', {
    keywords: keywords,
    functions: functions,
    constants: constants,
    returns: returns,
    dataTypes: dataTypes,
    declarations: declarations,
    fileModes: fileModes,
    operators: ['=', '<', '>', '<=', '>=', '<>', '+', '-', '*', '/', 'DIV', 'MOD'],
    symbols: /[=><!~?:&|+\-*\/\^]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
        root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],
        common: [
            [/[A-Z_][A-Z0-9_]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@functions': 'function',
                    '@constants': 'constant',
                    '@returns': 'keyword.return',
                    '@dataTypes': 'type',
                    '@declarations': 'declaration',
                    '@fileModes': 'keyword.fileMode',
                }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            // whitespace
            { include: '@whitespace' },
            // brackets
            [/[()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            // numbers
            [/(\d+(_+\d+)*)[eE]([\-+]?(\d+(_+\d+)*))?/, 'number.float'],
            [/(\d+(_+\d+)*)\.(\d+(_+\d+)*)([eE][\-+]?(\d+(_+\d+)*))?/, 'number.float'],
            [/(\d+(_+\d+)*)n?/, 'number'],
            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],
            
            // assignment operator
            [/<-/, 'operator.assignment'],
            [/&/, 'operator.concatenation'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],
        comment: [
            [/[^\/*]+/, 'comment'],
            [/[\/*]/, 'comment']
        ],
        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment']
        ],
        string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],
    }
});


monaco.editor.defineTheme('pseudo-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
        {
            token: "identifier",
            foreground: "FFFFFF"
        },
        {
            token: "keyword",
            foreground: "cf8e6d",
        },
        {
            token: "declaration",
            foreground: "c77dbb"
        },
        {
            token: "function",
            foreground: "57aaf7"
        },
        {
            token: "number",
            foreground: "2aacb8"
        },
        {
            token: "type",
            foreground: "55b3ed",
        },
        {
            token: "string",
            foreground: "6aab73",
        },
        {
            token: "operator.assignment",
            foreground: "c77dbb",
        },
        {
            token: "operator.concatenation",
            foreground: "c77dbb",
        },
        {
            token: "comment",
            foreground: "777777",
        }
    ],
    colors: {}
});

// Provide autocomplete
monaco.languages.registerCompletionItemProvider('cie-pseudocode', {
    // triggerCharacters: ['\t', '(', ')', ',', ';', ':', '<', '>', '='],
    provideCompletionItems: (model, position) => {
        console.log(model, position);
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: position.column
        };

        return {
            suggestions: SUGGESTIONS.map(suggestion => ({
                ...suggestion,
                range: range
            }))
        };
    }
});

// Provide hover documentation
monaco.languages.registerHoverProvider('cie-pseudocode', {
    provideHover: function (model, position) {
        const word = model.getWordAtPosition(position);
        if (!word) return;
        const info = SUGGESTIONS;
        const doc = info.find(item => item.label === word.word.toUpperCase());
        if (doc) {
        return {
            contents: [
                { value: "**" + word.word.toUpperCase() + "**" },
                { value: doc.documentation },
                { value: "Usage: " + doc.insertText }
            ]
        };
    }
}
});
window.editor = monaco.editor.create(document.getElementById('monaco'), {
    value: `DECLARE myList : ARRAY[0:8] OF INTEGER

PROCEDURE Initialize()
    myList[0] <- 27
    myList[1] <- 19
    myList[2] <- 36
    myList[3] <- 42
    myList[4] <- 16
    myList[5] <- 89
    myList[6] <- 21
    myList[7] <- 16
    myList[8] <- 55
ENDPROCEDURE

PROCEDURE BubbleSort(lb: INTEGER, ub: INTEGER)
    DECLARE i : INTEGER
    DECLARE swap : BOOLEAN
    DECLARE temp : INTEGER
    DECLARE top : INTEGER
    top <- ub
    REPEAT
        FOR i <- lb TO top - 1
            swap <- FALSE
            IF myList[i] > myList[i+1]
            THEN
                temp <- myList[i]
                myList[i] <- myList[i+1]
                myList[i+1] <- temp
                swap <- TRUE
            ENDIF
        NEXT
        top <- top -1
    UNTIL (NOT swap) AND (top = 0)
ENDPROCEDURE

ub <- 8
lb <- 0
CALL Initialize()
CALL BubbleSort(0, 8)

FOR i <- 0 TO 8
    OUTPUT myList[i]
NEXT`,
    language: 'cie-pseudocode',
    theme: 'pseudo-dark',
    fontFamily: 'Fira Code',
    fontLigatures: true,
    automaticLayout: true,
});