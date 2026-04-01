class Student{
    display(){
        console.log("This is one student");
    }
    add(a:number,b:number){
        return a+b;
    }
}
let s1=new Student();
s1.display();
console.log(s1.add(5,10));


class Student1{
    username:string;
    age:number
    constructor(name:string,age:number){
        this.username=name;
        this.age=age;
    }
}
let res=new Student1("Priya",21);
console.log(res.username);


//inheritance
class Parent{
    parentHouse(){
        console.log("2 ac");        
    }
}
class child extends Parent{
    childHouse(){
        console.log("1ac");
    }
}
let inheri = new child();
inheri.parentHouse();
inheri.childHouse();


//interface

interface Person{
    // name:string;
    greet():void;
}
class Person1 implements Person{
    greet():void{
        console.log("Welcome");    
    }
}
let ress=new Person1();
ress.greet();