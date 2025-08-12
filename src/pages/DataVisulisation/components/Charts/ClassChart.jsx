import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ClassChart = ({ 
  classData, 
  projectNames, 
  chartType = 'bar',
  width = 600, 
  height = 400 
}) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!classData || classData.length === 0 || !projectNames || projectNames.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for the specific class
    const data = classData.projects.map(project => ({
      name: project.name,
      values: projectNames.map(projectName => ({
        project: projectName,
        value: project.value[projectName] || 0
      }))
    }));

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(projectNames)
      .range(d3.schemeCategory10);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(d.values, v => v.value))])
      .range([chartHeight, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(yAxis);

    // Chart title
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(classData.name);

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");

    if (chartType === 'bar') {
      // Create stacked bar chart
      const stack = d3.stack()
        .keys(projectNames)
        .value((d, key) => {
          const project = d.values.find(v => v.project === key);
          return project ? project.value : 0;
        });

      const series = stack(data);

      g.selectAll(".series")
        .data(series)
        .enter().append("g")
        .attr("class", "series")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => xScale(d.data.name))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", function(event, d) {
          d3.select(this).style("opacity", 0.7);
          const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "5px")
            .style("border-radius", "3px")
            .style("pointer-events", "none");
          
          tooltip.html(`${d.data.name}<br/>${d.key}: ${d[1] - d[0]}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).style("opacity", 1);
          d3.selectAll(".tooltip").remove();
        });

    } else if (chartType === 'line') {
      // Create line chart
      const line = d3.line()
        .x(d => xScale(d.name) + xScale.bandwidth() / 2)
        .y(d => yScale(d.value));

      projectNames.forEach(projectName => {
        const lineData = data.map(d => ({
          name: d.name,
          value: d.values.find(v => v.project === projectName)?.value || 0
        }));

        g.append("path")
          .datum(lineData)
          .attr("fill", "none")
          .attr("stroke", color(projectName))
          .attr("stroke-width", 2)
          .attr("d", line);

        // Add dots
        g.selectAll(`.dot-${projectName}`)
          .data(lineData)
          .enter().append("circle")
          .attr("class", `dot-${projectName}`)
          .attr("cx", d => xScale(d.name) + xScale.bandwidth() / 2)
          .attr("cy", d => yScale(d.value))
          .attr("r", 4)
          .attr("fill", color(projectName));
      });

    } else if (chartType === 'radar') {
      // Create radar chart
      const angleStep = (2 * Math.PI) / data.length;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 40;

      // Create radar grid
      const levels = 5;
      for (let i = 1; i <= levels; i++) {
        const levelRadius = (radius * i) / levels;
        g.append("circle")
          .attr("cx", chartWidth / 2)
          .attr("cy", chartHeight / 2)
          .attr("r", levelRadius)
          .attr("fill", "none")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1);
      }

      // Create axis lines
      data.forEach((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = chartWidth / 2 + Math.cos(angle) * radius;
        const y = chartHeight / 2 + Math.sin(angle) * radius;
        
        g.append("line")
          .attr("x1", chartWidth / 2)
          .attr("y1", chartHeight / 2)
          .attr("x2", x)
          .attr("y2", y)
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1);

        // Add labels
        g.append("text")
          .attr("x", x + Math.cos(angle) * 20)
          .attr("y", y + Math.sin(angle) * 20)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "12px")
          .text(d.name);
      });

      // Create radar lines for each project
      projectNames.forEach(projectName => {
        const radarData = data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = d.values.find(v => v.project === projectName)?.value || 0;
          const normalizedValue = value / d3.max(data, d => d3.max(d.values, v => v.value));
          const r = normalizedValue * radius;
          
          return {
            angle: angle,
            radius: r,
            x: chartWidth / 2 + Math.cos(angle) * r,
            y: chartHeight / 2 + Math.sin(angle) * r,
            value: value
          };
        });

        // Create radar line
        const radarLine = d3.line()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveLinearClosed);

        g.append("path")
          .datum(radarData)
          .attr("fill", color(projectName))
          .attr("fill-opacity", 0.2)
          .attr("stroke", color(projectName))
          .attr("stroke-width", 2)
          .attr("d", radarLine);

        // Add dots
        g.selectAll(`.radar-dot-${projectName}`)
          .data(radarData)
          .enter().append("circle")
          .attr("class", `radar-dot-${projectName}`)
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 3)
          .attr("fill", color(projectName));
      });
    }

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 20)`);

    projectNames.forEach((projectName, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(projectName));

      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text(projectName);
    });

  }, [classData, projectNames, chartType, width, height]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
        {classData?.name || 'Chart'}
      </h3>
      <div className="flex justify-center">
        <svg 
          ref={svgRef} 
          width={width} 
          height={height}
          className="class-chart"
        />
      </div>
    </div>
  );
};

export default ClassChart;
