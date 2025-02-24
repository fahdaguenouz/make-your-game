import  Duck from  "./duck.js"
document.addEventListener("DOMContentLoaded",()=>{
    CreateField()
    const duck =new Duck(80,60)
    duck.render()
    duck.fly()
    
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
    
