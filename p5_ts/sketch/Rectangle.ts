
class Rectangle {
    i: number;
    j: number;
    x: number;
    y: number;
    width: number;
    height: number;
    circle: Circle;
    gap : number = 0;
  
    constructor(
      i: number,
      j: number,
      x: number,
      y: number,
      width: number,
      height: number
    ) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.width = (i === numColumns - 1 || i === 0) ? width/2 : width+ width/(numColumns-2);
        this.height = (j === numRows - 1 || j === 0) ? height/2 : height + height/(numRows-2);
        this.gap = Math.min(this.width, this.height) * 0.4;
        const offset_x = Math.random() * width * factor - (width * factor) / 2;
        const offset_y = Math.random() * height * factor - (height * factor) / 2;
        this.circle = new Circle(
            x + offset_x + this.width / 2,
            y + offset_y + this.height / 2,
            Math.min(this.width, this.height) - this.gap,
            this
        );
        if (j === 0) {
            TopCircles.push(this.circle);}
        else if (j === numRows - 1) {
            BottomCircles.push(this.circle);
            }}
  
    display() {
    this.handleMouseOver()
    //rect(this.x, this.y, this.width, this.height);
    }

    handleMouseOver() {

        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height ) {
            
            this.circle.mouseOverQueue = gradientTrailCounter;
            if ( gradientLastTile !== this) 
           {     gradientTrailCounter++;
                gradientTrailCounter = gradientTrailCounter % maxGradientColors;}
            gradientLastTile = this;
            setTimeout(() => {
                this.circle.mouseOverQueue = -1;
            }, 200);
        } 
    }
  }
