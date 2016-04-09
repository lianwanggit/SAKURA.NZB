import {Directive, ElementRef, Input, Output, EventEmitter, Inject} from 'angular2/core';
import Clipboard from 'clipboard';

declare var $: any;

@Directive({
	selector: '[clipboard]'
})
export class ClipboardDirective {
	clipboard: Clipboard;

	@Input('clipboard') text: string;
	@Output() clipboardSuccess: EventEmitter<any> = new EventEmitter();
	@Output() clipboardError: EventEmitter<any> = new EventEmitter();

	constructor( @Inject(ElementRef) public eltRef: ElementRef) {
	}

	ngOnInit() {
		$(this.eltRef.nativeElement).attr('data-clipboard-text', this.text);
		this.clipboard = new Clipboard(this.eltRef.nativeElement, {
			target: () => {
				return this.eltRef.nativeElement;
			}
		});

		this.clipboard.on('success', (e) => {
			console.log(this.text);
			this.clipboardSuccess.emit(null);
		});

		this.clipboard.on('error', (e) => {
			this.clipboardError.emit(null);
		});
	}

	ngOnDestroy() {
		if (this.clipboard) {
			this.clipboard.destroy();
		}
	}
}