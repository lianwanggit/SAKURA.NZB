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
    var Item, Brand, BrandIndexerDirective;
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
            Item = (function () {
                function Item(id, name, brand) {
                    this.id = id;
                    this.name = name;
                    this.brand = brand;
                    this.selected = false;
                    this.visible = true;
                }
                return Item;
            }());
            exports_1("Item", Item);
            Brand = (function () {
                function Brand(name, count) {
                    this.name = name;
                    this.count = count;
                    this.selected = false;
                    this.visible = true;
                }
                return Brand;
            }());
            exports_1("Brand", Brand);
            BrandIndexerDirective = (function () {
                function BrandIndexerDirective() {
                    this.brandList = [];
                    this.itemList = [];
                    this.filterText = '';
                    this._filterText = '';
                    this._brand = '';
                    this.height = 500;
                    this.selectionChanged = new core_1.EventEmitter();
                }
                BrandIndexerDirective.prototype.ngOnChanges = function (changes) {
                    if (this.items) {
                        var list = this.brandList.ToList();
                        this.items.forEach(function (x) {
                            var item = list.FirstOrDefault(function (b) { return b.name == x.brand; });
                            if (!item)
                                list.Add(new Brand(x.brand, 1));
                            else
                                item.count += 1;
                        });
                        this.brandList = list.OrderBy(function (b) { return b.name; }).ToArray();
                        this.itemList = this.items.slice();
                        this.onClickElement(this.selectedId);
                    }
                };
                BrandIndexerDirective.prototype.onClearFilter = function () {
                    this.onSearch('');
                };
                BrandIndexerDirective.prototype.onSearch = function (value) {
                    var _this = this;
                    this.clearIndexSelection();
                    this.restoreIndexVisibility();
                    if (this.filterText !== value)
                        this.filterText = value;
                    if (this.filterText === this._filterText)
                        return;
                    this.itemList = [];
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
                        this.brandList.forEach(function (b) {
                            b.visible = _this.startsWith(b.name, _this.filterText);
                        });
                        if (this.filterText == '') {
                            this.itemList = this.items.ToList()
                                .OrderBy(function (x) { return x.name; })
                                .ToArray();
                        }
                        else {
                            var brand = this.brandList.ToList().FirstOrDefault(function (x) { return x.visible; });
                            if (brand) {
                                this.onClickIndexer(brand.name, false);
                            }
                        }
                    }
                    this._filterText = this.filterText;
                };
                BrandIndexerDirective.prototype.onClickIndexer = function (brand, toggle) {
                    if (toggle === void 0) { toggle = true; }
                    if (this._brand === brand && toggle) {
                        this.clearIndexSelection();
                        this.itemList = this.items.ToList()
                            .OrderBy(function (x) { return x.name; })
                            .ToArray();
                        return;
                    }
                    this.brandList.forEach(function (x) {
                        x.selected = x.name === brand;
                    });
                    this.itemList = this.items.ToList()
                        .Where(function (x) { return x.brand === brand; })
                        .OrderBy(function (x) { return x.name; })
                        .ToArray();
                    this._brand = brand;
                };
                BrandIndexerDirective.prototype.onClickElement = function (id) {
                    var _this = this;
                    this.items.forEach(function (x) {
                        if (x.id.toString() == id) {
                            _this.selectedId = id;
                            _this.selectionChanged.emit(id);
                        }
                    });
                };
                BrandIndexerDirective.prototype.clearIndexSelection = function () {
                    var _this = this;
                    var index = this.brandList.ToList().FirstOrDefault(function (x) { return x.name == _this._brand; });
                    if (index)
                        index.selected = false;
                    this._brand = '';
                };
                BrandIndexerDirective.prototype.restoreIndexVisibility = function () {
                    this.brandList.forEach(function (b) { b.visible = true; });
                };
                BrandIndexerDirective.prototype.startsWith = function (str, searchString) {
                    return str.toLowerCase().substr(0, searchString.length) === searchString.toLowerCase();
                };
                ;
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], BrandIndexerDirective.prototype, "items", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], BrandIndexerDirective.prototype, "selectedId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BrandIndexerDirective.prototype, "height", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], BrandIndexerDirective.prototype, "selectionChanged", void 0);
                BrandIndexerDirective = __decorate([
                    core_1.Component({
                        selector: "brand-indexer",
                        templateUrl: "./src/app/directives/brandIndexer.html",
                        styleUrls: ["./src/app/directives/alpha-indexer.css",
                            "./src/app/directives/brand-indexer.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], BrandIndexerDirective);
                return BrandIndexerDirective;
            }());
            exports_1("BrandIndexerDirective", BrandIndexerDirective);
        }
    }
});
//# sourceMappingURL=brandIndexer.directive.js.map