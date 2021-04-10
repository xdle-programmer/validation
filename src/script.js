(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        window.someFunctions = factory();
    }
})(function () {

    function someFunctions(argument) {
        return argument;
    }

    return someFunctions;
});
