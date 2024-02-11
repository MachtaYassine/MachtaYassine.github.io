document.addEventListener('DOMContentLoaded', function () {
    const animationSection = document.querySelector('.animation-section');
    const gridSize = 20;
    const nodeSize = 20;

    function createNode(x, y) {
        const node = document.createElement('div');
        node.classList.add('node');
        node.style.left = `${x * (nodeSize + 5)}px`;
        node.style.top = `${y * (nodeSize + 5)}px`;
        animationSection.appendChild(node);
    }

    async function animateNodes() {
        let col = Math.floor(Math.random() * gridSize);
        let row = Math.floor(Math.random() * gridSize);

        createNode(col, row);

        let pointQueue = [{ x: col, y: row }];

        while (pointQueue.length > 0) {
            let currentPoint = pointQueue.pop();
            col = currentPoint.x;
            row = currentPoint.y;

            const adjacentPositions = [
                { offsetX: -1, offsetY: 0 },
                { offsetX: 1, offsetY: 0 },
                { offsetX: 0, offsetY: -1 },
                { offsetX: 0, offsetY: 1 },
            ];

            for (const pos of adjacentPositions) {
                const newX = col + pos.offsetX;
                const newY = row + pos.offsetY;

                if (newX >= 0 && newY >= 0 && newX < gridSize && newY < gridSize) {
                    const neighbor = animationSection.querySelector(`.node[data-x="${newX}"][data-y="${newY}"]`);
                    if (!neighbor) {
                        createNode(newX, newY);
                        pointQueue.push({ x: newX, y: newY });
                    }
                }
            }

            await gsap.to(".node", { duration: 0.5, scale: 2, opacity: 0, stagger: 0.1 });
            // Animating nodes with GSAP
        }
    }

    animateNodes();
});
