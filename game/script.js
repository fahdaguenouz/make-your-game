import  Duck from  "./duck.js"
import  Dog from  "./dog.js"

document.addEventListener("DOMContentLoaded",()=>{
    CreateField()
    const duck =new Duck(80,60)
    const dog =new Dog(100,100)
    dog.render()
    duck.render()
    duck.fly()
    startGame(duck)
}) 



function CreateField(){
    const field=document.createElement("div")
    const bg=document.createElement("img")
    const main=document.querySelector("#container")
    main.appendChild(field) 
    bg.setAttribute('src', './media/homebg.png');
    bg.setAttribute('id', 'fieldImg');
    bg.setAttribute('alt', 'Background');
    bg.setAttribute('height', '100%');
    bg.setAttribute('width', '100%');
    main.appendChild(bg)
}
    
function startGame(duck) {
    // Ensure the duck element is properly selected after rendering
    const duckElement = document.querySelector(".duck");

    if (duckElement) {
        duckElement.addEventListener("click", () => {
            if (typeof duck.die === "function") {
                duck.die(); // Stop the duck if the stop() method exists
            }
        });
    }
}