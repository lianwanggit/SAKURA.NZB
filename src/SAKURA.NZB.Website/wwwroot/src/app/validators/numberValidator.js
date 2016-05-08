System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NumberValidator;
    return {
        setters:[],
        execute: function() {
            NumberValidator = (function () {
                function NumberValidator() {
                }
                NumberValidator.unspecified = function (control) {
                    if (control.value) {
                        var value = parseInt(control.value, 10);
                        if (!isNaN(value) && (value > 0))
                            return null;
                    }
                    return { 'unspecified': true };
                };
                return NumberValidator;
            }());
            exports_1("NumberValidator", NumberValidator);
        }
    }
});
//# sourceMappingURL=numberValidator.js.map