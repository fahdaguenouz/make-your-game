class Dog{
    constructor(width,height,position){
        this.height=width
        this.width=height
        this.position = position || { x: 50, y: 50 };
        this.element = null;
        this.flyInterval = null;
        this.speed = { x: 4 + Math.random() * 30, y: 2 + Math.random() * 5 };
        this.id = 'dog-' + Math.floor(Math.random() * 10000);
        this.flapping = true;
    }
    render() {
        const imgDuck = document.createElement("img");
        imgDuck.setAttribute("src", "../media/dog.gif");
        imgDuck.setAttribute("alt", "dog");
        imgDuck.className = "dog";
        imgDuck.id = this.id;
        imgDuck.style.width = this.width + "px";
        imgDuck.style.height = this.height + "px";
        imgDuck.style.left = this.position.x + "px";
        imgDuck.style.top = this.position.y + "px";
        
        const main = document.querySelector("#container");
        main.appendChild(imgDuck);
        
        this.element = imgDuck;
        return this;
    }
    
   
    
       

}
export default Dog