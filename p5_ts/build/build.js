function convergeTo(x, target, step) {
    if (step > 0) {
        if (x < target) {
            x += step;
        }
        else {
            x = target;
        }
    }
    else {
        if (x > target) {
            x += step;
        }
        else {
            x = target;
        }
    }
    return x;
}
var Circle = (function () {
    function Circle(x, y, inter_radius, parent) {
        this.initial_radius = 0;
        this.circle_width = 0;
        this.circle_height = 0;
        this.circle_radius = 0;
        this.propagated = false;
        this.finished_growing_circle = false;
        this.radius_increase = random(3, 6);
        this.toggle_rect_mode = false;
        this.baseColor = color(153, 0, 0);
        this.Color = this.baseColor;
        this.mouseOverQueue = -1;
        this.TargetColor = color(128, 0, 0);
        this.position = createVector(x, y);
        this.intermediate_radius = inter_radius;
        this.circle_radius = this.initial_radius;
        this.circle_height = this.circle_radius;
        this.circle_width = this.circle_radius;
        this.velocity = createVector(0, 0);
        this.parent = parent;
        this.Neighbors = null;
        this.SpecialNeighbors = null;
        this.circle_type = (this.parent.j === 0) ? 'top' : (this.parent.j === numRows - 1) ? 'bottom' : "inner";
    }
    Circle.prototype.getNeighbours = function () {
        var neighbours = [];
        var special_neighbors = [];
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (i === 0 && j === 0)
                    continue;
                if (this.parent.i + i >= 0 &&
                    this.parent.j + j >= 0 &&
                    this.parent.i + i < numColumns &&
                    this.parent.j + j < numRows) {
                    neighbours.push(get_element(this.parent.i + i, this.parent.j + j).circle);
                }
                else {
                    special_neighbors.push(get_element(positiveModulo(this.parent.i + i, numColumns), positiveModulo(this.parent.j + j, numRows)).circle);
                }
            }
        }
        this.Neighbors = neighbours;
        this.SpecialNeighbors = special_neighbors;
    };
    Circle.prototype.propagate_while_creating_lines_to_neighbours = function () {
        var _this = this;
        if (!this.Neighbors) {
            this.getNeighbours();
        }
        this.propagated = true;
        this.Neighbors.forEach(function (neighbour) {
            if (!neighbour.propagated) {
                lineList.push(new Line(_this, neighbour));
            }
        });
        this.SpecialNeighbors.forEach(function (neighbour) {
            if (!neighbour.propagated) {
                lineList.push(new SpecialLine(_this, neighbour));
            }
        });
    };
    Circle.prototype.display = function () {
        if (this.toggle_rect_mode) {
            this.update_when_rect();
            noStroke();
        }
        else {
            this.update_when_circle();
            this.checkEdges();
        }
        this.handleMouseOver();
        this.handleMovement();
        fill(this.Color);
        rect(this.position.x - this.circle_radius / 2, this.position.y - this.circle_radius / 2, this.circle_width, this.circle_height, this.circle_radius);
    };
    Circle.prototype.handleMovement = function () {
        if (!this.toggle_rect_mode) {
            this.position.add(this.velocity);
        }
    };
    Circle.prototype.update_when_circle = function () {
        if (this.circle_radius < this.intermediate_radius && this.propagated) {
            this.circle_radius += this.radius_increase;
            this.circle_height = this.circle_radius;
            this.circle_width = this.circle_radius;
        }
        if (this.circle_radius > this.intermediate_radius) {
            this.finished_growing_circle = true;
            growing_circle_counter += 1;
            this.circle_radius = this.intermediate_radius;
            this.circle_height = this.circle_radius;
            this.circle_width = this.circle_radius;
        }
    };
    Circle.prototype.update_when_rect = function () {
        this.circle_width = convergeTo(this.circle_width, this.parent.width + 5, this.radius_increase);
        this.circle_height = convergeTo(this.circle_height, this.parent.height + 5, this.radius_increase);
        this.circle_radius = max(convergeTo(this.circle_radius, 0, -this.radius_increase), 0);
        this.position.x = constrain(convergeTo(this.position.x, this.parent.x, -this.radius_increase), 0, viewportWidth);
        this.position.y = constrain(convergeTo(this.position.y, this.parent.y, -this.radius_increase), 0, viewportHeight);
    };
    Circle.prototype.checkEdges = function () {
        if (this.position.x >
            this.parent.x + this.parent.width - this.intermediate_radius / 2 ||
            this.position.x < this.parent.x + this.intermediate_radius / 2) {
            this.position.x = (this.position.x >
                this.parent.x + this.parent.width - this.intermediate_radius / 2 ? this.parent.x + this.parent.width - this.intermediate_radius / 2 - 0.1 : this.parent.x + this.intermediate_radius / 2 + 0.1);
            this.velocity.x =
                0 *
                    (this.position.x < this.parent.x + this.intermediate_radius / 2 ? 1 : -1);
        }
        if (this.position.y >
            this.parent.y + this.parent.height - this.intermediate_radius / 2 ||
            this.position.y < this.parent.y + this.intermediate_radius / 2) {
            this.position.y = (this.position.y >
                this.parent.y + this.parent.height - this.intermediate_radius / 2 ? this.parent.y + this.parent.height - this.intermediate_radius / 2 : this.parent.y + this.intermediate_radius / 2);
            this.velocity.y =
                0 *
                    (this.position.y < this.parent.y + this.intermediate_radius / 2 ? 1 : -1);
        }
    };
    Circle.prototype.handleMouseOver = function () {
        if (this.mouseOverQueue > -1) {
            var distanceFromCounter = (gradientTrailCounter - this.mouseOverQueue + maxGradientColors) % maxGradientColors;
            this.Color = lerpColor(this.TargetColor, this.baseColor, distanceFromCounter / maxGradientColors);
        }
        else {
            this.Color = this.baseColor;
        }
    };
    return Circle;
}());
document.addEventListener("wheel", function (event) {
    var wheelTimer;
    clearTimeout(wheelTimer);
    if (tile_array[0][0].circle.velocity.mag() <= 1) {
        tile_array.forEach(function (row) {
            row.forEach(function (rectangle) {
                rectangle.circle.velocity = createVector(random(-1, 1), random(-1, 1)).mult(3);
            });
        });
    }
    wheelTimer = setTimeout(function () {
        tile_array.forEach(function (row) {
            row.forEach(function (rectangle) {
                rectangle.circle.velocity = createVector(0, 0);
            });
        });
    }, 150);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function findIntersection(point1, point2, point3, point4) {
    if (point1.x === point2.x) {
        if (point3.x === point4.x) {
            return null;
        }
        else {
            var m2_1 = (point4.y - point3.y) / (point4.x - point3.x);
            var b2_1 = point3.y - m2_1 * point3.x;
            var y_1 = m2_1 * point1.x + b2_1;
            return createVector(point1.x, y_1);
        }
    }
    if (point3.x === point4.x) {
        var m1_1 = (point2.y - point1.y) / (point2.x - point1.x);
        var b1_1 = point1.y - m1_1 * point1.x;
        var y_2 = m1_1 * point3.x + b1_1;
        return createVector(point3.x, y_2);
    }
    var m1 = (point2.y - point1.y) / (point2.x - point1.x);
    var m2 = (point4.y - point3.y) / (point4.x - point3.x);
    if (m1 === m2) {
        return null;
    }
    var b1 = point1.y - m1 * point1.x;
    var b2 = point3.y - m2 * point3.x;
    var x = (b2 - b1) / (m1 - m2);
    var y = m1 * x + b1;
    return createVector(x, y);
}
var Line = (function () {
    function Line(start, end) {
        this.step = 0.0;
        this.delay = random(0, 0.5);
        this.start = start;
        this.end = end;
        this.drawn_end = createVector(start.position.x, start.position.y);
        this.step = 0.0;
        this.step_increase = random(0.15, 0.2);
    }
    Line.prototype.display = function () {
        this.update();
        line(this.start.position.x, this.start.position.y, this.drawn_end.x, this.drawn_end.y);
    };
    Line.prototype.update = function () {
        if (this.delay > 0) {
            this.delay -= 1 / 60;
        }
        if (this.step < 1) {
            if (this.start.finished_growing_circle && this.delay <= 0) {
                this.step += this.step_increase;
            }
            this.drawn_end = p5.Vector.lerp(this.start.position, this.end.position, this.step);
        }
        else {
            this.drawn_end = this.end.position;
            if (!this.end.propagated) {
                this.end.propagate_while_creating_lines_to_neighbours();
            }
        }
    };
    return Line;
}());
var SpecialLine = (function (_super) {
    __extends(SpecialLine, _super);
    function SpecialLine(start, end) {
        var _this = _super.call(this, start, end) || this;
        _this.step_1 = _this.step;
        _this.step_2 = _this.step;
        _this.inter_point_1 = null;
        _this.inter_point_2 = null;
        _this.drawn_end_1 = createVector(start.position.x, start.position.y);
        _this.drawn_end_2 = createVector(end.position.x, end.position.y);
        return _this;
    }
    SpecialLine.prototype.findIntersection = function (x_activation, y_activation, x_sign, y_sign) {
        var lowerLeftCorner = createVector(0, windowHeight);
        var lowerRightCorner = createVector(windowWidth, windowHeight);
        var upperLeftCorner = createVector(0, 0);
        var upperRightCorner = createVector(windowWidth, 0);
        var RightEdge = [upperRightCorner, lowerRightCorner];
        var LeftEdge = [upperLeftCorner, lowerLeftCorner];
        var TopEdge = [upperLeftCorner, upperRightCorner];
        var BottomEdge = [lowerLeftCorner, lowerRightCorner];
        var new_position = createVector(0, 0);
        new_position.x = this.end.position.x + windowWidth * x_sign * x_activation;
        new_position.y = this.end.position.y + windowHeight * y_sign * y_activation;
        var point1, point2, point3, point4;
        var intersection;
        switch (true) {
            case x_activation === 1 && y_activation === 1:
                if (x_sign === 1) {
                    point1 = RightEdge[0], point2 = RightEdge[1];
                }
                else {
                    point1 = LeftEdge[0], point2 = LeftEdge[1];
                }
                if (y_sign === 1) {
                    point3 = BottomEdge[0], point4 = BottomEdge[1];
                }
                else {
                    point3 = TopEdge[0], point4 = TopEdge[1];
                }
                var intersection1 = findIntersection(this.start.position, new_position, point1, point2);
                var intersection2 = findIntersection(this.start.position, new_position, point3, point4);
                if (intersection1.x >= 0 &&
                    intersection1.x <= windowWidth &&
                    intersection1.y >= 0 &&
                    intersection1.y <= windowHeight) {
                    intersection = intersection1.copy();
                }
                else {
                    intersection = intersection2.copy();
                }
                break;
            case x_activation === 1:
                if (x_sign === 1) {
                    point3 = RightEdge[0], point4 = RightEdge[1];
                }
                else {
                    point3 = LeftEdge[0], point4 = LeftEdge[1];
                }
                intersection = findIntersection(this.start.position, new_position, point3, point4);
                break;
            case y_activation === 1:
                if (y_sign === 1) {
                    point3 = BottomEdge[0], point4 = BottomEdge[1];
                }
                else {
                    point3 = TopEdge[0], point4 = TopEdge[1];
                }
                intersection = findIntersection(this.start.position, new_position, point3, point4);
                break;
        }
        this.inter_point_1 = intersection.copy();
        this.inter_point_2 = intersection.copy();
        this.inter_point_2.y += windowHeight * -1 * y_sign * y_activation;
        this.inter_point_2.x += windowWidth * -1 * x_sign * x_activation;
    };
    SpecialLine.prototype.computeInterPoints = function () {
        switch (true) {
            case this.start.parent.i === 0 &&
                this.start.parent.j === 0 &&
                this.end.parent.i === numColumns - 1 &&
                this.end.parent.j === numRows - 1:
                this.findIntersection(1, 1, -1, -1);
                return;
            case this.start.parent.i === 0 &&
                this.start.parent.j === numRows - 1 &&
                this.end.parent.i === numColumns - 1 &&
                this.end.parent.j === 0:
                this.findIntersection(1, 1, -1, 1);
                return;
            case this.start.parent.i === numColumns - 1 &&
                this.start.parent.j === 0 &&
                this.end.parent.i === 0 &&
                this.end.parent.j === numRows - 1:
                this.findIntersection(1, 1, 1, -1);
                return;
            case this.start.parent.i === numColumns - 1 &&
                this.start.parent.j === numRows - 1 &&
                this.end.parent.i === 0 &&
                this.end.parent.j === 0:
                this.findIntersection(1, 1, 1, 1);
                return;
            case this.start.parent.i === 0 && this.end.parent.i === numColumns - 1:
                this.findIntersection(1, 0, -1, 0);
                return;
            case this.start.parent.i === numColumns - 1 && this.end.parent.i === 0:
                this.findIntersection(1, 0, 1, 0);
                return;
            case this.start.parent.j === 0 && this.end.parent.j === numRows - 1:
                this.findIntersection(0, 1, 0, -1);
                return;
            case this.start.parent.j === numRows - 1 && this.end.parent.j === 0:
                this.findIntersection(0, 1, 0, 1);
                return;
        }
    };
    SpecialLine.prototype.update = function () {
        if (this.delay > 0) {
            this.delay -= 1 / 60;
        }
        if (this.step_1 < 1) {
            if (this.start.finished_growing_circle && this.delay <= 0) {
                this.step_1 += this.step_increase;
            }
            this.drawn_end_1 = p5.Vector.lerp(this.start.position, this.inter_point_1, this.step_1);
        }
        else {
            this.drawn_end_1 = this.inter_point_1;
            if (this.step_2 < 1) {
                this.step_2 += this.step_increase;
                this.drawn_end_2 = p5.Vector.lerp(this.inter_point_2, this.end.position, this.step_2);
            }
            else {
                this.drawn_end_2 = this.end.position;
                if (!this.end.propagated) {
                    this.end.propagate_while_creating_lines_to_neighbours();
                }
            }
        }
    };
    SpecialLine.prototype.display = function () {
        this.computeInterPoints();
        this.update();
        line(this.start.position.x, this.start.position.y, this.drawn_end_1.x, this.drawn_end_1.y);
        if (this.step_1 >= 1) {
            line(this.inter_point_2.x, this.inter_point_2.y, this.drawn_end_2.x, this.drawn_end_2.y);
        }
    };
    return SpecialLine;
}(Line));
var Rectangle = (function () {
    function Rectangle(i, j, x, y, width, height) {
        this.gap = 0;
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.width = (i === numColumns - 1 || i === 0) ? width / 2 : width + width / (numColumns - 2);
        this.height = (j === numRows - 1 || j === 0) ? height / 2 : height + height / (numRows - 2);
        this.gap = Math.min(this.width, this.height) * 0.4;
        var offset_x = Math.random() * width * factor - (width * factor) / 2;
        var offset_y = Math.random() * height * factor - (height * factor) / 2;
        this.circle = new Circle(x + offset_x + this.width / 2, y + offset_y + this.height / 2, Math.min(this.width, this.height) - this.gap, this);
        if (j === 0) {
            TopCircles.push(this.circle);
        }
        else if (j === numRows - 1) {
            BottomCircles.push(this.circle);
        }
    }
    Rectangle.prototype.display = function () {
        this.handleMouseOver();
    };
    Rectangle.prototype.handleMouseOver = function () {
        var _this = this;
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            this.circle.mouseOverQueue = gradientTrailCounter;
            if (gradientLastTile !== this) {
                gradientTrailCounter++;
                gradientTrailCounter = gradientTrailCounter % maxGradientColors;
            }
            gradientLastTile = this;
            setTimeout(function () {
                _this.circle.mouseOverQueue = -1;
            }, 200);
        }
    };
    return Rectangle;
}());
var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
var number_of_circle = Math.floor(Math.random() * 10) + 10;
var itemWidth = viewportWidth / number_of_circle;
var itemHeight = viewportHeight / number_of_circle;
var haflWidth = itemWidth / 2;
var halfHeight = itemHeight / 2;
var gap = Math.min(itemWidth, itemHeight) * 0.4;
var factor = 0.4;
var numColumns = Math.floor((viewportWidth - 0) / itemWidth);
var numRows = Math.floor((viewportHeight - 0) / itemHeight);
var number_initial_points = Math.floor(numColumns * numRows * Math.random() * 0.2) + 1;
var tile_array = [];
var lineList = [];
var growing_circle_counter = 0;
var TopCircles = [];
var BottomCircles = [];
var gradientTrailCounter = 0;
var gradientLastTile = null;
var maxGradientColors = 20;
function get_element(x, y) {
    return tile_array[y][x];
}
function positiveModulo(dividend, divisor) {
    var remainder = dividend % divisor;
    if (remainder < 0) {
        remainder += divisor;
    }
    return remainder;
}
function setup() {
    console.log("number of columns and rows are", numColumns, numRows);
    var canvas = createCanvas(viewportWidth, viewportHeight);
    canvas.parent('canvas-container');
    for (var j = 0; j < numRows; j++) {
        tile_array[j] = [];
        for (var i = 0; i < numColumns; i++) {
            tile_array[j][i] = new Rectangle(i, j, max(haflWidth + (i - 1) * (itemWidth + itemWidth / (numRows - 2)), 0), max(halfHeight + (j - 1) * (itemHeight + itemHeight / (numColumns - 2)), 0), itemWidth, itemHeight);
        }
    }
    for (var n = 0; n < number_initial_points; n++) {
        var i = Math.floor(Math.random() * numColumns);
        var j = Math.floor(Math.random() * numRows);
        console.log("the random i and j are", i, j);
        tile_array[j][i].circle.propagate_while_creating_lines_to_neighbours();
    }
}
function draw() {
    background(255);
    if (growing_circle_counter == numColumns * numRows) {
        growing_circle_counter += 1;
        tile_array.forEach(function (row) {
            row.forEach(function (rectangle) {
                if (rectangle.circle.circle_type === 'inner') {
                    rectangle.circle.toggle_rect_mode = true;
                }
            });
        });
    }
    if (growing_circle_counter > numColumns * numRows) {
        handleScrollCircles();
    }
    tile_array.forEach(function (row) {
        row.forEach(function (rectangle) {
            rectangle.display();
        });
    });
    lineList.forEach(function (line) { return line.display(); });
    for (var j = 0; j < numRows; j++) {
        for (var i = 0; i < numColumns; i++) {
            tile_array[j][i].circle.display();
        }
    }
}
window.addEventListener("resize", function () {
    location.reload();
});
function handleScrollCircles() {
    if (window.scrollY === 0) {
        TopCircles.forEach(function (circle) {
            circle.toggle_rect_mode = true;
        });
    }
    if (window.scrollY + viewportHeight === document.body.scrollHeight) {
        BottomCircles.forEach(function (circle) {
            circle.toggle_rect_mode = true;
        });
    }
}
//# sourceMappingURL=build.js.map