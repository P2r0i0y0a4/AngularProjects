let personalDetails = {
    name:"Priya",
    age:21,
    phno:9847586747,
    skills:"drawing"
}
console.log(personalDetails);
console.log(personalDetails.name,personalDetails.age,personalDetails.phno);
console.log(personalDetails["skills"]);


//nested objects

let employeeDetails = {
    emp_name:"Ashwini",
    age:23,
    phno:98426326747,
    skills:{
        technical : "Java",
        cocurriculam : "dancing"
    }
}

console.log(employeeDetails.skills.technical);
let{emp_name,age,phno,skills:{technical},skills:{cocurriculam}} = employeeDetails
console.log(technical);
console.log(cocurriculam);





