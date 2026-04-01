function toggleStatus(){
    let status = document.getElementById("status");

    if(status.innerText === "Status: Open"){
        status.innerText = "Status: Closed";
        status.style.color = "red";
    } else {
        status.innerText = "Status: Open";
        status.style.color = "green";
    }
    // Welcome message based on time
let msg = document.getElementById("welcome-msg");
let hour = new Date().getHours();

if(hour < 12){
    msg.innerText = "Good Morning! Enjoy Hot Idlies ☀️";
}
else if(hour < 18){
    msg.innerText = "Good Afternoon! Freshly Steamed for You 🌤️";
}
else{
    msg.innerText = "Good Evening! Dinner with Soft Idlies 🌙";
}

// Offer popup
function showOffer(){
    alert("🎉 Today Offer: Buy 5 Idlies Get 2 Free!");
}
let cart = [];

function addToCart(item){
    cart.push(item);
    alert(item + " added to cart 🛒");
}
function placeOrder(event){
    event.preventDefault();
    alert("✅ Order Placed Successfully! Thank you.");
}
function loginUser(event){
    event.preventDefault();

    let email = document.querySelector("input[type='email']").value;
    let password = document.querySelector("input[type='password']").value;

    if(email === "admin@gmail.com" && password === "1234"){
        alert("Login Successful 🎉");
    } else {
        alert("Invalid Credentials ❌");
    }
}

}
