
/**
 * Vue Application Code
 */
var App = new Vue({
    el: '#calculator', // Context for 'data' usage
    data: {
        result: 0,
        previousResult: NaN,
        calculation: '' // String that'll hold our calculation, such as '6+4/2*2'
    },
    computed: {
        resultRoman: function() {
            return this.previousResult ? intToRoman(this.previousResult) : '';
        }
    },
    methods: {
        // Resets all of our values
        clear: function() {
            this.result = 0;
            this.previousResult = NaN;
            this.calculation = '';
        },
        // Takes a character and appends it to our calculation
        calcAdd: function(char) {
            this.calculation += char;
            this.result = this.calculation;
        },
        // Always removes character at the end of our string
        calcRemove: function() {
            if (typeof this.calculation === 'string' && this.calculation.length) {
                this.calculation = this.calculation.slice(0, -1);
                this.result = this.calculation;
            }
        },
        // Perform the calculation and display the results
        equals: function() {
            // Strip out any non-numeric character or simple math expressions
            var calcSafe = this.calculation.replace(/[^0-9\+\-\*\/]/g, '');
            // If our calculation starts with an operator, we prepend the previous result to the calculation
            if (isNaN(calcSafe.charAt(0))) calcSafe = this.previousResult + calcSafe;
            // Do the math, round to nearest whole number (as per project requirements)
            try {
                this.result = Math.round(eval(calcSafe)); // Eval is safe here because of the above regex
                this.previousResult = this.result; // Set previousResult for next time
                this.calculation = ''; // Clean slate our calculation for a new one
            } catch (e) {
                console.warn('Invalid Calculation'); // Something went wrong, but most likely the user has an operation at the end of the calculation so don't do anything.
            }
        }
    }
});

/**
 * Converts Integer to Roman Numerals
 * Inspired by many stackOverflow roman numeral conversions
 * @param  {[number]} n [whole number to be converted]
 * @return {[string]}   [roman numeral conversion of provided whole number]
 */
function intToRoman(n) {
    if (n <= 0 || n >= 5000) return '';
        // Set up mapping to compare crucial roman numerals to their integet values
    var mapping = {
            'M': 1000, 'CM': 900, 'D': 500, 'CD': 400, 'C': 100,
            'XC': 90, 'L': 50, 'XL': 40, 'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
        },
        // Placeholder result array. Could also just be a string we append too, but it feels nicer to work with an object and an array
        result = [];
    // Loop through each roman numeral
    _.forEach(mapping, function(int, rom) {
        // So long as the intToRoman (n) param is greater than the current symbol's matching int...
        while(n >= int) {
            // Add the current symbol to our results array
            result.push(rom);
            // Take the value of the current symbol's int and subtract it from 'n'. This may happen multiple times, such as "20" becoming "XX"
            n -= int;
        }
    });
    return result.join('');
}

/**
 * Page Load Initializers and Bindings
 */
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
                // Keyboard numbers range from 48 to 57...
                if (event.keyCode >= 48 && event.keyCode <= 57) {
                    // ...so leverage this by subtracting 48 from the keyCode and just pass it on to the calculation.
                    App.calcAdd(event.keyCode - 48);
                }
        }
    });
});
