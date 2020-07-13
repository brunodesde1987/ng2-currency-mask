import { InjectionToken, forwardRef, ɵɵdirectiveInject, ElementRef, KeyValueDiffers, ɵɵdefineDirective, ɵɵlistener, ɵɵProvidersFeature, ɵsetClassMetadata, Directive, Optional, Inject, Input, HostListener, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

let CURRENCY_MASK_CONFIG = new InjectionToken("currency.mask.config");

class InputManager {
    constructor(htmlInputElement) {
        this.htmlInputElement = htmlInputElement;
    }
    setCursorAt(position) {
        if (this.htmlInputElement.setSelectionRange) {
            this.htmlInputElement.focus();
            this.htmlInputElement.setSelectionRange(position, position);
        }
        else if (this.htmlInputElement.createTextRange) {
            let textRange = this.htmlInputElement.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd("character", position);
            textRange.moveStart("character", position);
            textRange.select();
        }
    }
    updateValueAndCursor(newRawValue, oldLength, selectionStart) {
        this.rawValue = newRawValue;
        let newLength = newRawValue.length;
        selectionStart = selectionStart - (oldLength - newLength);
        this.setCursorAt(selectionStart);
    }
    get canInputMoreNumbers() {
        let haventReachedMaxLength = !(this.rawValue.length >= this.htmlInputElement.maxLength && this.htmlInputElement.maxLength >= 0);
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        let haveNumberSelected = (selectionStart != selectionEnd && this.htmlInputElement.value.substring(selectionStart, selectionEnd).match(/\d/)) ? true : false;
        let startWithZero = (this.htmlInputElement.value.substring(0, 1) == "0");
        return haventReachedMaxLength || haveNumberSelected || startWithZero;
    }
    get inputSelection() {
        let selectionStart = 0;
        let selectionEnd = 0;
        if (typeof this.htmlInputElement.selectionStart == "number" && typeof this.htmlInputElement.selectionEnd == "number") {
            selectionStart = this.htmlInputElement.selectionStart;
            selectionEnd = this.htmlInputElement.selectionEnd;
        }
        else {
            let range = document.getSelection().anchorNode;
            if (range && range.firstChild == this.htmlInputElement) {
                let lenght = this.htmlInputElement.value.length;
                let normalizedValue = this.htmlInputElement.value.replace(/\r\n/g, "\n");
                let startRange = this.htmlInputElement.createTextRange();
                let endRange = this.htmlInputElement.createTextRange();
                endRange.collapse(false);
                if (startRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    selectionStart = selectionEnd = lenght;
                }
                else {
                    selectionStart = -startRange.moveStart("character", -lenght);
                    selectionStart += normalizedValue.slice(0, selectionStart).split("\n").length - 1;
                    if (startRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        selectionEnd = lenght;
                    }
                    else {
                        selectionEnd = -startRange.moveEnd("character", -lenght);
                        selectionEnd += normalizedValue.slice(0, selectionEnd).split("\n").length - 1;
                    }
                }
            }
        }
        return {
            selectionStart: selectionStart,
            selectionEnd: selectionEnd
        };
    }
    get rawValue() {
        return this.htmlInputElement && this.htmlInputElement.value;
    }
    set rawValue(value) {
        this._storedRawValue = value;
        if (this.htmlInputElement) {
            this.htmlInputElement.value = value;
        }
    }
    get storedRawValue() {
        return this._storedRawValue;
    }
}

class InputService {
    constructor(htmlInputElement, options) {
        this.htmlInputElement = htmlInputElement;
        this.options = options;
        this.inputManager = new InputManager(htmlInputElement);
    }
    addNumber(keyCode) {
        if (!this.rawValue) {
            this.rawValue = this.applyMask(false, "0");
        }
        let keyChar = String.fromCharCode(keyCode);
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart + 1);
    }
    applyMask(isNumber, rawValue) {
        let { allowNegative, decimal, precision, prefix, suffix, thousands, inCents } = this.options;
        rawValue = isNumber && !inCents ? new Number(rawValue).toFixed(precision) : rawValue;
        let onlyNumbers = rawValue.replace(/[^0-9]/g, "");
        if (!onlyNumbers) {
            return "";
        }
        let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        if (integerPart == "") {
            integerPart = "0";
        }
        let newRawValue = integerPart;
        let decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
        if (precision > 0) {
            decimalPart = "0".repeat(precision - decimalPart.length) + decimalPart;
            newRawValue += decimal + decimalPart;
        }
        let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        let operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    }
    clearMask(rawValue) {
        if (rawValue == null || rawValue == "") {
            return null;
        }
        let value = rawValue.replace(this.options.prefix, "").replace(this.options.suffix, "");
        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }
        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }
        const valueFloat = parseFloat(value);
        if (this.options.inCents) {
            return Math.round(valueFloat * 100);
        }
        return valueFloat;
    }
    changeToNegative() {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-" && this.value != 0) {
            let selectionStart = this.inputSelection.selectionStart;
            this.rawValue = "-" + this.rawValue;
            this.updateFieldValue(selectionStart + 1);
        }
    }
    changeToPositive() {
        let selectionStart = this.inputSelection.selectionStart;
        this.rawValue = this.rawValue.replace("-", "");
        this.updateFieldValue(selectionStart - 1);
    }
    fixCursorPosition(forceToEndPosition) {
        let currentCursorPosition = this.inputSelection.selectionStart;
        //if the current cursor position is after the number end position, it is moved to the end of the number, ignoring the prefix or suffix. this behavior can be forced with forceToEndPosition flag
        if (currentCursorPosition > this.getRawValueWithoutSuffixEndPosition() || forceToEndPosition) {
            this.inputManager.setCursorAt(this.getRawValueWithoutSuffixEndPosition());
            //if the current cursor position is before the number start position, it is moved to the start of the number, ignoring the prefix or suffix
        }
        else if (currentCursorPosition < this.getRawValueWithoutPrefixStartPosition()) {
            this.inputManager.setCursorAt(this.getRawValueWithoutPrefixStartPosition());
        }
    }
    getRawValueWithoutSuffixEndPosition() {
        return this.rawValue.length - this.options.suffix.length;
    }
    getRawValueWithoutPrefixStartPosition() {
        return this.value != null && this.value < 0 ? this.options.prefix.length + 1 : this.options.prefix.length;
    }
    removeNumber(keyCode) {
        let { decimal, thousands } = this.options;
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;
        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }
        //there is no selection
        if (selectionEnd == selectionStart) {
            //delete key and the target digit is a number
            if ((keyCode == 46 || keyCode == 63272) && /^\d+$/.test(this.rawValue.substring(selectionStart, selectionEnd + 1))) {
                selectionEnd = selectionEnd + 1;
            }
            //delete key and the target digit is the decimal or thousands divider
            if ((keyCode == 46 || keyCode == 63272) && (this.rawValue.substring(selectionStart, selectionEnd + 1) == decimal || this.rawValue.substring(selectionStart, selectionEnd + 1) == thousands)) {
                selectionEnd = selectionEnd + 2;
                selectionStart = selectionStart + 1;
            }
            //backspace key and the target digit is a number
            if (keyCode == 8 && /^\d+$/.test(this.rawValue.substring(selectionStart - 1, selectionEnd))) {
                selectionStart = selectionStart - 1;
            }
            //backspace key and the target digit is the decimal or thousands divider
            if (keyCode == 8 && (this.rawValue.substring(selectionStart - 1, selectionEnd) == decimal || this.rawValue.substring(selectionStart - 1, selectionEnd) == thousands)) {
                selectionStart = selectionStart - 2;
                selectionEnd = selectionEnd - 1;
            }
        }
        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart);
    }
    updateFieldValue(selectionStart) {
        let newRawValue = this.applyMask(false, this.rawValue || "");
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    }
    updateOptions(options) {
        let value = this.value;
        this.options = options;
        this.value = value;
    }
    get canInputMoreNumbers() {
        return this.inputManager.canInputMoreNumbers;
    }
    get inputSelection() {
        return this.inputManager.inputSelection;
    }
    get rawValue() {
        return this.inputManager.rawValue;
    }
    set rawValue(value) {
        this.inputManager.rawValue = value;
    }
    get storedRawValue() {
        return this.inputManager.storedRawValue;
    }
    get value() {
        return this.clearMask(this.rawValue);
    }
    set value(value) {
        this.rawValue = this.applyMask(true, "" + value);
    }
}

