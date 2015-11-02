$(document).ready(function() {
    // This command is used to initialize some elements and make them work properly
    $.material.init();
});

new Vue({
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
