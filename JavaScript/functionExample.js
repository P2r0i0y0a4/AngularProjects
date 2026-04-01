function getNameLength(name){
    return name.length;
}
console.log(getNameLength("Priyadharshini"));

function firstCharacter(word){
    return word.charAt(0);
}
console.log(firstCharacter("priya"));

function lastCharacter(word){
    return word.charAt(word.length-1);
}
console.log(lastCharacter("priya"));

function removeExtraSpaces(sentence){
    console.log(sentence.trim());
}
removeExtraSpaces("  Priya Bhavani ");

function capitalText(word){
    console.log(word.toUpperCase());
}
capitalText("Priyadharshini");

function smallText(word){
    console.log(word.toLowerCase());
}
smallText("Bhavani");

function checkWord(sentence){
    console.log(sentence.includes("likes"));  
}
checkWord("Priyadharshini likes Bhavani");

function replaceWord(sentence){
    console.log(sentence.replace("Ravichandran","Ashwini"));   
}
replaceWord("Ravichandran is playing cricket");

function extractWord(word){
    console.log(word.slice(0,6));
}
extractWord("Encyclopedia");

function separateFruits(list){
    console.log(list.split(","));    
}
separateFruits("apple,banana,mango");


