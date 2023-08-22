import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Default data
var data = [
  { group: "1", value: 0 },
  { group: "2", value: 0 },
  { group: "3", value: 0 },
  { group: "4", value: 0 },
  { group: "5", value: 0 },
  { group: "6", value: 0 },
  { group: "7", value: 0 },
  { group: "8", value: 0 },
  { group: "9", value: 0 },
  { group: "10", value: 0 },
];

var n = 0;

function handleSubmit(event) {
  console.log(event);
  let valueInput = document.getElementById("value");
  let value;
  if (event.key === "Enter") {
    value = valueInput.value;
    valueInput.value = "";
  } else if (event.type === "click") {
    value = valueInput.value;
  }


  console.log(value);

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    if (entry.group == value) {
      entry.value++
      n++;
    }
  }
  update(data);
}

// Event listener to add data
document.querySelector("#submit").addEventListener('click', handleSubmit);
document.querySelector("#value").addEventListener('keydown', handleSubmit);


// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60};
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom

// Create svg element
var svg = d3.select('#svg-container')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// X axis
var x = d3.scaleBand()
  .range([0, width])
  .domain(data.map(d => d.group))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 20])
  .range([height, 0]);
svg.append("g")
  .attr("class", "myYaxis")
  .call(d3.axisLeft(y));

// Add title
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", (width / 4))
  .attr("y", 0 - (margin.top / 2))
  .attr("dy", "-0.5em") // Fine-tune vertical position
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .text("Pick a random number from 1 to 10")

// A function that create / update the plot for a given variable:
function update(data) {

  // Load the data 
  var u = svg.selectAll("rect")
    .data(data)

  // Remove old text elements
  svg.selectAll(".bar-label").remove();
  svg.selectAll(".n-label").remove();

// Add the number of values entered
  svg.append("text")
    .attr("class", "n-label")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2) + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-style", "italic")
    .text(`n = ${n}`);

  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(100)
    .attr("x", d => x(d.group))
    .attr("y", function (d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.value); })
    .attr("fill", "#0d6efd")
    .each(function (d) {
      // Append new text element to rect element
      svg.append("text")
        .attr("class", "bar-label")
        .attr("text-anchor", "middle")
        .attr("x", x(d.group) + x.bandwidth() / 2)
        .attr("y", y(d.value)) // Adjust y position to be above rect
        .attr("dy", "-0.2em") // Fine-tune vertical position
        .style("font-size", "12px")
        .text(d.value);
    });
}
// Initialize the plot with the first dataset
update(data)