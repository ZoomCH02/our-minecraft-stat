// Create the SVG container
const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const zoom = d3.zoom()
    .scaleExtent([1, 10])  // Limit zoom scale
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

const g = svg.append("g");

// Data for branches (temporary, replace with dynamic data from user input)
let points = [];

// Data for branches (temporary, replace with dynamic data from user input)
let branches = [
    { color: 'red', length: 300, direction: 'up' },
    { color: 'blue', length: 500, direction: 'right' },
    { color: 'green', length: 300, direction: 'down' },
    { color: 'yellow', length: 500, direction: 'left' }
];

// Function to update points on the map
const updatePoints = () => {
    // Remove existing points and lines
    g.selectAll(".point").remove();
    g.selectAll(".branch").remove();

    // Add new points on branches
    branches.forEach(branch => {
        const { x1, y1, x2, y2 } = calculateEndpoint(branch.length, branch.direction);

        // Calculate position along the line
        const position = 0.5; // Adjust this value to place the point along the line

        // Apply current zoom and pan transformation to calculate point coordinates
        const transform = d3.zoomTransform(svg.node());
        const pointX = transform.applyX(x1 + (x2 - x1) * position);
        const pointY = transform.applyY(y1 + (y2 - y1) * position);

        // Draw the branch line
        g.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", branch.color)
            .attr("stroke-width", 8)
            .attr("class", "branch");
    });

    const pointGroups = g.selectAll(".point")
        .data(points)
        .enter().append("g")
        .attr("class", "point")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add point circles
    pointGroups.append("circle")
        .attr("r", 6)
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add point labels
    pointGroups.append("text")
        .text(d => d.name)
        .attr("dy", -12)  // Offset text above the circle
        .attr("text-anchor", "middle")
        .attr("fill", "white");
};

// Function to calculate line endpoints
const calculateEndpoint = (length, direction) => {
    const centerX = width / 2;
    const centerY = height / 2;

    switch (direction) {
        case 'up':
            return { x1: centerX, y1: centerY, x2: centerX, y2: centerY - length };
        case 'right':
            return { x1: centerX, y1: centerY, x2: centerX + length, y2: centerY };
        case 'down':
            return { x1: centerX, y1: centerY, x2: centerX, y2: centerY + length };
        case 'left':
            return { x1: centerX, y1: centerY, x2: centerX - length, y2: centerY };
        default:
            return { x1: centerX, y1: centerY, x2: centerX, y2: centerY };
    }
};

// Update points initially
updatePoints();

// Function to handle right-click context menu
const handleContextMenu = (event) => {
    event.preventDefault();

    const posX = d3.pointer(event)[0];
    const posY = d3.pointer(event)[1];

    // Show context menu at mouse position
    showContextMenu(posX, posY);
};

// Function to show context menu at given coordinates
const showContextMenu = (x, y) => {
    // Open modal for entering point data
    showPointModal(x, y);
};

// Function to show point modal
const showPointModal = (x, y) => {
    $('#pointModal').modal('show');

    // Set initial coordinates in modal inputs
    document.getElementById('pointCoordinates').value = `${x}, ${y}`;
};

// Event listener for right-click context menu
svg.on("contextmenu", handleContextMenu);

// Event listener for save button in modal
document.getElementById('savePointBtn').addEventListener('click', () => {
    const pointName = document.getElementById('pointName').value;
    const pointCoordinates = document.getElementById('pointCoordinates').value;

    // Extract coordinates from input
    const [coordX, coordY] = pointCoordinates.split(',').map(coord => parseFloat(coord.trim()));

    // Apply current zoom and pan transformation to get accurate coordinates
    const transform = d3.zoomTransform(svg.node());
    const mappedX = transform.invertX(coordX);
    const mappedY = transform.invertY(coordY);

    // Add new point to the array
    points.push({ name: pointName, x: mappedX, y: mappedY });

    // Update points on the map
    updatePoints();

    // Close modal after saving
    $('#pointModal').modal('hide');

    // Clear input fields
    document.getElementById('pointName').value = '';
    document.getElementById('pointCoordinates').value = '';
});
