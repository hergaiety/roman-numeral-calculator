
var App = new Vue({
    el: '#calculator',
    data: {
        result: 0,
        previousResult: NaN,
        calculation: ''
    },
    methods: {
        clear: function() {
            this.result = 0;
            this.previousResult = NaN;
            this.calculation = '';
        },
        calcAdd: function(thing) {
            this.calculation += thing;
            this.result = this.calculation;
        },
        calcRemove: function() {
            if (typeof this.calculation === 'string' && this.calculation.length) {
                this.calculation = this.calculation.slice(0, -1);
                this.result = this.calculation;
            }
        },
        equals: function() {
            // Strip out any non-numeric character or simple math expressions
            var calcSafe = this.calculation.replace(/[^0-9\+\-\*\/]/g, '');
            if (isNaN(calcSafe.charAt(0))) calcSafe = this.previousResult + calcSafe;
            try {
                this.result = Math.round(eval(calcSafe)); // Eval is safe here because of the above regex
                this.previousResult = this.result;
                this.calculation = '';
            } catch (e) {
                console.warn('Invalid Calculation');
            }
        }
    }
});

$(document).ready(function() {
    // This command is used to initialize some elements and make them work properly
    $.material.init();

    // Key Bindings
    $(document).on('keypress', function(event) {
        switch (event.keyCode) {
            case 61:  // =
            case 13:  // Enter
                App.equals();
                break;
            case 47:  // / (Forward Slash... haha)
                App.calcAdd('/');
                break;
            case 42:  // *
            case 120: // x
                App.calcAdd('*');
                break;
            case 45:  // -
                App.calcAdd('-');
                break;
            case 43:  // +
                App.calcAdd('+');
                break;
            default:
                if (event.keyCode >= 48 && event.keyCode <= 57) {
                    App.calcAdd(event.keyCode - 48);
                }
        }
    });
});
