var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Student = /** @class */ (function () {
    function Student() {
    }
    Student.prototype.display = function () {
        console.log("This is one student");
    };
    Student.prototype.add = function (a, b) {
        return a + b;
    };
    return Student;
}());
var s1 = new Student();
s1.display();
console.log(s1.add(5, 10));
var Student1 = /** @class */ (function () {
    function Student1(name, age) {
        this.username = name;
        this.age = age;
    }
    return Student1;
}());
var res = new Student1("Priya", 21);
console.log(res.username);
//inheritance
var Parent = /** @class */ (function () {
    function Parent() {
    }
    Parent.prototype.parentHouse = function () {
        console.log("2 ac");
    };
    return Parent;
}());
var child = /** @class */ (function (_super) {
    __extends(child, _super);
    function child() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    child.prototype.childHouse = function () {
        console.log("1ac");
    };
    return child;
}(Parent));
var inheri = new child();
inheri.parentHouse();
inheri.childHouse();
var Person1 = /** @class */ (function () {
    function Person1() {
    }
    Person1.prototype.greet = function () {
        console.log("Welcome");
    };
    return Person1;
}());
var ress = new Person1();
ress.greet();
