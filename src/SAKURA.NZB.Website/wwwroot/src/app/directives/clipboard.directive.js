System.register(['angular2/core', 'clipboard'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, clipboard_1;
    var ClipboardDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (clipboard_1_1) {
                clipboard_1 = clipboard_1_1;
            }],
        execute: function() {
            ClipboardDirective = (function () {
                function ClipboardDirective(eltRef) {
                    this.eltRef = eltRef;
                    this.clipboardSuccess = new core_1.EventEmitter();
                    this.clipboardError = new core_1.EventEmitter();
                }
                ClipboardDirective.prototype.ngOnInit = function () {
                    var _this = this;
                    $(this.eltRef.nativeElement).attr('data-clipboard-text', this.text);
                    this.clipboard = new clipboard_1.default(this.eltRef.nativeElement, {
                        target: function () {
                            return _this.eltRef.nativeElement;
                        }
                    });
                    this.clipboard.on('success', function (e) {
                        console.log(_this.text);
                        _this.clipboardSuccess.emit(null);
                    });
                    this.clipboard.on('error', function (e) {
                        _this.clipboardError.emit(null);
                    });
                };
                ClipboardDirective.prototype.ngOnDestroy = function () {
                    if (this.clipboard) {
                        this.clipboard.destroy();
                    }
                };
                __decorate([
                    core_1.Input('clipboard'), 
                    __metadata('design:type', String)
                ], ClipboardDirective.prototype, "text", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ClipboardDirective.prototype, "clipboardSuccess", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ClipboardDirective.prototype, "clipboardError", void 0);
                ClipboardDirective = __decorate([
                    core_1.Directive({
                        selector: '[clipboard]'
                    }),
                    __param(0, core_1.Inject(core_1.ElementRef)), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], ClipboardDirective);
                return ClipboardDirective;
            })();
            exports_1("ClipboardDirective", ClipboardDirective);
        }
    }
});
//# sourceMappingURL=clipboard.directive.js.map