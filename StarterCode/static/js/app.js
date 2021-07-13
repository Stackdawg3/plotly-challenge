// using d3 library to read samples.json
d3.json('samples.json').then(function(data) {
    console.log(data);
});

// creating dropdown menu
function dropdown_menu() {
    var dropDown = d3.select('#selDataset');
    d3.json('samples.json').then((samples_data) => {
        var names = samples_data.names;
        names.forEach((data) => {
            dropDown.append('option').text(data).property('value', data);
        });
        var otu_id_no = names[0];
        otu_data(otu_id_no);
        plots(otu_id_no);
    });
};

dropdown_menu()

//
function otu_data(otu_id){
    d3.json("samples.json").then((samples_data)=>{
        var metaData = samples_data.metadata;
        var filtered_data = metaData.filter(row=>row.id==otu_id);
        console.log(filtered_data);
        var data = filtered_data[0];
        var demo_info = d3.select("#sample-metadata");
        demo_info.html("");
        Object.entries(data).forEach(([key,value])=>{
            demo_info.append("h6").text(`${key} ${value}`);
        });
    });
};

// creating charts
function plots(otu_id){
    d3.json("samples.json").then((samples_data)=>{
        var samples = samples_data.samples;
        var filtered_data = samples.filter(row=>row.id==otu_id);
        console.log(filtered_data);
        var data = filtered_data[0];
        var otu_ids = data.otu_ids;
        var sample_values = data.sample_values;
        var otu_labels = data.otu_labels;

        // bar chart
        var bar_chart = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otu_ids=>`OTU${otu_ids}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        Plotly.newPlot("bar", bar_chart);

        // bubble chart
        var bubble_chart = [{
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids},
            text: otu_labels 
        }];
        Plotly.newPlot("bubble", bubble_chart);
       
    });
};

// Have metadata and plots appear when an ID is clicked
function optionChanged(new_data){
    otu_data(new_data);
    plots(new_data);
};