// M3 Syntax: https://www.cs.purdue.edu/homes/hosking/m3/reference/syntax.html
// Operator Precedence: https://www.cs.purdue.edu/homes/hosking/m3/reference/opsyntax.html
// Operator Precedence: https://modula3.elegosoft.com/cm3/doc/tutorial/m3/m3_56.html
module.exports = grammar({
  name: "Modula3",
  extras: ($) => [$.comment, /\s/],
  rules: {
    // Compilation Unit Productions:
    Compilation: ($) =>
      seq(
        optional(
          seq($.kUnsafe, choice($.Interface, $.Module, $.GenInt, $.GenMod)),
        ),
      ),
    Interface: ($) =>
      choice(
        seq(
          $.kInterface,
          $.Id,
          ";",
          repeat($.Import),
          repeat($.Decl),
          $.kEnd,
          $.Id,
          ".",
        ),
        seq($.kInterface, $.Id, "=", $.Id, $.GenActls, $.kEnd, $.Id, "."),
      ),

    Module: ($) =>
      choice(
        seq(
          $.kModule,
          $.Id,
          optional(seq($.kExports, $.IdList)),
          ";",
          repeat($.Import),
          $.Block,
          $.Id,
          ".",
        ),
        seq(
          $.kModule,
          $.Id,
          optional(seq($.kExports, $.IdList)),
          "=",
          $.Id,
          $.GenActls,
          $.kEnd,
          $.Id,
          ".",
        ),
      ),
    GenInt: ($) =>
      seq(
        $.kGeneric,
        $.kInterface,
        $.Id,
        $.GenFmls,
        ";",
        repeat($.Import),
        repeat($.Decl),
        $.kEnd,
        $.Id,
        ".",
      ),
    GenMod: ($) =>
      seq(
        $.kGeneric,
        $.kModule,
        $.Id,
        $.GenFmls,
        ";",
        repeat($.Import),
        $.Block,
        $.Id,
        ".",
      ),
    Import: ($) => choice($.AsImport, $.FromImport),
    AsImport: ($) =>
      seq($.kImport, $.ImportItem, repeat(seq(",", $.ImportItem)), ";"),
    FromImport: ($) => seq($.kFrom, $.Id, $.kImport, $.IdList, ";"),
    Block: ($) => seq(optional($.Decl), $.kBegin, $.S, $.kEnd),
    Decl: ($) =>
      choice(
        seq($.kConst, repeat(seq($.ConstDecl, ";"))),
        seq($.kType, repeat(seq($.TypeDecl, ";"))),
        seq($.kException, repeat(seq($.ExceptionDecl, ";"))),
        seq($.kVar, repeat(seq($.VariableDecl, ";"))),
        seq($.ProcedureHead, optional(seq("=", $.Block, $.Id)), ";"),
        seq($.kReveal, repeat(seq($.QualId, choice("=", "<:"), $.Type, ";"))),
      ),
    GenFmls: ($) => seq("(", optional($.IdList), ")"),
    GenActls: ($) => seq("(", optional($.IdList), ")"),
    ImportItem: ($) => choice($.Id, seq($.Id, $.kAs, $.Id)),
    ConstDecl: ($) => seq($.Id, optional(seq(":", $.Type)), "=", $.ConstExpr),
    TypeDecl: ($) => seq($.Id, choice("=", "<:"), $.Type),
    ExceptionDecl: ($) => seq($.Id, optional(seq("(", $.Type, ")"))),
    VariableDecl: ($) =>
      seq($.IdList, choice(seq(":", $.Type), seq(":=", $.Expr))),
    ProcedureHead: ($) => seq($.kProcedure, $.Id, $.Signature),
    Signature: ($) =>
      seq(
        "(",
        optional($.Formals),
        ")",
        optional(seq(":", $.Type)),
        optional(seq($.kRaises, $.Raises)),
      ),
    Formals: ($) =>
      repeat1(seq($.Formal, repeat(seq(";", $.Formal)), optional(";"))), // make this optional on call site
    Formal: ($) =>
      seq(
        optional($.Mode),
        $.IdList,
        choice(seq(":", $.Type), seq(":=", $.ConstExpr)),
      ),
    Mode: ($) => choice($.kValue, $.kVar, $.kReadonly),
    Raises: ($) =>
      choice(
        seq("{", optional(seq($.QualId, repeat(seq(",", $.QualId)))), "}"),
        $.kAny,
      ),

    // Statement Productions:
    Stmt: ($) =>
      choice(
        $.AssignSt,
        $.Block,
        $.CallSt,
        $.CaseSt,
        $.ExitSt,
        $.EvalSt,
        $.ForSt,
        $.IfSt,
        $.LockSt,
        $.LoopSt,
        $.RaiseSt,
        $.RepeatSt,
        $.ReturnSt,
        $.TCaseSt,
        $.TryXptSt,
        $.TryFinSt,
        $.WhileSt,
        $.WithSt,
      ),
    S: ($) => repeat1(seq($.Stmt, optional(seq(";", $.Stmt)), optional(";"))), // make this optional on call site
    AssignSt: ($) => seq($.Expr, ":=", $.Expr),
    CallSt: ($) =>
      seq(
        $.Expr,
        "(",
        optional(seq($.Actual, repeat(seq(",", $.Actual)))),
        ")",
      ),
    CaseSt: ($) =>
      seq(
        $.kCase,
        $.Expr,
        $.kOf,
        optional($.Case),
        repeat(seq("|", $.Case)),
        optional(seq($.kElse, $.S)),
        $.kEnd,
      ),
    ExitSt: ($) => $.kExit,
    EvalSt: ($) => seq($.kEval, $.Expr),
    ForSt: ($) =>
      seq(
        $.kFor,
        $.Id,
        ":=",
        $.Expr,
        $.kTo,
        $.Expr,
        optional(seq($.kBy, $.Expr)),
        $.kDo,
        $.S,
        $.kEnd,
      ),
    IfSt: ($) =>
      seq(
        $.kIf,
        $.Expr,
        $.kThen,
        $.S,
        repeat(seq($.kElsif, $.Expr, $.kThen, $.S)),
        optional(seq($.kElse, $.S)),
        $.kEnd,
      ),
    LockSt: ($) => seq($.kLock, $.Expr, $.kDo, $.kEnd),
    LoopSt: ($) => seq($.kLoop, $.S, $.kEnd),
    RaiseSt: ($) => seq($.kRaise, $.QualId, optional(seq("(", $.Expr, ")"))),
    RepeatSt: ($) => seq($.kRepeat, $.S, $.kUntil, $.Expr),
    ReturnSt: ($) => prec.right(seq($.kReturn, optional($.Expr))),
    TCaseSt: ($) =>
      seq(
        $.kTypecase,
        $.Expr,
        $.kOf,
        optional($.TCase),
        repeat(seq("|", $.TCase)),
        optional(seq($.kElse, $.S)),
        $.kEnd,
      ),
    TryXptSt: ($) =>
      seq(
        $.kTry,
        $.S,
        $.kExcept,
        optional($.Handler),
        repeat(seq("|", $.Handler)),
        optional(seq($.kElse, $.S)),
        $.kEnd,
      ),
    TryFinSt: ($) => seq($.kTry, $.S, $.kFinally, $.S, $.kEnd),
    WhileSt: ($) => seq($.kWhile, $.Expr, $.kDo, $.S, $.kEnd),
    WithSt: ($) =>
      seq($.kWith, $.Binding, repeat(seq(",", $.Binding)), $.kDo, $.S, $.kEnd),
    Case: ($) => seq($.Labels, repeat(seq(",", $.Labels)), "=>", $.S),
    Labels: ($) => seq($.ConstExpr, optional(seq("..", $.ConstExpr))),
    Handler: ($) =>
      seq(
        $.QualId,
        optional(seq(",", $.QualId)),
        optional(seq("(", $.Id, ")")),
        "=>",
        $.S,
      ),

    TCase: ($) =>
      seq(
        $.Type,
        optional(seq(",", $.Type)),
        optional(seq("(", $.Id, ")")),
        "=>",
        $.S,
      ),
    Binding: ($) => seq($.Id, "=", $.Expr),
    Actual: ($) => choice($.Type, seq(optional(seq($.Id, ":=")), $.Expr)),

    // Type Productions:
    Type: ($) =>
      choice(
        $.TypeName,
        $.ArrayType,
        $.PackedType,
        $.EnumType,
        $.ObjectType,
        $.ProcedureType,
        $.RecordType,
        $.RefType,
        $.SetType,
        $.SubrangeType,
        seq("(", $.Type, ")"),
      ),

    ArrayType: ($) =>
      seq(
        $.kArray,
        optional(seq($.Type, repeat(seq(",", $.Type)))),
        $.kOf,
        $.Type,
      ),
    PackedType: ($) => seq($.kBits, $.ConstExpr, $.kFor, $.Type),
    EnumType: ($) => seq("{", optional($.IdList), "}"),
    ObjectType: ($) =>
      seq(
        optional(choice($.TypeName, $.ObjectType)),
        optional($.Brand),
        $.kObject,
        optional($.Fields), // make this optional, and make fields repeat1
        optional(seq($.kMethods, $.Methods)),
        optional(seq($.kOverrides, $.Overrides)),
        $.kEnd,
      ),
    ProcedureType: ($) => seq($.kProcedure, $.Signature),
    RecordType: ($) => seq($.kRecord, $.Fields, $.kEnd),
    RefType: ($) =>
      seq(optional($.kUntraced), optional($.Brand), $.kRef, $.Type),
    SetType: ($) => seq($.kSet, $.kOf, $.Type),
    SubrangeType: ($) => seq("[", $.ConstExpr, "..", $.ConstExpr, "]"),
    Brand: ($) => seq($.kBranded, $.ConstExpr),
    Fields: ($) =>
      repeat1(seq($.Field, repeat(seq(";", $.Field)), optional(";"))), // BUGGY?, make this optional in methods
    Field: ($) =>
      seq($.IdList, choice(seq(":", $.Type), seq(":=", $.ConstExpr))), // BUGGY?
    Methods: ($) =>
      repeat1(seq($.Method, repeat(seq(";", $.Method)), optional(";"))), // make this optional in object
    Method: ($) => seq($.Id, $.Signature, optional(seq(":=", $.ConstExpr))),
    Overrides: ($) =>
      repeat1(seq($.Override, repeat(seq(";", $.Override)), optional(";"))), // make this optional in object
    Override: ($) => seq($.Id, ":=", $.ConstExpr),

    // Expression Productions:
    ConstExpr: ($) => $.Expr,
    Expr: ($) => seq($.E1, repeat1(seq(prec.left(1, $.kOr), $.E1))),
    E1: ($) => seq($.E2, repeat1(seq(prec.left(2, $.kAnd), $.E2))),
    E2: ($) => seq(prec.left(3, optional($.kNot)), $.E3),
    E3: ($) => seq($.E4, repeat1(seq($.Relop, $.E4))),
    E4: ($) => seq($.E5, repeat1(seq($.Addop, $.E5))),
    E5: ($) => seq($.E6, repeat1(seq($.Mulop, $.E6))),
    E6: ($) => seq(prec.left(7, optional(choice("+", "-"))), $.E7),
    E7: ($) => seq($.E8, optional($.Selector)),
    E8: ($) =>
      choice(
        prec.left(1, $.Id),
        $.Number,
        $.CharLiteral,
        $.TextLiteral,
        $.Constructor,
        seq("(", $.Expr, ")"),
      ),

    Relop: ($) => prec.left(4, choice("=", "#", "<", "<=", ">", ">=", $.kIn)),
    Addop: ($) => prec.left(5, choice("+", "-", "&")),
    Mulop: ($) => prec.left(6, choice("*", "/", $.kDiv, $.kMod)),
    Selector: ($) =>
      choice(
        prec.left(8, "^"),
        prec.left(10, seq(".", $.Id)),
        prec.left(9, seq("[", $.Expr, optional(seq(",", $.Expr)), "]")),
        prec.left(
          9,
          seq("(", optional(seq($.Actual, optional(seq(",", $.Actual)))), ")"),
        ),
      ),

    Constructor: ($) =>
      seq(
        $.Type,
        prec.left(
          9,
          seq("{", optional(choice($.SetCons, $.RecordCons, $.ArrayCons)), "}"),
        ),
      ),
    SetCons: ($) => seq($.SetElt, optional(seq(",", $.SetElt))),
    SetElt: ($) => seq($.Expr, optional(seq("..", $.Expr))),
    RecordCons: ($) => seq($.RecordElt, optional(seq(",", $.RecordElt))),
    RecordElt: ($) => seq(optional(seq($.Id, ":=")), $.Expr),
    ArrayCons: ($) =>
      seq($.Expr, optional(seq(",", $.Expr)), optional(seq(",", ".."))),

    // Miscellaneous Productions:
    IdList: ($) => seq($.Id, repeat1(seq(",", $.Id))),
    QualId: ($) => prec.left(2, seq($.Id, optional(seq(".", $.Id)))),
    TypeName: ($) => choice($.QualId, $.kRoot, seq($.kUntraced, $.kRoot)),

    // Token Productions:
    Id: ($) => seq($.Letter, optional(choice($.Letter, $.Digit, "_"))),
    Literal: ($) => choice($.Number, $.CharLiteral, $.TextLiteral),
    CharLiteral: ($) =>
      seq("'", choice($.PrintingChar, $.Escape, $.DQUOTE), "'"),
    TextLiteral: ($) =>
      seq($.DQUOTE, repeat(choice($.PrintingChar, $.Escape, "'")), $.DQUOTE),
    Escape: ($) =>
      seq(
        choice(
          seq("\\", "n"),
          seq("\\", "t"),
          seq("\\", "r"),
          seq("\\", "f"),
          seq("\\", "\\"),
          seq("\\", "'"),
          seq("\\", $.DQUOTE),
          seq("\\", $.OctalDigit, $.OctalDigit, $.OctalDigit),
        ),
      ),
    Number: ($) =>
      choice(
        repeat1($.Digit),
        seq(repeat1($.Digit), "_", repeat1($.HexDigit)),
        seq(repeat1($.Digit), ".", repeat1($.Digit), optional($.Exp)),
      ),
    Exp: ($) =>
      seq(
        choice("E", "e", "D", "d", "X", "x"),
        optional(choice("+", "-")),
        repeat1($.Digit),
      ),
    PrintingChar: ($) => choice($.Letter, $.Digit), // $.OtherChar

    DQUOTE: ($) => '"',

    HexDigit: ($) => /[0-9a-fA-F]+/,
    Digit: ($) => /[0-9]/,
    OctalDigit: ($) => /[0-7]/,
    Letter: ($) => /[a-zA-Z]/,
    OtherChar: ($) =>
      choice(
        " ",
        "!",
        "#",
        "$",
        "%",
        "&",
        "(",
        ")",
        "*",
        "+",
        ",",
        "-",
        ".",
        "/",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
        "[",
        "]",
        "^",
        "_",
        "`",
        "{",
        "|",
        "}",
        // $ExtendedChar,
      ),
    // ExtendedChar = any char with ISO-Latin-1 code in [8_ 240..8_ 377].

    // Keywords:
    kAnd: ($) => "AND",
    kAny: ($) => "ANY",
    kArray: ($) => "ARRAY",
    kAs: ($) => "AS",
    kBegin: ($) => "BEGIN",
    kBits: ($) => "BITS",
    kBranded: ($) => "BRANDED",
    kBy: ($) => "BY",
    kCase: ($) => "CASE",
    kConst: ($) => "CONST",
    kDiv: ($) => "DIV",
    kDo: ($) => "DO",
    kElse: ($) => "ELSE",
    kElsif: ($) => "ELSIF",
    kEnd: ($) => "END",
    kEval: ($) => "EVAL",
    kExcept: ($) => "EXCEPT",
    kException: ($) => "EXCEPTION",
    kExit: ($) => "EXIT",
    kExports: ($) => "EXPORTS",
    kFinally: ($) => "FINALLY",
    kFor: ($) => "FOR",
    kFrom: ($) => "FROM",
    kGeneric: ($) => "GENERIC",
    kIf: ($) => "IF",
    kImport: ($) => "IMPORT",
    kIn: ($) => "IN",
    kInterface: ($) => "INTERFACE",
    kLock: ($) => "LOCK",
    kLoop: ($) => "LOOP",
    kMethods: ($) => "METHODS",
    kMod: ($) => "MOD",
    kModule: ($) => "MODULE",
    kNot: ($) => "NOT",
    kObject: ($) => "OBJECT",
    kOf: ($) => "OF",
    kOr: ($) => "OR",
    kOverrides: ($) => "OVERRIDES",
    kProcedure: ($) => "PROCEDURE",
    kRaise: ($) => "RAISE",
    kRaises: ($) => "RAISES",
    kReadonly: ($) => "READONLY",
    kRecord: ($) => "RECORD",
    kRef: ($) => "REF",
    kRepeat: ($) => "REPEAT",
    kReturn: ($) => "RETURN",
    kReveal: ($) => "REVEAL",
    kRoot: ($) => "ROOT",
    kSet: ($) => "SET",
    kThen: ($) => "THEN",
    kTo: ($) => "TO",
    kTry: ($) => "TRY",
    kType: ($) => "TYPE",
    kTypecase: ($) => "TYPECASE",
    kUnsafe: ($) => "UNSFAFE",
    kUntil: ($) => "UNTIL",
    kUntraced: ($) => "UNTRACED",
    kValue: ($) => "VALUE",
    kVar: ($) => "VAR",
    kWhile: ($) => "WHILE",
    kWith: ($) => "WITH",

    // Reserved identifiers:
    riAbs: ($) => "ABS",
    riAddress: ($) => "ADDRESS",
    riAdr: ($) => "ADR",
    riAdrsize: ($) => "ADRSIZE",
    riBitsize: ($) => "BITSIZE",
    riBoolean: ($) => "BOOLEAN",
    riBytesize: ($) => "BYTESIZE",
    riCardinal: ($) => "CARDINAL",
    riCeiling: ($) => "CEILING",
    riChar: ($) => "CHAR",
    riDec: ($) => "DEC",
    riDispose: ($) => "DISPOSE",
    riExtended: ($) => "EXTENDED",
    riFalse: ($) => "FALSE",
    riFirst: ($) => "FIRST",
    riFloat: ($) => "FLOAT",
    riFloor: ($) => "FLOOR",
    riInc: ($) => "INC",
    riInteger: ($) => "INTEGER",
    riIstype: ($) => "ISTYPE",
    riLast: ($) => "LAST",
    riLongint: ($) => "LONGINT",
    riLongreal: ($) => "LONGREAL",
    riLoophole: ($) => "LOOPHOLE",
    riMax: ($) => "MAX",
    riMin: ($) => "MIN",
    riMutex: ($) => "MUTEX",
    riNarrow: ($) => "NARROW",
    riNew: ($) => "NEW",
    riNil: ($) => "NIL",
    riNull: ($) => "NULL",
    riNumber: ($) => "NUMBER",
    riOrd: ($) => "ORD",
    riReal: ($) => "REAL",
    riRefany: ($) => "REFANY",
    riRound: ($) => "ROUND",
    riSubarray: ($) => "SUBARRAY",
    riText: ($) => "TEXT",
    riTrue: ($) => "TRUE",
    riTrunc: ($) => "TRUNC",
    riTypecode: ($) => "TYPECODE",
    riVal: ($) => "VAL",

    comment: ($) => token(/[(][*]([^*]*[*]+[^)*])*[^*]*[*]+[)]/),
  },
});
