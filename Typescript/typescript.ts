// let age = 21;
// age = "twwenty one"

let message : string = "This is typescript"
console.log(message);

// message = 21;

//type annotation

//array:
let language:string[]= ["tamil","english","hindi","lan"]
let student={
    username:"rahul",
    age:21
}
let studentDetails:{
    name:string;
    age:number
} = {
    name:"Priya",
    age:21
}
console.log(studentDetails);

//funtion
function addNumber(num1:number,num2:number){
    return num1+num2;
}
console.log(addNumber(20,30));

//return type
function messages() : void{
    console.log("Hello Typescript");
    
}
messages();

function greet(name: string): string {
    return "Hello " + name;
}

console.log(greet("Priya"));

function printName(firstName:string , nickname?:string){
    console.log(`firstName :${firstName}`);
}
printName("Priyadharshini","priya");

//optional
function greetUser(name: string, age?: number) {
    console.log(name);

    if (age) {
        console.log(age);
    }
}

greetUser("Priya");


//type alias

// let studentName:string = "Priya"
type name = string
let studentName:name = "Priya";

//object type alias

type student = {
    name:string;
    age:number;
    course:string;
}
let student1:student ={
    name:"Priya",
    age:21,
    course:"CSE"
}

//arrow function

type AddFunction = (a:number,b:number)=>number;

const add:AddFunction = (x,y) =>{
    return x+y;
}
console.log(add(10,60));

//union
let myBoolean:string|boolean = true;
type user = string|boolean|number;
let User:user = true;

type userDetails = {
    name:string;
    password:string | number;
    isRole : boolean | string;
}
function greeting(container:userDetails){
    return container;
}
console.log(greeting({name:"Priya",password:1233,isRole:true}));

//intersection(&)

type person = {
    name:string;
}
type Employee = {
    id:number;
}

type staff = person & Employee;

let staff1:staff = {
    name : "Priya",
    id : 101
}
console.log(staff1);

//enums
enum Direction{
    up,
    down,
    left,
    right
}
let move: Direction = Direction.up;
let move1: Direction = Direction.down;
let move2: Direction = Direction.left;
let move3: Direction = Direction.right;

console.log(move,move1,move2,move3);

//customize the enum values
enum Status{
    success=1,
    Error=2,
    loading=3
}
let currentStatus:Status = Status.Error;
console.log(currentStatus);


enum Role{
    Admin="ADMIN",
    user="USER",
    guest="GUEST"
}
let userRole:Role=Role.user;
console.log(userRole);

//access value using index
enum Color {
  Red,
  Blue
}

console.log(Color[0]);
