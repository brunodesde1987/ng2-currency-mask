import { InputManager } from "./input.manager";
var InputService = /** @class */ (function () {
    function InputService(htmlInputElement, options) {
        this.htmlInputElement = htmlInputElement;
        this.options = options;
        this.inputManager = new InputManager(htmlInputElement);
    }
    InputService.prototype.addNumber = function (keyCode) {
        if (!this.rawValue) {
            this.rawValue = this.applyMask(false, "0");
        }
        var keyChar = String.fromCharCode(keyCode);
        var selectionStart = this.inputSelection.selectionStart;
        var selectionEnd = this.inputSelection.selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart + 1);
    };
    InputService.prototype.applyMask = function (isNumber, rawValue) {
        var _a = this.options, allowNegative = _a.allowNegative, decimal = _a.decimal, precision = _a.precision, prefix = _a.prefix, suffix = _a.suffix, thousands = _a.thousands, inCents = _a.inCents;
        rawValue = isNumber && !inCents ? new Number(rawValue).toFixed(precision) : rawValue;
        var onlyNumbers = rawValue.replace(/[^0-9]/g, "");
        if (!onlyNumbers) {
            return "";
        }
        var integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        if (integerPart == "") {
            integerPart = "0";
        }
        var newRawValue = integerPart;
        var decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
        if (precision > 0) {
            decimalPart = "0".repeat(precision - decimalPart.length) + decimalPart;
            newRawValue += decimal + decimalPart;
        }
        var isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        var operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    };
    InputService.prototype.clearMask = function (rawValue) {
        if (rawValue == null || rawValue == "") {
            return null;
        }
        var value = rawValue.replace(this.options.prefix, "").replace(this.options.suffix, "");
        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }
        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }
        var valueFloat = parseFloat(value);
        if (this.options.inCents) {
            return Math.round(valueFloat * 100);
        }
        return valueFloat;
    };
    InputService.prototype.changeToNegative = function () {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-" && this.value != 0) {
            var selectionStart = this.inputSelection.selectionStart;
            this.rawValue = "-" + this.rawValue;
            this.updateFieldValue(selectionStart + 1);
        }
    };
    InputService.prototype.changeToPositive = function () {
        var selectionStart = this.inputSelection.selectionStart;
        this.rawValue = this.rawValue.replace("-", "");
        this.updateFieldValue(selectionStart - 1);
    };
    InputService.prototype.fixCursorPosition = function (forceToEndPosition) {
        var currentCursorPosition = this.inputSelection.selectionStart;
        //if the current cursor position is after the number end position, it is moved to the end of the number, ignoring the prefix or suffix. this behavior can be forced with forceToEndPosition flag
        if (currentCursorPosition > this.getRawValueWithoutSuffixEndPosition() || forceToEndPosition) {
            this.inputManager.setCursorAt(this.getRawValueWithoutSuffixEndPosition());
            //if the current cursor position is before the number start position, it is moved to the start of the number, ignoring the prefix or suffix
        }
        else if (currentCursorPosition < this.getRawValueWithoutPrefixStartPosition()) {
            this.inputManager.setCursorAt(this.getRawValueWithoutPrefixStartPosition());
        }
    };
    InputService.prototype.getRawValueWithoutSuffixEndPosition = function () {
        return this.rawValue.length - this.options.suffix.length;
    };
    InputService.prototype.getRawValueWithoutPrefixStartPosition = function () {
        return this.value != null && this.value < 0 ? this.options.prefix.length + 1 : this.options.prefix.length;
    };
    InputService.prototype.removeNumber = function (keyCode) {
        var _a = this.options, decimal = _a.decimal, thousands = _a.thousands;
        var selectionEnd = this.inputSelection.selectionEnd;
        var selectionStart = this.inputSelection.selectionStart;
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
    };
    InputService.prototype.updateFieldValue = function (selectionStart) {
        var newRawValue = this.applyMask(false, this.rawValue || "");
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    };
    InputService.prototype.updateOptions = function (options) {
        var value = this.value;
        this.options = options;
        this.value = value;
    };
    Object.defineProperty(InputService.prototype, "canInputMoreNumbers", {
        get: function () {
            return this.inputManager.canInputMoreNumbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "inputSelection", {
        get: function () {
            return this.inputManager.inputSelection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "rawValue", {
        get: function () {
            return this.inputManager.rawValue;
        },
        set: function (value) {
            this.inputManager.rawValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "storedRawValue", {
        get: function () {
            return this.inputManager.storedRawValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "value", {
        get: function () {
            return this.clearMask(this.rawValue);
        },
        set: function (value) {
            this.rawValue = this.applyMask(true, "" + value);
        },
        enumerable: true,
        configurable: true
    });
    return InputService;
}());
export { InputService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1jdXJyZW5jeS1tYXNrLyIsInNvdXJjZXMiOlsibGliL2lucHV0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DO0lBSUksc0JBQW9CLGdCQUFxQixFQUFVLE9BQVk7UUFBM0MscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELGdDQUFTLEdBQVQsVUFBVSxPQUFlO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDOUM7UUFFRCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO1FBQ3hELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxnQ0FBUyxHQUFULFVBQVUsUUFBaUIsRUFBRSxRQUFn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QUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7UUFDNUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxrQ0FBUTthQUFaO1lBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxDQUFDO2FBRUQsVUFBYSxLQUFhO1lBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN2QyxDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHdDQUFjO2FBQWxCO1lBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztRQUM1QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLCtCQUFLO2FBQVQ7WUFDSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7YUFFRCxVQUFVLEtBQWE7WUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQzs7O09BSkE7SUFLTCxtQkFBQztBQUFELENBQUMsQUF4TEQsSUF3TEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dE1hbmFnZXIgfSBmcm9tIFwiLi9pbnB1dC5tYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBpbnB1dE1hbmFnZXI6IElucHV0TWFuYWdlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHRtbElucHV0RWxlbWVudDogYW55LCBwcml2YXRlIG9wdGlvbnM6IGFueSkge1xuICAgICAgICB0aGlzLmlucHV0TWFuYWdlciA9IG5ldyBJbnB1dE1hbmFnZXIoaHRtbElucHV0RWxlbWVudCk7XG4gICAgfVxuXG4gICAgYWRkTnVtYmVyKGtleUNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucmF3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLmFwcGx5TWFzayhmYWxzZSwgXCIwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleUNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUNvZGUpO1xuICAgICAgICBsZXQgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25FbmQ7XG4gICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb25TdGFydCkgKyBrZXlDaGFyICsgdGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcoc2VsZWN0aW9uRW5kLCB0aGlzLnJhd1ZhbHVlLmxlbmd0aCk7XG4gICAgICAgIHRoaXMudXBkYXRlRmllbGRWYWx1ZShzZWxlY3Rpb25TdGFydCArIDEpO1xuICAgIH1cblxuICAgIGFwcGx5TWFzayhpc051bWJlcjogYm9vbGVhbiwgcmF3VmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCB7IGFsbG93TmVnYXRpdmUsIGRlY2ltYWwsIHByZWNpc2lvbiwgcHJlZml4LCBzdWZmaXgsIHRob3VzYW5kcywgaW5DZW50cyB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgICByYXdWYWx1ZSA9IGlzTnVtYmVyICYmICFpbkNlbnRzID8gbmV3IE51bWJlcihyYXdWYWx1ZSkudG9GaXhlZChwcmVjaXNpb24pIDogcmF3VmFsdWU7XG4gICAgICAgIGxldCBvbmx5TnVtYmVycyA9IHJhd1ZhbHVlLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKTtcblxuICAgICAgICBpZiAoIW9ubHlOdW1iZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbnRlZ2VyUGFydCA9IG9ubHlOdW1iZXJzLnNsaWNlKDAsIG9ubHlOdW1iZXJzLmxlbmd0aCAtIHByZWNpc2lvbikucmVwbGFjZSgvXjAqL2csIFwiXCIpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kcyk7XG5cbiAgICAgICAgaWYgKGludGVnZXJQYXJ0ID09IFwiXCIpIHtcbiAgICAgICAgICAgIGludGVnZXJQYXJ0ID0gXCIwXCI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3UmF3VmFsdWUgPSBpbnRlZ2VyUGFydDtcbiAgICAgICAgbGV0IGRlY2ltYWxQYXJ0ID0gb25seU51bWJlcnMuc2xpY2Uob25seU51bWJlcnMubGVuZ3RoIC0gcHJlY2lzaW9uKTtcblxuICAgICAgICBpZiAocHJlY2lzaW9uID4gMCkge1xuICAgICAgICAgICAgZGVjaW1hbFBhcnQgPSBcIjBcIi5yZXBlYXQocHJlY2lzaW9uIC0gZGVjaW1hbFBhcnQubGVuZ3RoKSArIGRlY2ltYWxQYXJ0O1xuICAgICAgICAgICAgbmV3UmF3VmFsdWUgKz0gZGVjaW1hbCArIGRlY2ltYWxQYXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzWmVybyA9IHBhcnNlSW50KGludGVnZXJQYXJ0KSA9PSAwICYmIChwYXJzZUludChkZWNpbWFsUGFydCkgPT0gMCB8fCBkZWNpbWFsUGFydCA9PSBcIlwiKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gKHJhd1ZhbHVlLmluZGV4T2YoXCItXCIpID4gLTEgJiYgYWxsb3dOZWdhdGl2ZSAmJiAhaXNaZXJvKSA/IFwiLVwiIDogXCJcIjtcbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yICsgcHJlZml4ICsgbmV3UmF3VmFsdWUgKyBzdWZmaXg7XG4gICAgfVxuXG4gICAgY2xlYXJNYXNrKHJhd1ZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBpZiAocmF3VmFsdWUgPT0gbnVsbCB8fCByYXdWYWx1ZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IHJhd1ZhbHVlLnJlcGxhY2UodGhpcy5vcHRpb25zLnByZWZpeCwgXCJcIikucmVwbGFjZSh0aGlzLm9wdGlvbnMuc3VmZml4LCBcIlwiKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRob3VzYW5kcykge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcXCIgKyB0aGlzLm9wdGlvbnMudGhvdXNhbmRzLCBcImdcIiksIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWNpbWFsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UodGhpcy5vcHRpb25zLmRlY2ltYWwsIFwiLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbHVlRmxvYXQgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmluQ2VudHMpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlRmxvYXQgKiAxMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlRmxvYXQ7XG4gICAgfVxuXG4gICAgY2hhbmdlVG9OZWdhdGl2ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd05lZ2F0aXZlICYmIHRoaXMucmF3VmFsdWUgIT0gXCJcIiAmJiB0aGlzLnJhd1ZhbHVlLmNoYXJBdCgwKSAhPSBcIi1cIiAmJiB0aGlzLnZhbHVlICE9IDApIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgICAgICB0aGlzLnJhd1ZhbHVlID0gXCItXCIgKyB0aGlzLnJhd1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0ICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VUb1Bvc2l0aXZlKCk6IHZvaWQge1xuICAgICAgICBsZXQgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICB0aGlzLnJhd1ZhbHVlID0gdGhpcy5yYXdWYWx1ZS5yZXBsYWNlKFwiLVwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgfVxuXG4gICAgZml4Q3Vyc29yUG9zaXRpb24oZm9yY2VUb0VuZFBvc2l0aW9uPzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBsZXQgY3VycmVudEN1cnNvclBvc2l0aW9uID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICAvL2lmIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiBpcyBhZnRlciB0aGUgbnVtYmVyIGVuZCBwb3NpdGlvbiwgaXQgaXMgbW92ZWQgdG8gdGhlIGVuZCBvZiB0aGUgbnVtYmVyLCBpZ25vcmluZyB0aGUgcHJlZml4IG9yIHN1ZmZpeC4gdGhpcyBiZWhhdmlvciBjYW4gYmUgZm9yY2VkIHdpdGggZm9yY2VUb0VuZFBvc2l0aW9uIGZsYWdcbiAgICAgICAgaWYgKGN1cnJlbnRDdXJzb3JQb3NpdGlvbiA+IHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0U3VmZml4RW5kUG9zaXRpb24oKSB8fCBmb3JjZVRvRW5kUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnNldEN1cnNvckF0KHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0U3VmZml4RW5kUG9zaXRpb24oKSk7XG4gICAgICAgICAgICAvL2lmIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiBpcyBiZWZvcmUgdGhlIG51bWJlciBzdGFydCBwb3NpdGlvbiwgaXQgaXMgbW92ZWQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBudW1iZXIsIGlnbm9yaW5nIHRoZSBwcmVmaXggb3Igc3VmZml4XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEN1cnNvclBvc2l0aW9uIDwgdGhpcy5nZXRSYXdWYWx1ZVdpdGhvdXRQcmVmaXhTdGFydFBvc2l0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnNldEN1cnNvckF0KHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0UHJlZml4U3RhcnRQb3NpdGlvbigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJhd1ZhbHVlV2l0aG91dFN1ZmZpeEVuZFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldFJhd1ZhbHVlV2l0aG91dFByZWZpeFN0YXJ0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgIT0gbnVsbCAmJiB0aGlzLnZhbHVlIDwgMCA/IHRoaXMub3B0aW9ucy5wcmVmaXgubGVuZ3RoICsgMSA6IHRoaXMub3B0aW9ucy5wcmVmaXgubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlbW92ZU51bWJlcihrZXlDb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IHsgZGVjaW1hbCwgdGhvdXNhbmRzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGxldCBzZWxlY3Rpb25FbmQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICBpZiAoc2VsZWN0aW9uU3RhcnQgPiB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGVyZSBpcyBubyBzZWxlY3Rpb25cbiAgICAgICAgaWYgKHNlbGVjdGlvbkVuZCA9PSBzZWxlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgLy9kZWxldGUga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIGEgbnVtYmVyXG4gICAgICAgICAgICBpZiAoKGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSA2MzI3MikgJiYgL15cXGQrJC8udGVzdCh0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kICsgMSkpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9kZWxldGUga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIHRoZSBkZWNpbWFsIG9yIHRob3VzYW5kcyBkaXZpZGVyXG4gICAgICAgICAgICBpZiAoKGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSA2MzI3MikgJiYgKHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQgKyAxKSA9PSBkZWNpbWFsIHx8IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQgKyAxKSA9PSB0aG91c2FuZHMpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kICsgMjtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9iYWNrc3BhY2Uga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIGEgbnVtYmVyXG4gICAgICAgICAgICBpZiAoa2V5Q29kZSA9PSA4ICYmIC9eXFxkKyQvLnRlc3QodGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcoc2VsZWN0aW9uU3RhcnQgLSAxLCBzZWxlY3Rpb25FbmQpKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0aW9uU3RhcnQgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JhY2tzcGFjZSBrZXkgYW5kIHRoZSB0YXJnZXQgZGlnaXQgaXMgdGhlIGRlY2ltYWwgb3IgdGhvdXNhbmRzIGRpdmlkZXJcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09IDggJiYgKHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0IC0gMSwgc2VsZWN0aW9uRW5kKSA9PSBkZWNpbWFsIHx8IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0IC0gMSwgc2VsZWN0aW9uRW5kKSA9PSB0aG91c2FuZHMpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb25TdGFydCAtIDI7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb25TdGFydCkgKyB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb25FbmQsIHRoaXMucmF3VmFsdWUubGVuZ3RoKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0KTtcbiAgICB9XG5cbiAgICB1cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdSYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKGZhbHNlLCB0aGlzLnJhd1ZhbHVlIHx8IFwiXCIpO1xuICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ID09IHVuZGVmaW5lZCA/IHRoaXMucmF3VmFsdWUubGVuZ3RoIDogc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnVwZGF0ZVZhbHVlQW5kQ3Vyc29yKG5ld1Jhd1ZhbHVlLCB0aGlzLnJhd1ZhbHVlLmxlbmd0aCwgc2VsZWN0aW9uU3RhcnQpO1xuICAgIH1cblxuICAgIHVwZGF0ZU9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBjYW5JbnB1dE1vcmVOdW1iZXJzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIuY2FuSW5wdXRNb3JlTnVtYmVycztcbiAgICB9XG5cbiAgICBnZXQgaW5wdXRTZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRNYW5hZ2VyLmlucHV0U2VsZWN0aW9uO1xuICAgIH1cblxuICAgIGdldCByYXdWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIucmF3VmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHJhd1ZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIucmF3VmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcmVkUmF3VmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRNYW5hZ2VyLnN0b3JlZFJhd1ZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGVhck1hc2sodGhpcy5yYXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKHRydWUsIFwiXCIgKyB2YWx1ZSk7XG4gICAgfVxufSJdfQ==