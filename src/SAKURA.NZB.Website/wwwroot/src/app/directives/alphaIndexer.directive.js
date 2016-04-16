/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    var Element, Indexer, AlphaIndexerDirective;
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
                    this.selected = false;
                }
                return Element;
            }());
            exports_1("Element", Element);
            Indexer = (function () {
                function Indexer(l, c) {
                    this.letter = l;
                    this.count = c;
                    this.selected = false;
                }
                return Indexer;
            }());
            exports_1("Indexer", Indexer);
            AlphaIndexerDirective = (function () {
                function AlphaIndexerDirective() {
                    this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    this.indexerList = [];
                    this.elementList = [];
                    this.filterText = '';
                    this._filterText = '';
                    this._indexer = '';
                    this._selectedId = '';
                    this.height = 500;
                    this.selectedId = new core_1.EventEmitter();
                }
                AlphaIndexerDirective.prototype.ngOnChanges = function (changes) {
                    //console.log(JSON.stringify(changes));
                    if (this.elements) {
                        var list = this.alphabet.ToList().Select(function (x) { return new Indexer(x, 0); });
                        this.elements.forEach(function (x) {
                            var item = list.First(function (i) { return i.letter === x.index; });
                            item.count += 1;
                        });
                        this.indexerList = list.Where(function (x) { return x.count > 0; }).ToArray();
                        this.elementList = this.elements.ToList()
                            .OrderBy(function (x) { return x.pinyin; })
                            .ToArray();
                        this.onClickElement(this.initialSelectedId);
                    }
                };
                AlphaIndexerDirective.prototype.onClearFilter = function () {
                    this.onSearch('');
                };
                AlphaIndexerDirective.prototype.onSearch = function (value) {
                    var _this = this;
                    this.clearIndexSelection();
                    if (this.filterText !== value)
                        this.filterText = value;
                    if (this.filterText === this._filterText)
                        return;
                    this.elementList = [];
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z ]+$/g.test(this.filterText)) {
                        this.elementList = this.elements.ToList()
                            .Where(function (x) { return _this.startsWith(x.name, _this.filterText) ||
                            _this.startsWith(x.pinyin.toLowerCase(), _this.filterText.toLowerCase()); })
                            .OrderBy(function (x) { return x.pinyin; })
                            .ToArray();
                    }
                    this._filterText = this.filterText;
                };
                AlphaIndexerDirective.prototype.onClickIndexer = function (letter) {
                    //toggle
                    if (this._indexer === letter) {
                        this.clearIndexSelection();
                        this.elementList = this.elements.ToList()
                            .OrderBy(function (x) { return x.pinyin; })
                            .ToArray();
                        return;
                    }
                    this.indexerList.forEach(function (x) {
                        x.selected = x.letter === letter;
                    });
                    this.elementList = this.elements.ToList()
                        .Where(function (x) { return x.index === letter; })
                        .OrderBy(function (x) { return x.pinyin; })
                        .ToArray();
                    this._indexer = letter;
                };
                AlphaIndexerDirective.prototype.onClickElement = function (id) {
                    var _this = this;
                    if (this._selectedId == id)
                        return;
                    this.elements.forEach(function (x) {
                        if (x.id.toString() == id) {
                            x.selected = true;
                            _this.selectedId.emit(x.id);
                        }
                        else
                            x.selected = false;
                    });
                    this._selectedId = id;
                };
                AlphaIndexerDirective.prototype.clearIndexSelection = function () {
                    var _this = this;
                    var index = this.indexerList.ToList().FirstOrDefault(function (x) { return x.letter == _this._indexer; });
                    if (index)
                        index.selected = false;
                    this._indexer = '';
                };
                AlphaIndexerDirective.prototype.clearElementSelection = function () {
                    var _this = this;
                    var element = this.elementList.ToList().FirstOrDefault(function (x) { return x.id.toString() == _this._selectedId; });
                    if (element)
                        element.selected = false;
                    this._selectedId = '';
                };
                AlphaIndexerDirective.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], AlphaIndexerDirective.prototype, "elements", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], AlphaIndexerDirective.prototype, "initialSelectedId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], AlphaIndexerDirective.prototype, "height", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AlphaIndexerDirective.prototype, "selectedId", void 0);
                AlphaIndexerDirective = __decorate([
                    core_1.Component({
                        selector: "alpha-indexer",
                        templateUrl: "./src/app/directives/alphaIndexer.html",
                        styleUrls: ["./src/app/directives/alpha-indexer.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AlphaIndexerDirective);
                return AlphaIndexerDirective;
            }());
            exports_1("AlphaIndexerDirective", AlphaIndexerDirective);
        }
    }
});
//# sourceMappingURL=alphaIndexer.directive.js.map