System.register(["angular2/core", "angular2/common", "../api.service", "../../directives/alphaIndexer.directive", "../customers/edit.component", "ng2-bootstrap/ng2-bootstrap"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, api_service_1, alphaIndexer_directive_1, edit_component_1, ng2_bootstrap_1;
    var CustomerKvp, CustomerInfo, OrderCustomersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (alphaIndexer_directive_1_1) {
                alphaIndexer_directive_1 = alphaIndexer_directive_1_1;
            },
            function (edit_component_1_1) {
                edit_component_1 = edit_component_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            }],
        execute: function() {
            CustomerKvp = (function () {
                function CustomerKvp(id, name) {
                    this.id = id;
                    this.name = name;
                }
                return CustomerKvp;
            })();
            exports_1("CustomerKvp", CustomerKvp);
            CustomerInfo = (function () {
                function CustomerInfo(recipient, phone, address) {
                    this.recipient = recipient;
                    this.phone = phone;
                    this.address = address;
                    this.customers = [];
                }
                Object.defineProperty(CustomerInfo.prototype, "exCustomers", {
                    get: function () { return this.customers.length == 0 ? [] : this.customers.slice(1); },
                    enumerable: true,
                    configurable: true
                });
                return CustomerInfo;
            })();
            exports_1("CustomerInfo", CustomerInfo);
            OrderCustomersComponent = (function () {
                function OrderCustomersComponent(service) {
                    this.service = service;
                    this.selectedCustomer = null;
                    this.selectedExCustomerName = '';
                    this.allCustomers = [];
                    this.modelChange = new core_1.EventEmitter();
                }
                OrderCustomersComponent.prototype.ngOnInit = function () {
                    var that = this;
                    this.getCustomers();
                };
                OrderCustomersComponent.prototype.onElementSelected = function (id) {
                    this.getCustomer(id);
                };
                OrderCustomersComponent.prototype.onSelectPhone = function (phone) {
                    this.customerInfo.phone = phone;
                };
                OrderCustomersComponent.prototype.onSelectAddress = function (address) {
                    this.customerInfo.address = address;
                };
                OrderCustomersComponent.prototype.onSelectExCustomer = function (e) {
                    var _this = this;
                    setTimeout(function (_) { return _this.selectedExCustomerName = ''; }, 300);
                    if (e.item.id == this.selectedCustomer.id)
                        return;
                    this.customerInfo.customers.push(e.item);
                };
                OrderCustomersComponent.prototype.onRemoveExCustomer = function (id) {
                    for (var i = this.customerInfo.customers.length - 1; i--;) {
                        if (this.customerInfo.customers[i].id.toString() == id) {
                            this.customerInfo.customers.splice(i, 1);
                            return;
                        }
                    }
                };
                OrderCustomersComponent.prototype.getCustomer = function (id) {
                    var _this = this;
                    var that = this;
                    this.service.getCustomer(id, function (json) {
                        if (json) {
                            that.selectedCustomer = new edit_component_1.Customer(json);
                            that.customerInfo.recipient = that.selectedCustomer.fullName;
                            that.customerInfo.phone = that.selectedCustomer.phone1;
                            that.customerInfo.address = that.selectedCustomer.address;
                            var kvp = new CustomerKvp(that.selectedCustomer.id, that.selectedCustomer.fullName);
                            _this.customerInfo.customers = [];
                            that.customerInfo.customers.push(kvp);
                        }
                    });
                };
                OrderCustomersComponent.prototype.getCustomers = function () {
                    var that = this;
                    this.service.getCustomers(function (json) {
                        if (json) {
                            var list = [].ToList();
                            json.forEach(function (x) {
                                var c = new edit_component_1.Customer(x);
                                list.Add(new alphaIndexer_directive_1.Element(c.id, c.fullName, c.namePinYin));
                                var kvp = new CustomerKvp(c.id, c.fullName);
                                that.allCustomers.push(kvp);
                            });
                            that.elementSource = list.ToArray();
                        }
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', CustomerInfo)
                ], OrderCustomersComponent.prototype, "customerInfo", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], OrderCustomersComponent.prototype, "modelChange", void 0);
                OrderCustomersComponent = __decorate([
                    core_1.Component({
                        selector: "order-customer",
                        templateUrl: "./src/app/components/orders/orderCustomers.html",
                        styleUrls: ["./src/app/components/orders/orderCustomers.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, alphaIndexer_directive_1.AlphaIndexerDirective, ng2_bootstrap_1.TYPEAHEAD_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], OrderCustomersComponent);
                return OrderCustomersComponent;
            })();
            exports_1("OrderCustomersComponent", OrderCustomersComponent);
        }
    }
});
//# sourceMappingURL=orderCustomers.component.js.map