class InputHandler {
    constructor(htmlInputElement, options) {
        this.inputService = new InputService(htmlInputElement, options);
        this.htmlInputElement = htmlInputElement;
    }
    handleClick(event, chromeAndroid) {
        let selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart);
        //if there is no selection and the value is not null, the cursor position will be fixed. if the browser is chrome on android, the cursor will go to the end of the number.
        if (selectionRangeLength == 0 && !isNaN(this.inputService.value)) {
            this.inputService.fixCursorPosition(chromeAndroid);
        }
    }
    handleCut(event) {
        if (this.isReadOnly()) {
            return;
        }
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 0);
    }
    handleInput(event) {
        if (this.isReadOnly()) {
            return;
        }
        let keyCode = this.getNewKeyCode(this.inputService.storedRawValue, this.inputService.rawValue);
        let rawValueLength = this.inputService.rawValue.length;
        let rawValueSelectionEnd = this.inputService.inputSelection.selectionEnd;
        let rawValueWithoutSuffixEndPosition = this.inputService.getRawValueWithoutSuffixEndPosition();
        let storedRawValueLength = this.inputService.storedRawValue.length;
        this.inputService.rawValue = this.inputService.storedRawValue;
        if ((rawValueSelectionEnd != rawValueWithoutSuffixEndPosition || Math.abs(rawValueLength - storedRawValueLength) != 1) && storedRawValueLength != 0) {
            this.setCursorPosition(event);
            return;
        }
        if (rawValueLength < storedRawValueLength) {
            if (this.inputService.value != 0) {
                this.inputService.removeNumber(8);
            }
            else {
                this.setValue(null);
            }
        }
        if (rawValueLength > storedRawValueLength) {
            switch (keyCode) {
                case 43:
                    this.inputService.changeToPositive();
                    break;
                case 45:
                    this.inputService.changeToNegative();
                    break;
                default:
                    if (!this.inputService.canInputMoreNumbers || (isNaN(this.inputService.value) && String.fromCharCode(keyCode).match(/\d/) == null)) {
                        return;
                    }
                    this.inputService.addNumber(keyCode);
            }
        }
        this.setCursorPosition(event);
        this.onModelChange(this.inputService.value);
    }
    handleKeydown(event) {
        if (this.isReadOnly()) {
            return;
        }
        let keyCode = event.which || event.charCode || event.keyCode;
        if (keyCode == 8 || keyCode == 46 || keyCode == 63272) {
            event.preventDefault();
            let selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart);
            if (selectionRangeLength == this.inputService.rawValue.length || this.inputService.value == 0) {
                this.setValue(null);
                this.onModelChange(this.inputService.value);
            }
            if (selectionRangeLength == 0 && !isNaN(this.inputService.value)) {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
            if ((keyCode === 8 || keyCode === 46) && selectionRangeLength != 0 && !isNaN(this.inputService.value)) {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
        }
    }
    handleKeypress(event) {
        if (this.isReadOnly()) {
            return;
        }
        let keyCode = event.which || event.charCode || event.keyCode;
        if (keyCode == undefined || [9, 13].indexOf(keyCode) != -1 || this.isArrowEndHomeKeyInFirefox(event)) {
            return;
        }
        switch (keyCode) {
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (this.inputService.canInputMoreNumbers && (!isNaN(this.inputService.value) || String.fromCharCode(keyCode).match(/\d/) != null)) {
                    this.inputService.addNumber(keyCode);
                }
        }
        event.preventDefault();
        this.onModelChange(this.inputService.value);
    }
    handleKeyup(event) {
        this.inputService.fixCursorPosition();
    }
    handlePaste(event) {
        if (this.isReadOnly()) {
            return;
        }
        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 1);
    }
    updateOptions(options) {
        this.inputService.updateOptions(options);
    }
    getOnModelChange() {
        return this.onModelChange;
    }
    setOnModelChange(callbackFunction) {
        this.onModelChange = callbackFunction;
    }
    getOnModelTouched() {
        return this.onModelTouched;
    }
    setOnModelTouched(callbackFunction) {
        this.onModelTouched = callbackFunction;
    }
    setValue(value) {
        this.inputService.value = value;
    }
    getNewKeyCode(oldString, newString) {
        if (oldString.length > newString.length) {
            return null;
        }
        for (let x = 0; x < newString.length; x++) {
            if (oldString.length == x || oldString[x] != newString[x]) {
                return newString.charCodeAt(x);
            }
        }
    }
    isArrowEndHomeKeyInFirefox(event) {
        if ([35, 36, 37, 38, 39, 40].indexOf(event.keyCode) != -1 && (event.charCode == undefined || event.charCode == 0)) {
            return true;
        }
        return false;
    }
    isReadOnly() {
        return this.htmlInputElement && this.htmlInputElement.readOnly;
    }
    setCursorPosition(event) {
        let rawValueWithoutSuffixEndPosition = this.inputService.getRawValueWithoutSuffixEndPosition();
        setTimeout(function () {
            event.target.setSelectionRange(rawValueWithoutSuffixEndPosition, rawValueWithoutSuffixEndPosition);
        }, 0);
    }
}

const CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyMaskDirective),
    multi: true
};
class CurrencyMaskDirective {
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
CurrencyMaskDirective.ɵfac = function CurrencyMaskDirective_Factory(t) { return new (t || CurrencyMaskDirective)(ɵɵdirectiveInject(CURRENCY_MASK_CONFIG, 8), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(KeyValueDiffers)); };
CurrencyMaskDirective.ɵdir = ɵɵdefineDirective({ type: CurrencyMaskDirective, selectors: [["", "currencyMask", ""]], hostBindings: function CurrencyMaskDirective_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("blur", function CurrencyMaskDirective_blur_HostBindingHandler($event) { return ctx.handleBlur($event); })("click", function CurrencyMaskDirective_click_HostBindingHandler($event) { return ctx.handleClick($event); })("cut", function CurrencyMaskDirective_cut_HostBindingHandler($event) { return ctx.handleCut($event); })("input", function CurrencyMaskDirective_input_HostBindingHandler($event) { return ctx.handleInput($event); })("keydown", function CurrencyMaskDirective_keydown_HostBindingHandler($event) { return ctx.handleKeydown($event); })("keypress", function CurrencyMaskDirective_keypress_HostBindingHandler($event) { return ctx.handleKeypress($event); })("keyup", function CurrencyMaskDirective_keyup_HostBindingHandler($event) { return ctx.handleKeyup($event); })("paste", function CurrencyMaskDirective_paste_HostBindingHandler($event) { return ctx.handlePaste($event); });
    } }, inputs: { max: "max", min: "min", options: "options" }, features: [ɵɵProvidersFeature([
            CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR,
            { provide: NG_VALIDATORS, useExisting: CurrencyMaskDirective, multi: true }
        ])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CurrencyMaskDirective, [{
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
            }] }, { type: ElementRef }, { type: KeyValueDiffers }]; }, { max: [{
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

class CurrencyMaskModule {
}
CurrencyMaskModule.ɵmod = ɵɵdefineNgModule({ type: CurrencyMaskModule });
CurrencyMaskModule.ɵinj = ɵɵdefineInjector({ factory: function CurrencyMaskModule_Factory(t) { return new (t || CurrencyMaskModule)(); }, imports: [[
            CommonModule,
            FormsModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(CurrencyMaskModule, { declarations: [CurrencyMaskDirective], imports: [CommonModule,
        FormsModule], exports: [CurrencyMaskDirective] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(CurrencyMaskModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: [
                    CurrencyMaskDirective
                ],
                exports: [
                    CurrencyMaskDirective
                ]
            }]
    }], null, null); })();

/*
 * Public API Surface of currency-mask
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR, CURRENCY_MASK_CONFIG, CurrencyMaskDirective, CurrencyMaskModule };
//# sourceMappingURL=ng2-currency-mask.js.map
