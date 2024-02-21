import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmapContainer', { static: true }) private heatmapContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.createHeatmap();
  }

  private createHeatmap(): void {
    // Set the dimensions of the SVG
    const width = 600;
    const height = 500;

    // Define the data and colors
    const data = [
      ['high', 'moderate', 'low', 'high', 'critical'],
      ['medium', 'high', 'moderate', 'low', 'high'],
      ['moderate', 'medium', 'high', 'moderate', 'low'],
      ['low', 'moderate', 'medium', 'high', 'moderate'],
    ];

    const colors = {
      'low': 'rgba(102, 187, 102, 1)',
      'moderate': 'rgba(255, 236, 143, 1)',
      'medium': 'rgba(208, 220, 122, 1)',
      'high': 'rgba(242, 126, 58, 1)',
      'critical': 'rgba(229, 53, 53, 1)',
    };

    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(Object.keys(colors))
      .range(Object.values(colors));

    // Create SVG element
    const svg = d3.select(this.heatmapContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Define x-axis labels and positions
    const xLabels = ['Low', 'Moderate', 'Medium', 'High', 'Critical'];

    // Append x-axis labels
    svg.selectAll('.xLabel')
      .data(xLabels)
      .enter().append('text')
      .attr('class', 'xLabel')
      .text((d) => d)
      .attr('x', (d, i) => i * 100 + 140) // Position x-axis labels
      .attr('y', height - 40) // Position y-axis labels
      .style('text-anchor', 'middle'); // Set text-anchor to middle

    // Define y-axis labels and positions
    const yLabels = ['Rare', 'Possible', 'Likely', 'Certain'];

    // Append y-axis labels
    svg.selectAll('.yLabel')
      .data(yLabels)
      .enter().append('text')
      .attr('class', 'yLabel')
      .text((d) => d)
      .attr('x', 25) // Position x-axis labels
      .attr('y', (d, i) => i * 100 + 50) // Position y-axis labels
      .style('text-anchor', 'middle'); // Set text-anchor to middle

    // Create groups for heatmap cells
    const heatmap = svg.selectAll()
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(90, ${i * 100})`); // Translate each group

    // Append rectangles for heatmap cells
    heatmap.selectAll()
      .data((d, i) => d.map(value => ({ value, rowIndex: i })))
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 100) // Position x-axis
      .attr('y', 0) // Position y-axis
      .attr('width', 100) // Set width of rectangle
      .attr('height', 100) // Set height of rectangle
      .style('fill', d => colorScale(d.value)); // Apply color based on data value

    // Append text inside each rectangle
    heatmap.selectAll('.text')
      .data((d, i) => d.map(value => ({ value, rowIndex: i })))
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 100 + 50) // Position x-axis
      .attr('y', 50) // Position y-axis
      .attr('text-anchor', 'middle') // Set text-anchor to middle
      .text(d => {
        // Display only the number inside each square
        return d.value === 'high' ? '04' : d.value === 'moderate' ? '02' : d.value === 'medium' ? '03' : d.value === 'low' ? '01' : d.value === 'critical' ? '05' : ''; // Define mapping from text values to numbers
      }); // Set text value
  }
}
