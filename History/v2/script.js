const animationContainer = document.getElementById('animation-container');
const lineLength = 25; // Length of each line
const lineThickness = 2; // Thickness of each line
const lineColor = 'white'; // Color of each line
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Function to create a line extending in the specified direction
function createLine(x, y, angle) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineThickness}px`;
    line.style.backgroundColor = lineColor;
    line.style.transformOrigin = 'left center'; // Set transform origin to left center
    line.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    animationContainer.appendChild(line);
    gsap.to(line, { scaleX: 0 }); // Animate line's scale to 0 initially
    gsap.to(line, { scaleX: 1, duration: 1, delay: 0.5 }); // Animate line's scale to 1
}

// Function to create a circle at the specified coordinates
function createCircle(x, y) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.left = `${0}px`; // Adjusting x coordinate to match the center of the line
    circle.style.top = `${0}px`; // Keeping y coordinate as is
    line.style.transform = `translate(${x}px, ${y}px)`;
    animationContainer.appendChild(circle);
    gsap.from(circle, { duration: 1, scale: 0, ease: "elastic.out(1, 0.3)" }); // Animate circle's scale from 0 to 1
}

// Create initial lines extending in grid-like directions from the center
createLine(0, 0, 0); // Right
createLine(0, 0, 90); // Down
createLine(0, 0, 180); // Left
createLine(0, 0, 270); // Up

createCircle(50, 0); // Create a circle at the center
