function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(metadata => {
    // Use d3 to select the panel with id of `#sample-metadata`
    parent_tag = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    parent_tag.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach((k,v) =>{
      parent_tag.append('p')
                .text(`${k}:${v}`)
                .style('font-size','11px')
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    let trace = {
      type : 'pie',
      showlegend : false,
      hole : 0.4,
      rotation : 90,
      values : [10,10,10,10,10,10,10,10,10,10,100],
      text : ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9-10',""],
      direction : 'clockwise',
      textinfo : 'text',
      textposition : 'inside',
      marker : {colors:['lightgray','darkgray','gray','lightgreen','greenyellow','lawngreen','limegreen','forestgreen','green','darkgreen',"white"]},
      hoverinfo: 'skip'
    }

    let degrees = (metadata.WFREQ/10)*180, radius = 0.2;
    let radians = degrees * Math.PI / 180;
    let x = -1 * radius * Math.cos(radians);
    let y = radius * Math.sin(radians);
    console.log(`FREQ:${metadata.WFREQ}`)
    console.log(`x:${x}`)
    console.log(`y:${y}`)
    console.log(`degrees:${degrees}`)
    console.log(`radians:${radians}`)
    var layout = {
      shapes:[{
          type: 'line',
          x0: 0.5,
          y0: 0.5,
          x1: 0.5 + x,
          y1: 0.5 + y,
          line: {
            color: 'black',
            width: 3
          }
        }],
      title: 'Belly Button Washing Frequency',
      xaxis: {visible: true, range: [-1, 1]},
      yaxis: {visible: true, range: [-1, 1]}
    };

    data = [trace]
    gauge_chart = document.getElementById('gauge');
    Plotly.newPlot(gauge_chart,data,layout)

  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(sample => {
    // @TODO: Build a Bubble Chart using the sample data
    let trace = {
      'x' : sample.otu_ids,
      'y' : sample.sample_values,
      mode : 'markers',
      marker : {
        'size' : sample.sample_values,
        'color' : sample.otu_ids.map(v => {return `rgb(${(v/15)%255},150,200)`})
      },
      type : 'scatter'
    }
    bubble_graph = document.getElementById('bubble');
    let data = [trace];
    Plotly.newPlot(bubble_graph,data)
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    let trace2 = {
      'labels' : sample.otu_ids.slice(0,10),
      'values' : sample.sample_values.slice(0,10),
      type : 'pie'
    };
    let layout2 = {
      'showlegend' : true
    }
    pie_chart = document.getElementById('pie');
    let data2 = [trace2];
    Plotly.newPlot(pie_chart,data2,layout2)
  })
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
