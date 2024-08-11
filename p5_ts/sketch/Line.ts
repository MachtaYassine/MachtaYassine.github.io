function findIntersection(
    point1: p5.Vector,
    point2: p5.Vector,
    point3: p5.Vector,
    point4: p5.Vector
  ) {
    // Check for vertical line 1
    if (point1.x === point2.x) {
      // Line 1 is vertical, check line 2
      if (point3.x === point4.x) {
        // Both lines vertical
        return null; // Parallel or coincident lines
      } else {
        // Line 2 is not vertical - calculate intersection with vertical line
        const m2 = (point4.y - point3.y) / (point4.x - point3.x);
        const b2 = point3.y - m2 * point3.x;
        const y = m2 * point1.x + b2;
        return createVector(point1.x, y);
      }
    }
  
    // Check for vertical line 2
    if (point3.x === point4.x) {
      // Similar logic as above but for line 2 being vertical
      const m1 = (point2.y - point1.y) / (point2.x - point1.x);
      const b1 = point1.y - m1 * point1.x;
      const y = m1 * point3.x + b1;
      return createVector(point3.x, y);
    }
  
    // Original calculation for non-vertical lines
    const m1 = (point2.y - point1.y) / (point2.x - point1.x);
    const m2 = (point4.y - point3.y) / (point4.x - point3.x);
  
    if (m1 === m2) {
      return null;
    }
  
    const b1 = point1.y - m1 * point1.x;
    const b2 = point3.y - m2 * point3.x;
  
    const x = (b2 - b1) / (m1 - m2);
    const y = m1 * x + b1;
  
    return createVector(x, y);
  }
  
  class Line {
    start: Circle;
    end: Circle;
    drawn_end: p5.Vector;
    step: number = 0.0;
    step_increase: number;
    delay: number = random(0, 0.5);
    constructor(start: Circle, end: Circle) {
      this.start = start;
      this.end = end;
      this.drawn_end = createVector(start.position.x, start.position.y);
      this.step = 0.0;
      this.step_increase = random(0.15, 0.2);
    }
    display() {
      this.update();
      line(
        this.start.position.x,
        this.start.position.y,
        this.drawn_end.x,
        this.drawn_end.y
      );
    }
  
    update() {
      if (this.delay > 0) {this.delay -= 1/60;}
      
      //interpolate points between start and end to ;ake an efffect of a line getting longer
      if (this.step < 1 ) {
        if (this.start.finished_growing_circle && this.delay <= 0) {
          this.step += this.step_increase;}
        
          this.drawn_end = p5.Vector.lerp(
            this.start.position,
            this.end.position,
            this.step);
        
      } else {
        this.drawn_end = this.end.position;
        if (!this.end.propagated) {
          this.end.propagate_while_creating_lines_to_neighbours();
        }
      }
    }
  }
  
  class SpecialLine extends Line {
    start: Circle;
    end: Circle;
    inter_point_1: p5.Vector;
    inter_point_2: p5.Vector;
    drawn_end_1: p5.Vector;
    drawn_end_2: p5.Vector;
    step_1: number = this.step;
    step_2: number = this.step;
    constructor(start: Circle, end: Circle) {
      super(start, end);
      this.inter_point_1 = null;
      this.inter_point_2 = null;
      this.drawn_end_1 = createVector(start.position.x, start.position.y);
      this.drawn_end_2 = createVector(end.position.x, end.position.y);
    }
  
    findIntersection(
      x_activation: number,
      y_activation: number,
      x_sign: number,
      y_sign: number
    ) {
      const lowerLeftCorner = createVector(0, windowHeight);
      const lowerRightCorner = createVector(windowWidth, windowHeight);
      const upperLeftCorner = createVector(0, 0);
      const upperRightCorner = createVector(windowWidth, 0);
      const RightEdge: p5.Vector[] = [upperRightCorner, lowerRightCorner];
      const LeftEdge: p5.Vector[] = [upperLeftCorner, lowerLeftCorner];
      const TopEdge: p5.Vector[] = [upperLeftCorner, upperRightCorner];
      const BottomEdge: p5.Vector[] = [lowerLeftCorner, lowerRightCorner];
  
      const new_position = createVector(0, 0);
  
      new_position.x = this.end.position.x + windowWidth * x_sign * x_activation;
      new_position.y = this.end.position.y + windowHeight * y_sign * y_activation;
      let point1: p5.Vector,
        point2: p5.Vector,
        point3: p5.Vector,
        point4: p5.Vector;
      let intersection: p5.Vector;
      switch (true) {
        case x_activation === 1 && y_activation === 1:
          //this is the case when the circle is in the corner
          //we need to check two intersection points and find the one in the window
          if (x_sign === 1) {
            [point1, point2] = RightEdge;
          } else {
            [point1, point2] = LeftEdge;
          }
          if (y_sign === 1) {
            [point3, point4] = BottomEdge;
          } else {
            [point3, point4] = TopEdge;
          }
          const intersection1 = findIntersection(
            this.start.position,
            new_position,
            point1,
            point2
          );
          const intersection2 = findIntersection(
            this.start.position,
            new_position,
            point3,
            point4
          );
          // console.log("intersection coords", intersection1, intersection2);
          //find which intersection is in the window
          if (
            intersection1.x >= 0 &&
            intersection1.x <= windowWidth &&
            intersection1.y >= 0 &&
            intersection1.y <= windowHeight
          ) {
            intersection = intersection1.copy();
          } else {
            intersection = intersection2.copy();
          }
          break;
  
        case x_activation === 1:
          if (x_sign === 1) {
            [point3, point4] = RightEdge;
          } else {
            [point3, point4] = LeftEdge;
          }
          intersection = findIntersection(
            this.start.position,
            new_position,
            point3,
            point4
          );
          break;
        case y_activation === 1:
          if (y_sign === 1) {
            [point3, point4] = BottomEdge;
          } else {
            [point3, point4] = TopEdge;
          }
          intersection = findIntersection(
            this.start.position,
            new_position,
            point3,
            point4
          );
          break;
      }
  
      this.inter_point_1 = intersection.copy();
      this.inter_point_2 = intersection.copy();
      this.inter_point_2.y += windowHeight * -1 * y_sign * y_activation;
      this.inter_point_2.x += windowWidth * -1 * x_sign * x_activation;
  
      // console.log(
      //   "All info is start coords ",
      //   this.start.position.x,
      //   this.start.position.y,
      //   "and grid coords",
      //   this.start.parent.i,
      //   this.start.parent.j,
      //   "end coords and grid coords",
      //   this.end.position.x,
      //   this.end.position.y,
      //   "and grid coords",
      //   this.end.parent.i,
      //   this.end.parent.j,
      //   "new position",
      //   new_position.x,
      //   new_position.y,
      //   "window coords",
      //   windowWidth,
      //   windowHeight,
      //   "paramaters",
      //   x_activation,
      //   y_activation,
      //   x_sign,
      //   y_sign,
      //   "intersection",
      //   intersection,
      //   "inter point 1 coords",
      //   this.inter_point_1.x,
      //   this.inter_point_1.y,
      //   "inter point 2 coords",
      //   this.inter_point_2.x,
      //   this.inter_point_2.y
      // );
    }
  
    computeInterPoints() {
      switch (true) {
        case this.start.parent.i === 0 &&
          this.start.parent.j === 0 &&
          this.end.parent.i === numColumns - 1 &&
          this.end.parent.j === numRows - 1:
          //top left corner and bottom right corner
          this.findIntersection(1, 1, -1, -1);
          return;
        case this.start.parent.i === 0 &&
          this.start.parent.j === numRows - 1 &&
          this.end.parent.i === numColumns - 1 &&
          this.end.parent.j === 0:
          //bottom left corner and top right corner
          this.findIntersection(1, 1, -1, 1);
          return;
        case this.start.parent.i === numColumns - 1 &&
          this.start.parent.j === 0 &&
          this.end.parent.i === 0 &&
          this.end.parent.j === numRows - 1:
          //top right corner and bottom left corner
          this.findIntersection(1, 1, 1, -1);
          return;
        case this.start.parent.i === numColumns - 1 &&
          this.start.parent.j === numRows - 1 &&
          this.end.parent.i === 0 &&
          this.end.parent.j === 0:
          //bottom right corner and top left corner
          this.findIntersection(1, 1, 1, 1);
          return;
        case this.start.parent.i === 0 && this.end.parent.i === numColumns - 1:
          //left edge and right edge
          this.findIntersection(1, 0, -1, 0);
          return;
        case this.start.parent.i === numColumns - 1 && this.end.parent.i === 0:
          //right edge and left edge
          this.findIntersection(1, 0, 1, 0);
          return;
        case this.start.parent.j === 0 && this.end.parent.j === numRows - 1:
          //top edge and bottom edge
          this.findIntersection(0, 1, 0, -1);
          return;
        case this.start.parent.j === numRows - 1 && this.end.parent.j === 0:
          //bottom edge and top edge
          this.findIntersection(0, 1, 0, 1);
          return;
      }
    }
  
    update(): void {
      if (this.delay > 0) {this.delay -= 1/60;}
      if (this.step_1 < 1) {
        if (this.start.finished_growing_circle && this.delay <= 0) {
          this.step_1 += this.step_increase;
        }
        this.drawn_end_1 = p5.Vector.lerp(
          this.start.position,
          this.inter_point_1,
          this.step_1
        );
      }
      else {
        this.drawn_end_1 = this.inter_point_1;
        if (this.step_2 < 1 ) {
          this.step_2 += this.step_increase;
          this.drawn_end_2 = p5.Vector.lerp(
            this.inter_point_2,
            this.end.position,
            this.step_2
          );}
        else {
          this.drawn_end_2 = this.end.position;
          if (!this.end.propagated) {
            this.end.propagate_while_creating_lines_to_neighbours();
          }
          
        }
        }
      }
      
  
    display() {
      this.computeInterPoints();
      this.update();
      // console.log("the start is ", this.start.parent.i,this.start.parent.j," ", this.drawn_end_1, this.inter_point_1, this.drawn_end_2, this.end.position);
      line(
        this.start.position.x,
        this.start.position.y,
        this.drawn_end_1.x,
        this.drawn_end_1.y
      );
      if (this.step_1 >= 1) {
      line(
        this.inter_point_2.x,
        this.inter_point_2.y,
        this.drawn_end_2.x,
        this.drawn_end_2.y
      );}
    }
  }