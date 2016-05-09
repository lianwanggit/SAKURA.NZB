import {Control} from "angular2/common";
declare var jQuery: any;

export interface ValidationResult {
	[key: string]: boolean;
}

export class NumberValidator {
	static unspecified(control: Control): ValidationResult {
		if (jQuery.isNumeric(control.value)) {
			return null;
		}

		return { 'unspecified': true };
	}
}

export class PositiveNumberValidator {
	static unspecified(control: Control): ValidationResult {
		if (/^[1-9]\d*$/.test(control.value)) {
				return null;
		}

		return { 'unspecified': true };
	}
}