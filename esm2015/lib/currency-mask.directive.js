import { Directive, forwardRef, HostListener, Inject, Input, Optional } from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CURRENCY_MASK_CONFIG } from "./currency-mask.config";
import { InputHandler } from "./input.handler";
import * as i0 from "@angular/core";
export const CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyMaskDirective),
    multi: true
};
export class CurrencyMaskDirective {
    constructor(currencyMaskConfig, elementRef, keyValueDiffers) {
        this.currencyMaskConfig = currencyMaskConfig;
        this.elementRef = elementRef;
        this.keyValueDiffers = keyValueDiffers;
        this.options = {};
        this.optionsTemplate = {
            align: "right",
            allowNegative: true,
            decimal: ".",
            precision: 2,
            prefix: "$ ",
            suffix: "",
            thousands: ",",
            inCents: false,
        };
        if (currencyMaskConfig) {
            this.optionsTemplate = currencyMaskConfig;
        }
        this.keyValueDiffer = keyValueDiffers.find({}).create();
    }
    ngAfterViewInit() {
        this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
    }
    ngDoCheck() {
        if (this.keyValueDiffer.diff(this.options)) {
            this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
            this.inputHandler.updateOptions(Object.assign({}, this.optionsTemplate, this.options));
        }
    }
    ngOnInit() {
        this.inputHandler = new InputHandler(this.elementRef.nativeElement, Object.assign({}, this.optionsTemplate, this.options));
    }
    handleBlur(event) {
        this.inputHandler.getOnModelTouched().apply(event);
    }
    handleClick(event) {
        this.inputHandler.handleClick(event, this.isChromeAndroid());
    }
    handleCut(event) {
        if (!this.isChromeAndroid()) {
            this.inputHandler.handleCut(event);
        }
    }
    handleInput(event) {
        if (this.isChromeAndroid()) {
            this.inputHandler.handleInput(event);
        }
    }
    handleKeydown(event) {
        if (!this.isChromeAndroid()) {
            this.inputHandler.handleKeydown(event);
        }
    }
    handleKeypress(event) {
        if (!this.isChromeAndroid()) {
            this.inputHandler.handleKeypress(event);
        }
    }
    handleKeyup(event) {
        if (!this.isChromeAndroid()) {
            this.inputHandler.handleKeyup(event);
        }
    }
    handlePaste(event) {
        if (!this.isChromeAndroid()) {
            this.inputHandler.handlePaste(event);
        }
    }
    isChromeAndroid() {
        return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
    }
    registerOnChange(callbackFunction) {
        this.inputHandler.setOnModelChange(callbackFunction);
    }
    registerOnTouched(callbackFunction) {
        this.inputHandler.setOnModelTouched(callbackFunction);
    }
    setDisabledState(value) {
        this.elementRef.nativeElement.disabled = value;
    }
    validate(abstractControl) {
        let result = {};
        if (abstractControl.value > this.max) {
            result.max = true;
        }
        if (abstractControl.value < this.min) {
            result.min = true;
        }
        return result != {} ? result : null;
    }
    writeValue(value) {
        this.inputHandler.setValue(value);
    }
}
CurrencyMaskDirective.ɵfac = function CurrencyMaskDirective_Factory(t) { return new (t || CurrencyMaskDirective)(i0.ɵɵdirectiveInject(CURRENCY_MASK_CONFIG, 8), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.KeyValueDiffers)); };
CurrencyMaskDirective.ɵdir = i0.ɵɵdefineDirective({ type: CurrencyMaskDirective, selectors: [["", "currencyMask", ""]], hostBindings: function CurrencyMaskDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("blur", function CurrencyMaskDirective_blur_HostBindingHandler($event) { return ctx.handleBlur($event); })("click", function CurrencyMaskDirective_click_HostBindingHandler($event) { return ctx.handleClick($event); })("cut", function CurrencyMaskDirective_cut_HostBindingHandler($event) { return ctx.handleCut($event); })("input", function CurrencyMaskDirective_input_HostBindingHandler($event) { return ctx.handleInput($event); })("keydown", function CurrencyMaskDirective_keydown_HostBindingHandler($event) { return ctx.handleKeydown($event); })("keypress", function CurrencyMaskDirective_keypress_HostBindingHandler($event) { return ctx.handleKeypress($event); })("keyup", function CurrencyMaskDirective_keyup_HostBindingHandler($event) { return ctx.handleKeyup($event); })("paste", function CurrencyMaskDirective_paste_HostBindingHandler($event) { return ctx.handlePaste($event); });
    } }, inputs: { max: "max", min: "min", options: "options" }, features: [i0.ɵɵProvidersFeature([
            CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR,
            { provide: NG_VALIDATORS, useExisting: CurrencyMaskDirective, multi: true }
        ])] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CurrencyMaskDirective, [{
        type: Directive,
        args: [{
                selector: "[currencyMask]",
                providers: [
                    CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR,
                    { provide: NG_VALIDATORS, useExisting: CurrencyMaskDirective, multi: true }
                ]
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [CURRENCY_MASK_CONFIG]
            }] }, { type: i0.ElementRef }, { type: i0.KeyValueDiffers }]; }, { max: [{
            type: Input
        }], min: [{
            type: Input
        }], options: [{
            type: Input
        }], handleBlur: [{
            type: HostListener,
            args: ["blur", ["$event"]]
        }], handleClick: [{
            type: HostListener,
            args: ["click", ["$event"]]
        }], handleCut: [{
            type: HostListener,
            args: ["cut", ["$event"]]
        }], handleInput: [{
            type: HostListener,
            args: ["input", ["$event"]]
        }], handleKeydown: [{
            type: HostListener,
            args: ["keydown", ["$event"]]
        }], handleKeypress: [{
            type: HostListener,
            args: ["keypress", ["$event"]]
        }], handleKeyup: [{
            type: HostListener,
            args: ["keyup", ["$event"]]
        }], handlePaste: [{
            type: HostListener,
            args: ["paste", ["$event"]]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktbWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzItY3VycmVuY3ktbWFzay8iLCJzb3VyY2VzIjpbImxpYi9jdXJyZW5jeS1tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBdUIsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUEyQyxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUssT0FBTyxFQUF5QyxhQUFhLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwSCxPQUFPLEVBQXNCLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUUvQyxNQUFNLENBQUMsTUFBTSxvQ0FBb0MsR0FBUTtJQUNyRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7SUFDcEQsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBU0YsTUFBTSxPQUFPLHFCQUFxQjtJQW9COUIsWUFBOEQsa0JBQXNDLEVBQVUsVUFBc0IsRUFBVSxlQUFnQztRQUFoSCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQWhCckssWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUszQixvQkFBZSxHQUFHO1lBQ2QsS0FBSyxFQUFFLE9BQU87WUFDZCxhQUFhLEVBQUUsSUFBSTtZQUNuQixPQUFPLEVBQUUsR0FBRztZQUNaLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxHQUFHO1lBQ2QsT0FBTyxFQUFFLEtBQUs7U0FDakIsQ0FBQztRQUdFLElBQUksa0JBQWtCLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztTQUM3QztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztJQUN6SCxDQUFDO0lBRUQsU0FBUztRQUNMLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztZQUNySCxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBTyxNQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2pHO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFRLE1BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdEksQ0FBQztJQUdELFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUdELFdBQVcsQ0FBQyxLQUFVO1FBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBR0QsU0FBUyxDQUFDLEtBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztJQUNMLENBQUM7SUFHRCxXQUFXLENBQUMsS0FBVTtRQUNsQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QztJQUNMLENBQUM7SUFHRCxhQUFhLENBQUMsS0FBVTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUdELGNBQWMsQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0lBR0QsV0FBVyxDQUFDLEtBQVU7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QztJQUNMLENBQUM7SUFHRCxXQUFXLENBQUMsS0FBVTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDWCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxnQkFBMEI7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxnQkFBMEI7UUFDeEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFjO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDbkQsQ0FBQztJQUVELFFBQVEsQ0FBQyxlQUFnQztRQUNyQyxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFFckIsSUFBSSxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDckI7UUFFRCxJQUFJLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUVELE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7OzBGQS9IUSxxQkFBcUIsdUJBb0JFLG9CQUFvQjswREFwQjNDLHFCQUFxQjs7a0dBTG5CO1lBQ1Asb0NBQW9DO1lBQ3BDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUM5RTtrREFFUSxxQkFBcUI7Y0FQakMsU0FBUztlQUFDO2dCQUNQLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFNBQVMsRUFBRTtvQkFDUCxvQ0FBb0M7b0JBQ3BDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtpQkFDOUU7YUFDSjs7c0JBcUJnQixRQUFROztzQkFBSSxNQUFNO3VCQUFDLG9CQUFvQjs7a0JBbEJuRCxLQUFLOztrQkFDTCxLQUFLOztrQkFDTCxLQUFLOztrQkF1Q0wsWUFBWTttQkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7O2tCQUsvQixZQUFZO21CQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQzs7a0JBS2hDLFlBQVk7bUJBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDOztrQkFPOUIsWUFBWTttQkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O2tCQU9oQyxZQUFZO21CQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7a0JBT2xDLFlBQVk7bUJBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDOztrQkFPbkMsWUFBWTttQkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O2tCQU9oQyxZQUFZO21CQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRG9DaGVjaywgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3QsIElucHV0LCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9wdGlvbmFsIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0b3IgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEN1cnJlbmN5TWFza0NvbmZpZywgQ1VSUkVOQ1lfTUFTS19DT05GSUcgfSBmcm9tIFwiLi9jdXJyZW5jeS1tYXNrLmNvbmZpZ1wiO1xuaW1wb3J0IHsgSW5wdXRIYW5kbGVyIH0gZnJvbSBcIi4vaW5wdXQuaGFuZGxlclwiO1xuXG5leHBvcnQgY29uc3QgQ1VSUkVOQ1lNQVNLRElSRUNUSVZFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ3VycmVuY3lNYXNrRGlyZWN0aXZlKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiW2N1cnJlbmN5TWFza11cIixcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgQ1VSUkVOQ1lNQVNLRElSRUNUSVZFX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICB7IHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXJyZW5jeU1hc2tEaXJlY3RpdmUsIG11bHRpOiB0cnVlIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEN1cnJlbmN5TWFza0RpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBEb0NoZWNrLCBPbkluaXQsIFZhbGlkYXRvciB7XG5cbiAgICBASW5wdXQoKSBtYXg6IG51bWJlcjtcbiAgICBASW5wdXQoKSBtaW46IG51bWJlcjtcbiAgICBASW5wdXQoKSBvcHRpb25zOiBhbnkgPSB7fTtcblxuICAgIGlucHV0SGFuZGxlcjogSW5wdXRIYW5kbGVyO1xuICAgIGtleVZhbHVlRGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxhbnksIGFueT47XG5cbiAgICBvcHRpb25zVGVtcGxhdGUgPSB7XG4gICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgIGFsbG93TmVnYXRpdmU6IHRydWUsXG4gICAgICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgICAgICBwcmVjaXNpb246IDIsXG4gICAgICAgIHByZWZpeDogXCIkIFwiLFxuICAgICAgICBzdWZmaXg6IFwiXCIsXG4gICAgICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgICAgIGluQ2VudHM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KENVUlJFTkNZX01BU0tfQ09ORklHKSBwcml2YXRlIGN1cnJlbmN5TWFza0NvbmZpZzogQ3VycmVuY3lNYXNrQ29uZmlnLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUga2V5VmFsdWVEaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMpIHtcbiAgICAgICAgaWYgKGN1cnJlbmN5TWFza0NvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zVGVtcGxhdGUgPSBjdXJyZW5jeU1hc2tDb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmtleVZhbHVlRGlmZmVyID0ga2V5VmFsdWVEaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudGV4dEFsaWduID0gdGhpcy5vcHRpb25zLmFsaWduID8gdGhpcy5vcHRpb25zLmFsaWduIDogdGhpcy5vcHRpb25zVGVtcGxhdGUuYWxpZ247XG4gICAgfVxuXG4gICAgbmdEb0NoZWNrKCkge1xuICAgICAgICBpZiAodGhpcy5rZXlWYWx1ZURpZmZlci5kaWZmKHRoaXMub3B0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IHRoaXMub3B0aW9ucy5hbGlnbiA/IHRoaXMub3B0aW9ucy5hbGlnbiA6IHRoaXMub3B0aW9uc1RlbXBsYXRlLmFsaWduO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIudXBkYXRlT3B0aW9ucygoPGFueT5PYmplY3QpLmFzc2lnbih7fSwgdGhpcy5vcHRpb25zVGVtcGxhdGUsIHRoaXMub3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRIYW5kbGVyID0gbmV3IElucHV0SGFuZGxlcih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgKDxhbnk+T2JqZWN0KS5hc3NpZ24oe30sIHRoaXMub3B0aW9uc1RlbXBsYXRlLCB0aGlzLm9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwiYmx1clwiLCBbXCIkZXZlbnRcIl0pXG4gICAgaGFuZGxlQmx1cihldmVudDogYW55KSB7XG4gICAgICAgIHRoaXMuaW5wdXRIYW5kbGVyLmdldE9uTW9kZWxUb3VjaGVkKCkuYXBwbHkoZXZlbnQpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoXCJjbGlja1wiLCBbXCIkZXZlbnRcIl0pXG4gICAgaGFuZGxlQ2xpY2soZXZlbnQ6IGFueSkge1xuICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVDbGljayhldmVudCwgdGhpcy5pc0Nocm9tZUFuZHJvaWQoKSk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcihcImN1dFwiLCBbXCIkZXZlbnRcIl0pXG4gICAgaGFuZGxlQ3V0KGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVDdXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcihcImlucHV0XCIsIFtcIiRldmVudFwiXSlcbiAgICBoYW5kbGVJbnB1dChldmVudDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVJbnB1dChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXG4gICAgaGFuZGxlS2V5ZG93bihldmVudDogYW55KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Nocm9tZUFuZHJvaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIuaGFuZGxlS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwia2V5cHJlc3NcIiwgW1wiJGV2ZW50XCJdKVxuICAgIGhhbmRsZUtleXByZXNzKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVLZXlwcmVzcyhldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwia2V5dXBcIiwgW1wiJGV2ZW50XCJdKVxuICAgIGhhbmRsZUtleXVwKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVLZXl1cChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwicGFzdGVcIiwgW1wiJGV2ZW50XCJdKVxuICAgIGhhbmRsZVBhc3RlKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ2hyb21lQW5kcm9pZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5oYW5kbGVQYXN0ZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0Nocm9tZUFuZHJvaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAvY2hyb21lL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvYW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShjYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0SGFuZGxlci5zZXRPbk1vZGVsQ2hhbmdlKGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGNhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXRIYW5kbGVyLnNldE9uTW9kZWxUb3VjaGVkKGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShhYnN0cmFjdENvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHsgW2tleTogc3RyaW5nXTogYW55OyB9IHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge307XG5cbiAgICAgICAgaWYgKGFic3RyYWN0Q29udHJvbC52YWx1ZSA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICByZXN1bHQubWF4ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhYnN0cmFjdENvbnRyb2wudmFsdWUgPCB0aGlzLm1pbikge1xuICAgICAgICAgICAgcmVzdWx0Lm1pbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0ICE9IHt9ID8gcmVzdWx0IDogbnVsbDtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dEhhbmRsZXIuc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbn0iXX0=