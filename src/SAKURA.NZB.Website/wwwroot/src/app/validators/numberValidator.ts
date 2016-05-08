import {Control} from "angular2/common";

export interface ValidationResult {
	[key: string]: boolean;
}

export class NumberValidator {
	static unspecified(control: Control): ValidationResult {
		if (control.value) {
			var value = parseInt(control.value, 10);
			if (!isNaN(value) && (value > 0))
				return null;
		}

		return { 'unspecified': true };
	}
}