var svgWidth=960
var svgHeight=500

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", 960)
  .attr("height", 500)

var chartgroup= svg.append("g")
  .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../data.csv").then(function(data) {
      
data.forEach(function(d){

  d.poverty = +d.poverty
  d.healthcare = +d.healthcare
})
  // Add X axis

  // var xpoverty
  // var xage
  // var xhouseholdincome

  // var yobese
  // var ysmokes
  // var ylackshealthcare

  var xpoverty = d3.scaleLinear()
  // .domain([0, 16000])
  .domain([d3.min(data, d => d.poverty) *0.8, d3.max(data, d => d.poverty) +1.5])
  .range([ 0, width ]);
chartgroup.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xpoverty));

// Add Y axis
var yhealthcare = d3.scaleLinear()
  // .domain([0, 500000])
  // .domain([0, d3.max(data, function(d) { return d.healthcare; })])
  .domain([d3.min(data, d => d.healthcare) *0.8, d3.max(data, d => d.healthcare) +1.5])
  .range([ height, 0]);
chartgroup.append("g")
  .call(d3.axisLeft(yhealthcare));

// Add dots
// svg.append('g')
  
var circlesgroup=chartgroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d){return xpoverty(d.poverty);} )
    .attr("cy", function (d){return yhealthcare(d.healthcare);} )
    .attr("r", 15)
    .style("fill", "#69b3a2")
    .classed("circle", true)
// Adding state abb. to circles
    chartgroup.selectAll()
    .data(data)
    .enter()
    .append("text")
      .attr("x", function (d){return xpoverty(d.poverty);} )
      .attr("y", function (d){return yhealthcare(d.healthcare);} )
      .attr("r", 10)
      .style("fill", "black")
      .text(d=> d.abbr)
      .attr("font-size", "12px")
      .classed("circle", true)
// Creating x and y axis labels
// Create axes labels
chartgroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 10)
.attr("x", 0 - (height / 1.5))
.attr("dy", "1em") 
.attr("class", "axisText")
.text("Percent Healthcare");
//x label
chartgroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + 35})`)
.attr("class", "axisText")
.text("Percent Poverty");

// Add tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Create tooltip in the chart
    // ==============================
    circlesgroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesgroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseover event
      .on("mouseover", function(data, index) {
        toolTip.hide(data);
      });

}).catch(function(error) {
console.log(error);
});