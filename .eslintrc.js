module.exports = {
    // 此项是用来告诉eslint找当前配置文件不能往父级查找
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    "parserOptions": {
        "parser": "babel-eslint"
    },
    /**
     * "off" 或 0 - 关闭规则
     * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
     * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    "rules": {
        // --------------------------------------------------------------------------------------
        // 可能的错误
        // --------------------------------------------------------------------------------------
        // 禁止条件表达式中出现赋值操作符
        "no-cond-assign": 2,
        // 禁用 console
        "no-console": 0,
        // 禁止 function 定义中出现重名参数
        "no-dupe-args": 2,
        // 禁止对 function 声明重新赋值
        "no-func-assign": 2,
        // 禁止对象字面量中出现重复的 key
        "no-dupe-keys": 2,
        // 禁止重复的 case 标签
        "no-duplicate-case": 2,
        // 禁止空语句块
        "no-empty": 2,
        // 禁止对 catch 子句的参数重新赋值
        "no-ex-assign": 2,
        // 禁止不必要的布尔转换
        "no-extra-boolean-cast": 2,
        // 禁止不必要的括号 //(a * b) + c;//报错
        "no-extra-parens": 0,
        // 禁止不必要的分号
        "no-extra-semi": 2,
        // 禁止在嵌套的块中出现 function 或 var 声明
        "no-inner-declarations": [2, "functions"],
        // 禁止 RegExp 构造函数中无效的正则表达式字符串
        "no-invalid-regexp": 2,
        // 禁止在字符串和注释之外不规则的空白
        "no-irregular-whitespace": 0,
        // 禁止在 in 表达式中出现否定的左操作数
        "no-negated-in-lhs": 2,
        // 禁止把全局对象 (Math 和 JSON) 作为函数调用 错误：var math = Math();
        "no-obj-calls": 2,
        // 禁止直接使用 Object.prototypes 的内置属性
        "no-prototype-builtins": 0,
        // 禁止正则表达式字面量中出现多个空格
        "no-regex-spaces": 2,
        // 禁用稀疏数组
        "no-sparse-arrays": 2,
        // 禁止出现令人困惑的多行表达式
        "no-unexpected-multiline": 2,
        // 禁止在return、throw、continue 和 break语句之后出现不可达代码
        "no-unreachable": 0,
        // 要求使用 isNaN() 检查 NaN
        "use-isnan": 2,
        // 强制 typeof 表达式与有效的字符串进行比较
        // typeof foo === "undefimed" 错误
        "valid-typeof": 2,
        // --------------------------------------------------------------------------------------
        // 最佳实践
        // --------------------------------------------------------------------------------------
        // 强制数组方法的回调函数中有 return 语句
        "array-callback-return": 0,
        // 要求 return 语句要么总是指定返回的值，要么不指定
        "consistent-return": 0,
        // 强制所有控制语句使用一致的括号风格
        "curly": [0, "all"],
        // 禁用 alert、confirm 和 prompt
        "no-alert": 0,
        // 禁用 arguments.caller 或 arguments.callee
        "no-caller": 2,
        // 不允许在 case 子句中使用词法声明
        "no-case-declarations": 2,
        // 禁止除法操作符显式的出现在正则表达式开始的位置
        "no-div-regex": 2,
        // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
        "no-empty-function": 2,
        // 禁止使用空解构模式no-empty-pattern
        "no-empty-pattern": 2,
        // 禁止在没有类型检查操作符的情况下与 null 进行比较
        "no-eq-null": 1,
        // 禁止使用短符号进行类型转换(!!fOO)
        "no-implicit-coercion": 0,
        // 禁止在全局范围内使用 var 和命名的 function 声明
        "no-implicit-globals": 1,
        // 禁止 this 关键字出现在类和类对象之外
        "no-invalid-this": 0,
        // 禁止在循环中出现 function 声明和表达式
        "no-loop-func": 1,
        // 禁止使用多个空格
        "no-multi-spaces": 2,
        // 禁止对原生对象赋值
        "no-native-reassign": 2,
        // 禁止对 Function 对象使用 new 操作符
        "no-new-func": 0,
        // 禁止对 String，Number 和 Boolean 使用 new 操作符
        "no-new-wrappers": 2,
        // 不允许对 function 的参数进行重新赋值
        "no-param-reassign": 0,
        // 禁止使用 var 多次声明同一变量
        "no-redeclare": 0,
        // 禁用指定的通过 require 加载的模块
        "no-return-assign": 0,
        // 禁止使用 javascript: url
        "no-script-url": 0,
        // 禁止自我赋值
        "no-self-assign": 2,
        // 禁止自身比较
        "no-self-compare": 2,
        // 禁止在注释中使用特定的警告术语
        "no-warning-comments": 0,
        // --------------------------------------------------------------------------------------
        // 变量声明
        // --------------------------------------------------------------------------------------
        // 要求或禁止 var 声明中的初始化(初值)
        "init-declarations": 0,
        // 不允许 catch 子句的参数与外层作用域中的变量同名
        "no-catch-shadow": 0,
        // 禁止删除变量
        "no-delete-var": 2,
        // 不允许标签与变量同名
        "no-label-var": 2,
        // 禁用特定的全局变量
        "no-restricted-globals": 0,
        // 禁止 var 声明 与外层作用域的变量同名
        "no-shadow": 0,
        // 禁止覆盖受限制的标识符
        "no-shadow-restricted-names": 2,
        // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
        "no-undef": 0,
        // 禁止将变量初始化为 undefined
        "no-undef-init": 2,
        // 禁止将 undefined 作为标识符
        "no-undefined": 0,
        // 禁止出现未使用过的变量
        "no-unused-vars": [0, {
            "vars": "all",
            "args": "none"
        }],
        // 不允许在变量定义之前使用它们
        "no-use-before-define": 0,
        // --------------------------------------------------------------------------------------
        // Node.js and CommonJS
        // --------------------------------------------------------------------------------------
        // require return statements after callbacks
        "callback-return": 0,
        // 要求 require() 出现在顶层模块作用域中
        "global-require": 1,
        // 要求回调函数中有容错处理
        "handle-callback-err": [2, "^(err|error)$"],
        // 禁止混合常规 var 声明和 require 调用
        "no-mixed-requires": 0,
        // 禁止调用 require 时使用 new 操作符
        "no-new-require": 2,
        // 禁止对 __dirname 和 __filename进行字符串连接
        "no-path-concat": 0,
        // 禁用 process.env
        "no-process-env": 0,
        // 禁用 process.exit()
        "no-process-exit": 0,
        // 禁用同步方法
        "no-sync": 0,
        // --------------------------------------------------------------------------------------
        // 风格指南
        // --------------------------------------------------------------------------------------
        // 强制使用一致的换行风格
        "linebreak-style": [0, "windows"],
        // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
        "array-bracket-spacing": [2, "never"],
        //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        // if while function 后面的{必须与if在同一行，java风格。
        // "brace-style": [2, "1tbs", {
        //     "allowSingleLine": true
        // }],
        // 双峰驼命名格式
        "camelcase": 2,
        // 控制逗号前后的空格
        "comma-spacing": [2, {
            "before": false,
            "after": true
        }],
        // 控制逗号在行尾出现还是在行首出现 (默认行尾)
        // http://eslint.org/docs/rules/comma-style
        "comma-style": [2, "last"],
        // 文件末尾强制换行
        "eol-last": 0,
        // 强制在对象字面量的属性中键和值之间使用一致的间距
        "key-spacing": [2, {
            "beforeColon": false,
            "afterColon": true
        }],
        // 不允许空格和 tab 混合缩进
        "no-mixed-spaces-and-tabs": 0,
        // 不允许多个空行
        "no-multiple-empty-lines": [2, {
            "max": 2
        }],
        // 不允许使用嵌套的三元表达式
        "no-nested-ternary": 0,
        // 禁止使用一元操作符 ++ 和 --
        "no-plusplus": 0,
        // 禁止 function 标识符和括号之间出现空格
        "no-spaced-func": 2,
        // 禁用行尾空格
        "no-trailing-spaces": 2,
        // 禁止标识符中有悬空下划线_bar
        "no-underscore-dangle": 0,
        // 强制操作符使用一致的换行符
        "operator-linebreak": [2, "after", {
            "overrides": {
                "?": "before",
                ":": "before"
            }
        }],
        // 强制使用一致的反勾号、双引号或单引号
        "quotes": [0, "double", "avoid-escape"],
        // 强制在 function的左括号之前使用一致的空格
        "space-before-function-paren": [0, "always"],
        // --------------------------------------------------------------------------------------
        // ES6.相关
        // --------------------------------------------------------------------------------------
        // 要求箭头函数体使用大括号
        "arrow-body-style": 0,
        // 要求箭头函数的参数使用圆括号
        "arrow-parens": 0,
        "arrow-spacing": [0, {
            "before": true,
            "after": true
        }],
        // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
        "constructor-super": 0,
        // 强制 generator 函数中 * 号周围使用一致的空格
        "generator-star-spacing": [2, {
            "before": true,
            "after": true
        }],
        // 禁止修改类声明的变量
        "no-class-assign": 2,
        // 不允许箭头功能，在那里他们可以混淆的比较
        "no-confusing-arrow": 0,
        // 禁止修改 const 声明的变量
        "no-const-assign": 2,
        // 禁止类成员中出现重复的名称
        "no-dupe-class-members": 2,
        // 不允许复制模块的进口
        "no-duplicate-imports": 0,
        // 禁止 Symbol 的构造函数
        "no-new-symbol": 2,
        // 允许指定模块加载时的进口
        "no-restricted-imports": 0,
        // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        "no-this-before-super": 2,
        // 禁止不必要的计算性能键对象的文字
        "no-useless-computed-key": 0,
        // 要求使用 let 或 const 而不是 var
        "no-var": 0,
        // 要求或禁止对象字面量中方法和属性使用简写语法
        "object-shorthand": 0,
        // 要求使用箭头函数作为回调
        "prefer-arrow-callback": 0,
        // 要求使用 const 声明那些声明后不再被修改的变量
        "prefer-const": 0,
        // 要求在合适的地方使用 Reflect 方法
        "prefer-reflect": 0,
        // 要求使用扩展运算符而非 .apply()
        "prefer-spread": 0,
        // 要求使用模板字面量而非字符串连接
        "prefer-template": 0,
        // Suggest using the rest parameters instead of arguments
        "prefer-rest-params": 0,
        // 要求generator 函数内有 yield
        "require-yield": 0,
        // enforce spacing between rest and spread operators and their expressions
        "rest-spread-spacing": 0,
        // 强制模块内的 import 排序
        "sort-imports": 0,
        // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
        "template-curly-spacing": 1,
        // 强制在 yield* 表达式中 * 周围使用空格
        "yield-star-spacing": 2
    }
};