// let age = 21;
// age = "twwenty one"
var message = "This is typescript";
console.log(message);
// message = 21;
//type annotation
//array:
var language = ["tamil", "english", "hindi", "lan"];
var student = {
    username: "rahul",
    age: 21
};
var studentDetails = {
    name: "Priya",
    age: 21
};
console.log(studentDetails);
//funtion
function addNumber(num1, num2) {
    return num1 + num2;
}
console.log(addNumber(20, 30));
//return type
function messages() {
    console.log("Hello Typescript");
}
messages();
function greet(name) {
    return "Hello " + name;
}
console.log(greet("Priya"));
function printName(firstName, nickname) {
    console.log("firstName :".concat(firstName));
}
printName("Priyadharshini", "priya");
//optional
function greetUser(name, age) {
    console.log(name);
    if (age) {
        console.log(age);
    }
}
greetUser("Priya");
var studentName = "Priya";
var student1 = {
    name: "Priya",
    age: 21,
    course: "CSE"
};
var add = function (x, y) {
    return x + y;
};
console.log(add(10, 60));
//union
var myBoolean = true;
var User = true;
function greeting(container) {
    return container;
}
console.log(greeting({ name: "Priya", password: 1233, isRole: true }));
var staff1 = {
    name: "Priya",
    id: 101
};
console.log(staff1);
//enums
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["left"] = 2] = "left";
    Direction[Direction["right"] = 3] = "right";
})(Direction || (Direction = {}));
var move = Direction.up;
var move1 = Direction.down;
var move2 = Direction.left;
var move3 = Direction.right;
console.log(move, move1, move2, move3);
//customize the enum values
var Status;
(function (Status) {
    Status[Status["success"] = 1] = "success";
    Status[Status["Error"] = 2] = "Error";
    Status[Status["loading"] = 3] = "loading";
})(Status || (Status = {}));
var currentStatus = Status.Error;
console.log(currentStatus);
var Role;
(function (Role) {
    Role["Admin"] = "ADMIN";
    Role["user"] = "USER";
    Role["guest"] = "GUEST";
})(Role || (Role = {}));
var userRole = Role.user;
console.log(userRole);
//access value using index
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color || (Color = {}));
console.log(Color[0]);
