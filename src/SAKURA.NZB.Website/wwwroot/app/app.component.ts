import { Component } from '@angular/core';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

@Component({
	selector: 'my-app',
	template: `<h1>My First Angular 2 App</h1>
	<button md-raised-button color="primary">PRIMARY</button>
<button md-raised-button color="accent">ACCENT</button>
<button md-raised-button color="warn">WARN</button>
`,
	directives: [MD_BUTTON_DIRECTIVES]
})
export class AppComponent { }