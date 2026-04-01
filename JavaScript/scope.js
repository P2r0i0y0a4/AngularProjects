var name="Priya"
let age=21
const dept="CSE"

function globalScope(){
    console.log(name+" "+age+" "+dept);
}
globalScope();

function localScope(){
    var emp_name = "Ashwini"
    let dept_id = 104
    console.log(emp_name+" "+dept_id);
}

localScope();

// console.log(emp_name);--->ReferenceError can't access


if(true){
    var institute = "PEC";
    let code = 1205;
    const issue = "Server issue";
    console.log(institute+" "+code+" "+issue );
    
}
console.log(institute);//var is allowed
