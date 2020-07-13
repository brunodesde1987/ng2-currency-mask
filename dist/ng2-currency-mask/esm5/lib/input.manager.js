var InputManager = /** @class */ (function () {
    function InputManager(htmlInputElement) {
        this.htmlInputElement = htmlInputElement;
    }
    InputManager.prototype.setCursorAt = function (position) {
        if (this.htmlInputElement.setSelectionRange) {
            this.htmlInputElement.focus();
            this.htmlInputElement.setSelectionRange(position, position);
        }
        else if (this.htmlInputElement.createTextRange) {
            var textRange = this.htmlInputElement.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd("character", position);
            textRange.moveStart("character", position);
            textRange.select();
        }
    };
    InputManager.prototype.updateValueAndCursor = function (newRawValue, oldLength, selectionStart) {
        this.rawValue = newRawValue;
        var newLength = newRawValue.length;
        selectionStart = selectionStart - (oldLength - newLength);
        this.setCursorAt(selectionStart);
    };
    Object.defineProperty(InputManager.prototype, "canInputMoreNumbers", {
        get: function () {
            var haventReachedMaxLength = !(this.rawValue.length >= this.htmlInputElement.maxLength && this.htmlInputElement.maxLength >= 0);
            var selectionStart = this.inputSelection.selectionStart;
            var selectionEnd = this.inputSelection.selectionEnd;
            var haveNumberSelected = (selectionStart != selectionEnd && this.htmlInputElement.value.substring(selectionStart, selectionEnd).match(/\d/)) ? true : false;
            var startWithZero = (this.htmlInputElement.value.substring(0, 1) == "0");
            return haventReachedMaxLength || haveNumberSelected || startWithZero;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "inputSelection", {
        get: function () {
            var selectionStart = 0;
            var selectionEnd = 0;
            if (typeof this.htmlInputElement.selectionStart == "number" && typeof this.htmlInputElement.selectionEnd == "number") {
                selectionStart = this.htmlInputElement.selectionStart;
                selectionEnd = this.htmlInputElement.selectionEnd;
            }
            else {
                var range = document.getSelection().anchorNode;
                if (range && range.firstChild == this.htmlInputElement) {
                    var lenght = this.htmlInputElement.value.length;
                    var normalizedValue = this.htmlInputElement.value.replace(/\r\n/g, "\n");
                    var startRange = this.htmlInputElement.createTextRange();
                    var endRange = this.htmlInputElement.createTextRange();
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "rawValue", {
        get: function () {
            return this.htmlInputElement && this.htmlInputElement.value;
        },
        set: function (value) {
            this._storedRawValue = value;
            if (this.htmlInputElement) {
                this.htmlInputElement.value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "storedRawValue", {
        get: function () {
            return this._storedRawValue;
        },
        enumerable: true,
        configurable: true
    });
    return InputManager;
}());
export { InputManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1jdXJyZW5jeS1tYXNrLyIsInNvdXJjZXMiOlsibGliL2lucHV0Lm1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFJSSxzQkFBb0IsZ0JBQXFCO1FBQXJCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBSztJQUN6QyxDQUFDO0lBRUQsa0NBQVcsR0FBWCxVQUFZLFFBQWdCO1FBQ3hCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFO1lBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQy9EO2FBQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFO1lBQzlDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4RCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFFRCwyQ0FBb0IsR0FBcEIsVUFBcUIsV0FBbUIsRUFBRSxTQUFpQixFQUFFLGNBQXNCO1FBQy9FLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDbkMsY0FBYyxHQUFHLGNBQWMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxD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RyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQ3pELFlBQVksSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt5QkFDakY7cUJBQ0o7aUJBQ0o7YUFDSjtZQUVELE9BQU87Z0JBQ0gsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFlBQVksRUFBRSxZQUFZO2FBQzdCLENBQUM7UUFDTixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGtDQUFRO2FBQVo7WUFDSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQ2hFLENBQUM7YUFFRCxVQUFhLEtBQWE7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFFN0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2FBQ3ZDO1FBQ0wsQ0FBQzs7O09BUkE7SUFVRCxzQkFBSSx3Q0FBYzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTtJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQTFGRCxJQTBGQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXIge1xuXG4gICAgcHJpdmF0ZSBfc3RvcmVkUmF3VmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHRtbElucHV0RWxlbWVudDogYW55KSB7XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yQXQocG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5odG1sSW5wdXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuaHRtbElucHV0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaHRtbElucHV0RWxlbWVudC5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0UmFuZ2UgPSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICB0ZXh0UmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG4gICAgICAgICAgICB0ZXh0UmFuZ2UubW92ZUVuZChcImNoYXJhY3RlclwiLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB0ZXh0UmFuZ2UubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVZhbHVlQW5kQ3Vyc29yKG5ld1Jhd1ZhbHVlOiBzdHJpbmcsIG9sZExlbmd0aDogbnVtYmVyLCBzZWxlY3Rpb25TdGFydDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmF3VmFsdWUgPSBuZXdSYXdWYWx1ZTtcbiAgICAgICAgbGV0IG5ld0xlbmd0aCA9IG5ld1Jhd1ZhbHVlLmxlbmd0aDtcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb25TdGFydCAtIChvbGRMZW5ndGggLSBuZXdMZW5ndGgpO1xuICAgICAgICB0aGlzLnNldEN1cnNvckF0KHNlbGVjdGlvblN0YXJ0KTtcbiAgICB9XG5cbiAgICBnZXQgY2FuSW5wdXRNb3JlTnVtYmVycygpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGhhdmVudFJlYWNoZWRNYXhMZW5ndGggPSAhKHRoaXMucmF3VmFsdWUubGVuZ3RoID49IHRoaXMuaHRtbElucHV0RWxlbWVudC5tYXhMZW5ndGggJiYgdGhpcy5odG1sSW5wdXRFbGVtZW50Lm1heExlbmd0aCA+PSAwKTtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgbGV0IHNlbGVjdGlvbkVuZCA9IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kO1xuICAgICAgICBsZXQgaGF2ZU51bWJlclNlbGVjdGVkID0gKHNlbGVjdGlvblN0YXJ0ICE9IHNlbGVjdGlvbkVuZCAmJiB0aGlzLmh0bWxJbnB1dEVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpLm1hdGNoKC9cXGQvKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGxldCBzdGFydFdpdGhaZXJvID0gKHRoaXMuaHRtbElucHV0RWxlbWVudC52YWx1ZS5zdWJzdHJpbmcoMCwgMSkgPT0gXCIwXCIpO1xuICAgICAgICByZXR1cm4gaGF2ZW50UmVhY2hlZE1heExlbmd0aCB8fCBoYXZlTnVtYmVyU2VsZWN0ZWQgfHwgc3RhcnRXaXRoWmVybztcbiAgICB9XG5cbiAgICBnZXQgaW5wdXRTZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gMDtcbiAgICAgICAgbGV0IHNlbGVjdGlvbkVuZCA9IDA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdGhpcy5odG1sSW5wdXRFbGVtZW50LnNlbGVjdGlvbkVuZCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHRoaXMuaHRtbElucHV0RWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IHRoaXMuaHRtbElucHV0RWxlbWVudC5zZWxlY3Rpb25FbmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmFuZ2UgPSBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS5hbmNob3JOb2RlO1xuXG4gICAgICAgICAgICBpZiAocmFuZ2UgJiYgcmFuZ2UuZmlyc3RDaGlsZCA9PSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGVuZ2h0ID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgbm9ybWFsaXplZFZhbHVlID0gdGhpcy5odG1sSW5wdXRFbGVtZW50LnZhbHVlLnJlcGxhY2UoL1xcclxcbi9nLCBcIlxcblwiKTtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRSYW5nZSA9IHRoaXMuaHRtbElucHV0RWxlbWVudC5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgICAgICBsZXQgZW5kUmFuZ2UgPSB0aGlzLmh0bWxJbnB1dEVsZW1lbnQuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICAgICAgZW5kUmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0UmFuZ2UuY29tcGFyZUVuZFBvaW50cyhcIlN0YXJ0VG9FbmRcIiwgZW5kUmFuZ2UpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb25FbmQgPSBsZW5naHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSAtc3RhcnRSYW5nZS5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwgLWxlbmdodCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ICs9IG5vcm1hbGl6ZWRWYWx1ZS5zbGljZSgwLCBzZWxlY3Rpb25TdGFydCkuc3BsaXQoXCJcXG5cIikubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSYW5nZS5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9FbmRcIiwgZW5kUmFuZ2UpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IGxlbmdodDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IC1zdGFydFJhbmdlLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLWxlbmdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgKz0gbm9ybWFsaXplZFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvbkVuZCkuc3BsaXQoXCJcXG5cIikubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25TdGFydDogc2VsZWN0aW9uU3RhcnQsXG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQ6IHNlbGVjdGlvbkVuZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCByYXdWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5odG1sSW5wdXRFbGVtZW50ICYmIHRoaXMuaHRtbElucHV0RWxlbWVudC52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgcmF3VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zdG9yZWRSYXdWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmh0bWxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuaHRtbElucHV0RWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHN0b3JlZFJhd1ZhbHVlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yZWRSYXdWYWx1ZTtcbiAgICB9XG59Il19