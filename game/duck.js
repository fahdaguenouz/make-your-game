class Duck  {
    constructor(width,height){
        this.height=width
        this.width=height
        this.position =  { x: 550, y: 650 };
        this.element = null;
        this.flyInterval = null;
        this.speed = { x: 6+ Math.random() *5, y: 2 + Math.random() * 5 };
        this.id = 'duck-' + Math.floor(Math.random() * 15);

    }
    render() {
        const imgDuck = document.createElement("img");
        imgDuck.setAttribute("src", "../media/duck.gif");
        imgDuck.setAttribute("alt", "Duck");
        imgDuck.className = "duck";
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
    
    fly(){
        if (this.flyInterval) return this;
                
                this.flyInterval = setInterval(() => {
                    const container = document.querySelector("#container");
                    const containerWidth = container.clientWidth;
                    const containerHeight = container.clientHeight;
                    //console.log(containerHeight,containerWidth);
                    
                    // Update position
                    this.position.x += this.speed.x;
                    this.position.y += this.speed.y;
                   // console.log(this.position.x,this.position.y);
                    
                    // Bounce off walls
                    
                    if (this.position.x > containerWidth+50  || this.position.x < 20) {
                        console.log(this.position.x,containerWidth);
                        this.speed.x *= -1;
                       // this.faceDirection();
                    }
                    
                    if (this.position.y > containerHeight-15 || this.position.y < 14) {
                        this.speed.y *= -1;
                    }
                    
                    // // Update element position
                    this.element.style.left = this.position.x + "px";
                 this.element.style.top = this.position.y + "px";
                    
    
                    
                }, 50);
                
                return this;
            }
            faceDirection() {
                // Face the duck in the direction it's moving
                if (this.speed.x > 0) {
                    this.element.style.transform = "scaleX(1)";
                } else {
                    this.element.style.transform = "scaleX(-1)";
                }
            }
            
            stop() {
                if (this.flyInterval) {
                    clearInterval(this.flyInterval);
                    this.flyInterval = null;
                }
                return this;
            }

    
       

}
export default Duck;