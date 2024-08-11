function convergeTo(x:number, target:number, step:number){
    if (step > 0){
        if (x < target){
            x += step;}
        else {
            x = target;
        }}
    else {
        if (x > target){
            x += step;}
        else {
            x = target;
        }}
    
    return x;
    }









class Circle {
    position: p5.Vector;
    intermediate_radius: number;
    initial_radius: number = 0;
    circle_width: number = 0;
    circle_height: number = 0;
    circle_radius: number = 0;
    velocity: p5.Vector;
    parent: Rectangle;
    propagated: boolean = false;
    finished_growing_circle: boolean = false;
    Neighbors: Circle[];
    SpecialNeighbors: Circle[];
    radius_increase: number = random(3, 6);
    circle_type: string;
    toggle_rect_mode: boolean = false;
    baseColor: p5.Color = color(153, 0, 0);
    Color: p5.Color = this.baseColor;
    mouseOverQueue: number=-1 ;
    TargetColor : p5.Color = color(128, 0, 0);
    constructor(x: number, y: number, inter_radius: number, parent: Rectangle) {
        this.position = createVector(x, y);
        this.intermediate_radius = inter_radius;
        this.circle_radius = this.initial_radius;
        this.circle_height=this.circle_radius
        this.circle_width=this.circle_radius
        // this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.velocity = createVector(0, 0);
        this.parent = parent;
        this.Neighbors = null;
        this.SpecialNeighbors = null;
        this.circle_type = (this.parent.j===0) ? 'top' : (this.parent.j === numRows-1) ? 'bottom' : "inner"
    }
  
    getNeighbours() {
      const neighbours = [];
      const special_neighbors = [];
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          if (
            this.parent.i + i >= 0 &&
            this.parent.j + j >= 0 &&
            this.parent.i + i < numColumns &&
            this.parent.j + j < numRows
          ) {
            neighbours.push(
              get_element(this.parent.i + i, this.parent.j + j).circle
            );
          } else {
        
            special_neighbors.push(
              get_element(
                positiveModulo(this.parent.i + i, numColumns),
                positiveModulo(this.parent.j + j, numRows)
              ).circle
            );
          }
        }
      }
      
      this.Neighbors = neighbours;
      this.SpecialNeighbors = special_neighbors;
    }
  
    propagate_while_creating_lines_to_neighbours() {
      if (!this.Neighbors) {
        this.getNeighbours();
      }
      this.propagated = true;
      this.Neighbors.forEach((neighbour) => {
        if (!neighbour.propagated) {
          lineList.push(new Line(this, neighbour));
        }
      });
      this.SpecialNeighbors.forEach((neighbour) => {
        if (!neighbour.propagated) {
          lineList.push(new SpecialLine(this, neighbour));
        }
      });
    }
  
    display() {
        

        if (this.toggle_rect_mode){
            this.update_when_rect();
            noStroke()
        } else {
            this.update_when_circle();
            this.checkEdges();
            
        }
        
        this.handleMouseOver()
        this.handleMovement()
        fill(this.Color)
        rect(this.position.x- this.circle_radius/2, this.position.y-this.circle_radius/2 , this.circle_width, this.circle_height, this.circle_radius);
    }


    handleMovement() {
        if (!this.toggle_rect_mode){
        this.position.add(this.velocity);}
        //if (this.parent.j === 0 && this.parent.i === 0){
        //    console.log(this.position, " velocity is ", this.velocity);}
    }
  
    update_when_circle() {
      if (this.circle_radius < this.intermediate_radius && this.propagated) {
        this.circle_radius += this.radius_increase;
        this.circle_height=this.circle_radius
        this.circle_width=this.circle_radius
      }
      if (this.circle_radius > this.intermediate_radius ) {
        this.finished_growing_circle = true;
        growing_circle_counter += 1;
        this.circle_radius = this.intermediate_radius;
        this.circle_height=this.circle_radius
        this.circle_width=this.circle_radius
      }
    }

    update_when_rect(){
        this.circle_width = convergeTo(this.circle_width, this.parent.width+5, this.radius_increase)
        this.circle_height = convergeTo(this.circle_height, this.parent.height+5, this.radius_increase)
        this.circle_radius = max(convergeTo(this.circle_radius,0, -this.radius_increase),0)
        this.position.x = constrain(convergeTo(this.position.x, this.parent.x , -this.radius_increase),0, viewportWidth)
        this.position.y = constrain(convergeTo(this.position.y, this.parent.y , -this.radius_increase),0, viewportHeight)

    }
  
    checkEdges() {
      if (
        this.position.x >
          this.parent.x + this.parent.width - this.intermediate_radius / 2 ||
        this.position.x < this.parent.x + this.intermediate_radius / 2
      ) {
        this.position.x = (this.position.x >
        this.parent.x + this.parent.width - this.intermediate_radius / 2 ? this.parent.x + this.parent.width - this.intermediate_radius / 2 - 0.1 : this.parent.x + this.intermediate_radius / 2 + 0.1)
        this.velocity.x =
          0 *
          (this.position.x < this.parent.x + this.intermediate_radius / 2 ? 1 : -1);
      }
      if (
        this.position.y >
          this.parent.y + this.parent.height - this.intermediate_radius / 2 ||
        this.position.y < this.parent.y + this.intermediate_radius / 2
      ) {
        this.position.y = (this.position.y >
        this.parent.y + this.parent.height - this.intermediate_radius / 2 ? this.parent.y + this.parent.height - this.intermediate_radius / 2 : this.parent.y + this.intermediate_radius / 2)
        this.velocity.y =
          0 *
          (this.position.y < this.parent.y + this.intermediate_radius / 2 ? 1 : -1);
      }
    }

    handleMouseOver() {
        if (this.mouseOverQueue > -1) {
            // find distance modulo maxGradientColors
            const distanceFromCounter = (gradientTrailCounter - this.mouseOverQueue + maxGradientColors) % maxGradientColors
            this.Color = lerpColor(this.TargetColor,this.baseColor, distanceFromCounter / maxGradientColors)}
        else {
            this.Color = this.baseColor;
        }
    }
}
  
  
  document.addEventListener("wheel", (event) => {
    let wheelTimer;
    // Clear the previous timer
    clearTimeout(wheelTimer);
  
    // Activate the effect
    if (tile_array[0][0].circle.velocity.mag() <= 1) {
      tile_array.forEach((row) => {
        row.forEach((rectangle) => {
          rectangle.circle.velocity = createVector(
            random(-1, 1),
            random(-1, 1)
          ).mult(3);
        });
      });}
    // console.log("the length of line list is", lineList.length);
    // Set a timer to deactivate the effect after 200ms (adjust as needed)
    wheelTimer = setTimeout(() => {
      tile_array.forEach((row) => {
        row.forEach((rectangle) => {
          rectangle.circle.velocity = createVector(0, 0); // Set velocity to zero
        });
      });
    }, 150); // Adjust the time as needed
  });
  