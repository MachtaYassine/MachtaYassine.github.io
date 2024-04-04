var ColorHelper = (function () {
    function ColorHelper() {
    }
    ColorHelper.getColorVector = function (c) {
        return createVector(red(c), green(c), blue(c));
    };
    ColorHelper.rainbowColorBase = function () {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    };
    ColorHelper.getColorsArray = function (total, baseColorArray) {
        var _this = this;
        if (baseColorArray === void 0) { baseColorArray = null; }
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(function (x) { return _this.getColorVector(x); });
        ;
        var colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    };
    ColorHelper.getColorByPercentage = function (firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    };
    return ColorHelper;
}());
var PolygonHelper = (function () {
    function PolygonHelper() {
    }
    PolygonHelper.draw = function (numberOfSides, width) {
        push();
        var angle = TWO_PI / numberOfSides;
        var radius = width / 2;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = cos(a) * radius;
            var sy = sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
        pop();
    };
    return PolygonHelper;
}());
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
        this.step_increase = random(0.075, 0.125);
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
            if (this.start.finished_growing && this.delay <= 0) {
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
            if (this.start.finished_growing && this.delay <= 0) {
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
var Circle = (function () {
    function Circle(x, y, inter_radius, parent) {
        this.initial_radius = 0;
        this.propagated = false;
        this.finished_growing = false;
        this.radius_increase = random(2, 5);
        this.position = createVector(x, y);
        this.inter_radius = inter_radius;
        this.radius = this.initial_radius;
        this.velocity = createVector(0, 0);
        this.parent = parent;
        this.Neighbors = null;
        this.SpecialNeighbors = null;
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
        this.update();
        circle(this.position.x, this.position.y, this.radius);
    };
    Circle.prototype.update = function () {
        if (this.radius < this.inter_radius && this.propagated) {
            this.radius += this.radius_increase;
        }
        if (this.radius > this.inter_radius) {
            this.finished_growing = true;
            this.radius = this.inter_radius;
        }
        this.position.add(this.velocity);
        this.checkEdges();
    };
    Circle.prototype.checkEdges = function () {
        if (this.position.x >
            this.parent.x + this.parent.width - this.inter_radius / 2 ||
            this.position.x < this.parent.x + this.inter_radius / 2) {
            this.position.x = (this.position.x >
                this.parent.x + this.parent.width - this.inter_radius / 2 ? this.parent.x + this.parent.width - this.inter_radius / 2 : this.parent.x + this.inter_radius / 2);
            this.velocity.x =
                random(0, 1) *
                    (this.position.x < this.parent.x + this.inter_radius / 2 ? 1 : -1);
        }
        if (this.position.y >
            this.parent.y + this.parent.height - this.inter_radius / 2 ||
            this.position.y < this.parent.y + this.inter_radius / 2) {
            this.position.y = (this.position.y >
                this.parent.y + this.parent.height - this.inter_radius / 2 ? this.parent.y + this.parent.height - this.inter_radius / 2 : this.parent.y + this.inter_radius / 2);
            this.velocity.y =
                random(0, 1) *
                    (this.position.y < this.parent.y + this.inter_radius / 2 ? 1 : -1);
        }
    };
    return Circle;
}());
var wheelTimer = 1;
document.addEventListener("wheel", function (event) {
    clearTimeout(wheelTimer);
    if (tile_array[0][0].circle.velocity.mag() <= 1) {
        tile_array.forEach(function (row) {
            row.forEach(function (rectangle) {
                rectangle.circle.velocity = createVector(random(-1, 1), random(-1, 1)).mult(3);
            });
        });
    }
    console.log("the length of line list is", lineList.length);
    wheelTimer = setTimeout(function () {
        tile_array.forEach(function (row) {
            row.forEach(function (rectangle) {
                rectangle.circle.velocity = createVector(0, 0);
            });
        });
    }, 150);
});
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
    }
    Rectangle.prototype.display = function () {
        rect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}());
function setup() {
    createCanvas(viewportWidth, viewportHeight);
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
    tile_array.forEach(function (row) {
        row.forEach(function (rectangle) {
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
//# sourceMappingURL=build.js.map