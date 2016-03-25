/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1;
    var Element, Indexer, AlphaIndexerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {}],
        execute: function() {
            Element = (function () {
                function Element(i, n, p) {
                    this.id = i;
                    this.name = n;
                    this.pinyin = p;
                    this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
                }
                return Element;
            })();
            exports_1("Element", Element);
            Indexer = (function () {
                function Indexer(l, c) {
                    this.letter = l;
                    this.count = c;
                }
                return Indexer;
            })();
            exports_1("Indexer", Indexer);
            AlphaIndexerComponent = (function () {
                function AlphaIndexerComponent() {
                    this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    this.indexerList = [];
                    this.resultList = [];
                }
                AlphaIndexerComponent.prototype.ngOnChanges = function (changes) {
                    //console.log(JSON.stringify(changes));
                    if (this.elements) {
                        var list = this.alphabet.ToList().Select(function (x) { return new Indexer(x, 0); });
                        this.elements.forEach(function (x) {
                            var item = list.First(function (i) { return i.letter === x.index; });
                            item.count += 1;
                        });
                        this.indexerList = list.ToArray();
                        this.resultList = this.elements.ToList()
                            .OrderBy(function (x) { return x.pinyin; })
                            .ToArray();
                    }
                };
                Object.defineProperty(AlphaIndexerComponent.prototype, "d1", {
                    get: function () { return JSON.stringify(this.indexerList); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AlphaIndexerComponent.prototype, "d2", {
                    get: function () { return JSON.stringify(this.resultList); },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], AlphaIndexerComponent.prototype, "elements", void 0);
                AlphaIndexerComponent = __decorate([
                    core_1.Component({
                        selector: "alpha-indexer",
                        templateUrl: "./src/app/directives/alphaIndexer.html",
                        styleUrls: ["./css/alpha-indexer.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AlphaIndexerComponent);
                return AlphaIndexerComponent;
            })();
            exports_1("AlphaIndexerComponent", AlphaIndexerComponent);
        }
    }
});
//# sourceMappingURL=alphaIndexer.component.js.map