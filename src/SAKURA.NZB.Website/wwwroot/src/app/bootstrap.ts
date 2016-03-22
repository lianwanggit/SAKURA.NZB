﻿import {bootstrap}    from "angular2/platform/browser"
import {ROUTER_PROVIDERS} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";

import {AppComponent} from "./component/app"

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS])
.then(
	//success => console.log('AppComponent bootstrapped!')
).catch(
	error => console.log(error)
);