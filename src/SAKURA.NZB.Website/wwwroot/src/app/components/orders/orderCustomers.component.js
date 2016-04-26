System.register(["angular2/core", "angular2/common", "../api.service", "../../directives/alphaIndexer.directive", "./models", "../customers/edit.component", "ng2-bootstrap/ng2-bootstrap"], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, alphaIndexer_directive_1, models_1, edit_component_1, ng2_bootstrap_1;
    var CustomerKvp, OrderCustomersComponent;
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
            function (models_1_1) {
                models_1 = models_1_1;
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
            }());
            exports_1("CustomerKvp", CustomerKvp);
            OrderCustomersComponent = (function () {
                function OrderCustomersComponent(service) {
                    this.service = service;
                    this.selectedCustomer = null;
                    this.selectedExCustomerName = '';
                    this.allCustomers = [];
                    this.isOrderTimeValid = true;
                    this.recipientGroup = new common_1.ControlGroup({
                        recipient: new common_1.Control(null, common_1.Validators.required),
                        phone: new common_1.Control(null, common_1.Validators.required),
                        address: new common_1.Control(null, common_1.Validators.required)
                    });
                    var that = this;
                    this.recipientGroup.valueChanges.subscribe(function (data) {
                        if (that.orderModel.isCustomersValid !== that.recipientGroup.valid)
                            that.orderModel.isCustomersValid = that.recipientGroup.valid;
                    });
                }
                OrderCustomersComponent.prototype.ngOnInit = function () {
                    this.getCustomers();
                };
                OrderCustomersComponent.prototype.ngAfterViewInit = function () {
                    this.initialiseDatePicker();
                };
                OrderCustomersComponent.prototype.onElementSelected = function (id) {
                    this.getCustomer(id);
                };
                OrderCustomersComponent.prototype.onSelectPhone = function (phone) {
                    this.orderModel.phone = phone;
                    this.recipientGroup.controls['phone'].updateValue(phone);
                    this.onModelChanged(phone);
                };
                OrderCustomersComponent.prototype.onSelectAddress = function (address) {
                    this.orderModel.address = address;
                    this.recipientGroup.controls['address'].updateValue(address);
                    this.onModelChanged(address);
                };
                OrderCustomersComponent.prototype.onSelectExCustomer = function (e) {
                    var _this = this;
                    setTimeout(function (_) { return _this.selectedExCustomerName = ''; }, 300);
                    if (e.item.id == this.selectedCustomer.id)
                        return;
                    var co = new models_1.CustomerOrder(e.item.id, e.item.name, []);
                    this.orderModel.customerOrders.push(co);
                };
                OrderCustomersComponent.prototype.onRemoveExCustomer = function (id) {
                    for (var i = this.orderModel.customerOrders.length; i--;) {
                        if (this.orderModel.customerOrders[i].customerId.toString() == id) {
                            this.orderModel.customerOrders.splice(i, 1);
                            return;
                        }
                    }
                };
                OrderCustomersComponent.prototype.onModelChanged = function (newValue, updateRecipient) {
                    if (updateRecipient === void 0) { updateRecipient = false; }
                    if (updateRecipient) {
                        this.orderModel.recipient = this.recipientGroup.value.recipient;
                        this.orderModel.phone = this.recipientGroup.value.phone;
                        this.orderModel.address = this.recipientGroup.value.address;
                    }
                    this.orderModel.updateExpressText();
                };
                OrderCustomersComponent.prototype.initialiseDatePicker = function () {
                    var that = this;
                    var today = moment().startOf('day');
                    var lastYear = moment().add(-1, 'y').endOf('day');
                    jQuery('#orderDate').datetimepicker({
                        locale: 'en-nz',
                        format: 'L',
                        minDate: lastYear,
                        maxDate: today,
                        ignoreReadonly: true,
                        allowInputToggle: true
                    });
                    jQuery('#orderDate').data("DateTimePicker").showTodayButton(true);
                    jQuery('#orderDate').data("DateTimePicker").showClear(true);
                    jQuery('#orderDate').data("DateTimePicker").showClose(true);
                    jQuery('#orderDate').data("DateTimePicker").defaultDate(today);
                    jQuery('#orderDate').on("dp.change", function (e) {
                        if (!e.date) {
                            that.isOrderTimeValid = false;
                            that.orderModel.orderTime = null;
                        }
                        else {
                            that.isOrderTimeValid = true;
                            that.orderModel.orderTime = e.date.toDate();
                        }
                        that.orderModel.isCustomersValid = that.orderModel.isCustomersValid && that.isOrderTimeValid;
                    });
                    if (this.viewMode) {
                        jQuery('#orderDate').data("DateTimePicker").disable();
                    }
                };
                OrderCustomersComponent.prototype.getCustomer = function (id) {
                    var that = this;
                    this.service.getCustomer(id, function (json) {
                        if (json) {
                            that.selectedCustomer = new edit_component_1.Customer(json);
                            if (that.orderModel.id != 0 && that.orderModel.customerOrders.length
                                && that.orderModel.customerOrders[0].customerId.toString() == id) {
                                that.recipientGroup.controls['recipient'].updateValue(that.orderModel.recipient);
                                that.recipientGroup.controls['phone'].updateValue(that.orderModel.phone);
                                that.recipientGroup.controls['address'].updateValue(that.orderModel.address);
                            }
                            else {
                                that.recipientGroup.controls['recipient'].updateValue(that.selectedCustomer.fullName);
                                that.recipientGroup.controls['phone'].updateValue(that.selectedCustomer.phone1);
                                that.recipientGroup.controls['address'].updateValue(that.selectedCustomer.address);
                                var co = new models_1.CustomerOrder(that.selectedCustomer.id, that.selectedCustomer.fullName, []);
                                that.orderModel.customerOrders = [];
                                that.orderModel.customerOrders.push(co);
                                that.onModelChanged(co, true);
                            }
                            if (that.orderModel.orderTime) {
                                jQuery('#orderDate').data("DateTimePicker").date(moment(that.orderModel.orderTime));
                            }
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
                Object.defineProperty(OrderCustomersComponent.prototype, "customerId", {
                    get: function () { return this.orderModel.customerOrders.length ? this.orderModel.customerOrders[0].customerId : ''; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderCustomersComponent.prototype, "exCustomers", {
                    get: function () { return this.orderModel.customerOrders.length == 0 ? [] : this.orderModel.customerOrders.slice(1); },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', models_1.OrderModel)
                ], OrderCustomersComponent.prototype, "orderModel", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], OrderCustomersComponent.prototype, "viewMode", void 0);
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
            }());
            exports_1("OrderCustomersComponent", OrderCustomersComponent);
        }
    }
});
//# sourceMappingURL=orderCustomers.component.js.map