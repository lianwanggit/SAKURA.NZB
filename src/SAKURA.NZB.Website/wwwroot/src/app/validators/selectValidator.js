System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SelectValidator;
    return {
        setters:[],
        execute: function() {
            SelectValidator = (function () {
                function SelectValidator() {
                }
                SelectValidator.unselected = function (control) {
                    if (control.value) {
                        var value = parseInt(control.value, 10);
                        if (!isNaN(value) && (value > 0))
                            return null;
                    }
                    return { 'unselected': true };
                };
                return SelectValidator;
            }());
            exports_1("SelectValidator", SelectValidator);
        }
    }
});
//# sourceMappingURL=selectValidator.js.map