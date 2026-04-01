//tuple annotation
let user : [number,string,string,string,boolean];
//initialize values
user = [1,"Priya","Priya@gmail.com","12345",true];
console.log(user);

let user1 : [number|string,string,string,string,boolean] = ["101","Priya","Priya@gmail.com","12345",true];
console.log(user1);

interface userType{
    name:string;
    email:string;
}
let emp1:userType={
    name:"Priya",
    email:"Priya@gmail.com"
}
console.log(emp1.name)
console.log(emp1.email);

//generics
function Demo<T> (para:T){
    return para;
}
console.log(Demo<number>(101));
console.log(Demo<string>("Hiii"));
console.log(Demo<boolean>(true));

//decorators

function logger(cons:Function){
    console.log("welcome to Angular");
}
@logger
class login{
    name = "Priya";
}
let User1 = new login();
console.log(User1);

