let username = (fullName) => {
    return fullName.trim().toLowerCase().replaceAll(" ","_");
}
console.log(username(" Priya dharshini R "));

let email = (mail_id) => {
    if(mail_id.includes("@") && mail_id.includes("_")){
        console.log(`Email is valid`);
    } 
    else{
        console.log(`Email is invlid`);
        
    }
}
email("bhavanipriy73@gmail.com");
email("priya_2004@gmail.com");

let swallow = (word) => {
    return word.slice("11",word.length);
}
console.log(swallow("JavaScript Developer"));

let checker = (password) => {
    if(password.includes("@")){
        console.log(`Password is correct`);
        
    }
    else{
        console.log(`password is incorrect`);
        
    }
}
checker("Priya@123");

let checkLetter = (word) =>{
    first=word.charAt(0);
    second=word.charAt(word.length-1);
    return first+" "+second;
}
console.log(checkLetter("priya"));

let domain = (email) => {
    console.log(email.slice(14,email.length));
    
}
domain("bhavanipriy73@gmail.com");

let checkSentence = (sentence) => {
    console.log(sentence.toUpperCase().trimStart());
    
}
checkSentence(" Priya is an emotion  ")