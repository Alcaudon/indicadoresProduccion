function charts(data,ChartType)
{
    var c=ChartType;
    var jsonData=data;
    google.load("visualization", "1", {packages:["corechart"], callback: drawVisualization});
    function drawVisualization()
    {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Tipo');
        data.addColumn('number', 'Cantidad');
        $.each(jsonData, function(i,jsonData)
        {
            var value=jsonData.value;
            var name=jsonData.name;
            data.addRows([ [name, value]]);
        });

        var options = {
            title : "Producción diaria de tapones",
        };

        var chart;
        if(c=="ColumnChart")
            chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        else if(c=="PieChart")
            chart = new google.visualization.PieChart(document.getElementById('piechart_div'));
        else if(c=="BarChart")
            chart = new google.visualization.BarChart(document.getElementById('bar_div'));

        chart.draw(data, options);
    }
}

$(document).ready(function ()
{
    url='produccion_diaria.json';
    ajax_data('GET',url, function(data)
    {
        charts(data,"ColumnChart");
        charts(data,"PieChart");
        charts(data,"BarChart");
    });
});
