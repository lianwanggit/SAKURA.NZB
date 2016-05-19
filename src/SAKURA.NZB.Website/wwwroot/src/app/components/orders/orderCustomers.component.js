System.register(["angular2/core", "angular2/common", 'angular2/http', "../api.service", "../../directives/alphaIndexer.directive", "./models", "../customers/edit.component", "../../validators/numberValidator", "ng2-bootstrap/ng2-bootstrap"], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, api_service_1, alphaIndexer_directive_1, models_1, edit_component_1, numberValidator_1, ng2_bootstrap_1;
    var CustomerKvp, OrderCustomersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
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
            function (numberValidator_1_1) {
                numberValidator_1 = numberValidator_1_1;
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
                function OrderCustomersComponent(http) {
                    this.http = http;
                    this.selectedCustomer = null;
                    this.selectedExCustomerName = '';
                    this.allCustomers = [];
                    var that = this;
                    this.recipientGroup = new common_1.ControlGroup({
                        recipient: new common_1.Control(null, common_1.Validators.required),
                        phone: new common_1.Control(null, common_1.Validators.required),
                        address: new common_1.Control(null, common_1.Validators.required)
                    });
                    this.recipientGroup.valueChanges.subscribe(function (data) {
                        if (that.orderModel.isCustomersValid !== that.recipientGroup.valid)
                            that.orderModel.isCustomersValid = that.recipientGroup.valid;
                    });
                    this.expressGroup = new common_1.ControlGroup({
                        orderTime: new common_1.Control(null, common_1.Validators.required),
                        waybill: new common_1.Control(null, common_1.Validators.required),
                        weight: new common_1.Control(null, numberValidator_1.NumberValidator.unspecified),
                        freight: new common_1.Control(null, numberValidator_1.NumberValidator.unspecified)
                    });
                    this.expressGroup.valueChanges.subscribe(function (data) {
                        var valid = (that.orderModel.delivered) ? that.expressGroup.valid : that.isOrderDateValid;
                        if (that.orderModel.isExpressValid !== valid)
                            that.orderModel.isExpressValid = valid;
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
                OrderCustomersComponent.prototype.onExpressModelChanged = function (newValue) {
                    this.orderModel.waybillNumber = this.expressGroup.value.waybill;
                    this.orderModel.weight = this.expressGroup.value.weight;
                    this.orderModel.freight = this.expressGroup.value.freight;
                    this.orderModel.updateSummary();
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
                            that.expressGroup.controls['orderTime'].updateValue(null);
                            that.orderModel.orderTime = null;
                        }
                        else {
                            that.expressGroup.controls['orderTime'].updateValue(e.date.toDate());
                            that.orderModel.orderTime = that.expressGroup.value.orderTime;
                        }
                    });
                    if (this.viewMode) {
                        jQuery('#orderDate').data("DateTimePicker").disable();
                    }
                };
                OrderCustomersComponent.prototype.getCustomer = function (id) {
                    var that = this;
                    this.http
                        .get(api_service_1.CUSTOMERS_ENDPOINT + id)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        if (!json)
                            return;
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
                        else {
                            that.orderModel.orderTime = jQuery('#orderDate').data("DateTimePicker").date().toDate();
                        }
                        that.expressGroup.controls['orderTime'].updateValue(that.orderModel.orderTime);
                        that.expressGroup.controls['waybill'].updateValue(that.orderModel.waybillNumber);
                        that.expressGroup.controls['weight'].updateValue(that.orderModel.weight);
                        that.expressGroup.controls['freight'].updateValue(that.orderModel.freight);
                    }, function (error) { return console.error(error); });
                };
                OrderCustomersComponent.prototype.getCustomers = function () {
                    var that = this;
                    this.http
                        .get(api_service_1.CUSTOMERS_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        if (!json)
                            return;
                        var list = [].ToList();
                        json.forEach(function (x) {
                            var c = new edit_component_1.Customer(x);
                            list.Add(new alphaIndexer_directive_1.Element(c.id, c.fullName, c.namePinYin));
                            var kvp = new CustomerKvp(c.id, c.fullName);
                            that.allCustomers.push(kvp);
                        });
                        that.elementSource = list.ToArray();
                    }, function (error) { return console.error(error); });
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
                Object.defineProperty(OrderCustomersComponent.prototype, "isOrderDateValid", {
                    get: function () { return this.expressGroup.controls['orderTime'].valid; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderCustomersComponent.prototype, "strOrderDate", {
                    get: function () { return moment(this.orderModel.orderTime).format('DD/MM/YYYY'); },
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
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, alphaIndexer_directive_1.AlphaIndexerDirective, ng2_bootstrap_1.TYPEAHEAD_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], OrderCustomersComponent);
                return OrderCustomersComponent;
            }());
            exports_1("OrderCustomersComponent", OrderCustomersComponent);
        }
    }
});
//# sourceMappingURL=orderCustomers.component.js.map