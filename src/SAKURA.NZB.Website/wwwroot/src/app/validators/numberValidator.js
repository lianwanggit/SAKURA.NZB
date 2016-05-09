System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NumberValidator, PositiveNumberValidator;
    return {
        setters:[],
        execute: function() {
            NumberValidator = (function () {
                function NumberValidator() {
                }
                NumberValidator.unspecified = function (control) {
                    if (jQuery.isNumeric(control.value)) {
                        return null;
                    }
                    return { 'unspecified': true };
                };
                return NumberValidator;
            }());
            exports_1("NumberValidator", NumberValidator);
            PositiveNumberValidator = (function () {
                function PositiveNumberValidator() {
                }
                PositiveNumberValidator.unspecified = function (control) {
                    if (/^[1-9]\d*$/.test(control.value)) {
                        return null;
                    }
                    return { 'unspecified': true };
                };
                return PositiveNumberValidator;
            }());
            exports_1("PositiveNumberValidator", PositiveNumberValidator);
        }
    }
});
//# sourceMappingURL=numberValidator.js.map