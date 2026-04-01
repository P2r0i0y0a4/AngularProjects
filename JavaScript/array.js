let array = ["Priya", "Ashwini", "Bhavani", "Ravi",true,false,3.334,9]
console.log(array.at(0));
console.log(array);
console.log(array.concat("Sai"));
console.log(array);
console.log(array.join("0"));
console.log(array);
console.log(array.pop());
console.log(array);
console.log(array.push());
console.log(array);
console.log(array.reverse());
console.log(array.sort());
console.log(array.slice(0,4));
console.log(array);


let fruitname = ["apple","orange","kiwi","guava"]
console.log(fruitname);
// console.log(fruitname.sort());
// console.log(fruitname.shift());
// console.log(fruitname);
// console.log(fruitname.unshift("apple"));
// console.log(fruitname);
console.log(fruitname.splice(0,2));
console.log(fruitname);
console.log(fruitname.splice(0,2,"car","bus"));
console.log(fruitname);


//=-------------map=---------------
let productId = [10,20,30,40,50];

let res = productId.map((x)=>{
    console.log(x+5);
    return x+5;    
})
console.log(res);

//-----------filter------------

let fill = productId.filter((x)=>{
    return x>20;
})
console.log(fill);


















