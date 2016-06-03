//https://github.com/iros/patternfills

/*&TODO
1 Number optimisation
2 Pie numbers
3
%*/
var barHeight=30;
var patterns= ['url(#crosshatch1) #fff', 'url(#crosshatch2) #fff','url(#crosshatch3) #fff','url(#crosshatch4) #fff','url(#crosshatch5) #fff','url(#dots-4) #fff','url(#circles-2) #fff','url(#circles-3) #fff','url(#circles-4) #fff','url(#circles-5) #fff'];
var graph_number=0;
$(document).ready(function(){
  $.get(path, function(d){
    //  $('body').append('<h1> Recommended Web Development Books </h1>');
    //  $('body').append('<dl />');
    processXML(d);
  });
});

function processXML(d){
  $("#bulletin-container").children().remove();
  $("#bulletin-container").append("<div class='main-title'>Visualizing</br>the Crisis</div><div class='main-report'>REPORT N.23</div><div class='main-subtitle'>TRACKING THE UNFOLDING<br/>GLOBAL FINANCIAL CRISIS</div>"+
  "<div class='main-info'>This information was gathered between February and June 2016 during the MA Information Design lab at IUAV, Venice. Below are the most relevant results relating to <span style='display:inline;font-family: SF-UI-Heavy, Helvetica;'>​Oceania, Agriculture​, ​Sharing Economy.</span>​</div>");

  var sections=$(d).find('section');
  for (var s = 0; s < sections.length; ++s) {
    var $section_div=$("<div class='section'></div>");
    $("#bulletin-container").append($section_div);
    var $section= $(sections[s]);
    var elements=$section.children();
    for (var i = 0; i < elements.length; ++i) {
      var $element= $(elements[i]);
      if($element.is('title'))$section_div.append("<span class='section-title'>"+$section.find('title').first().text()+"</span>");
      if($element.is('subtitle'))$section_div.append("<span class='section-subtitle'>"+$section.find('subtitle').first().text()+"</span>");
      if($element.is('quote')){
        $section_div.append("<div class='section-quote'><span class='quote-text'>"+$section.find('text').first().text()+"</span>"+"<span class='quote-author'> - "+$section.find('author').first().text()+"</span></div>");
      }
      if($element.is('graph'))graphToHTML($element,$section_div);
      if($element.is('chapter'))chapterToHTML($element,$section_div);
      if($element.is('table'))tableToHTML($element,$section_div);
      //  if($element.is('keywords'))keywordsToHTML($element,$section_div);
      //  if($element.is('sources'))sourcesToHTML($element,$section_div);
    }
  }
}
function tableToHTML($element, $parent){
  var html="<p><table>";
  var rows=$element.find('row');
  for (var r = 0; r < rows.length; ++r) {
    html+="<tr>"
    var isHead=($(rows[r]).attr('type')=='head');
    var $row=$(rows[r]);
    var cells=$row.find('cell');
    for (var c = 0; c < cells.length; ++c) {
      if(isHead)html+="<th>";
      else html+="<td>";
      html+=$(cells[c]).text();
      if(isHead)html+="</th>";
      else html+="</td>";
    }
    html+="</tr>"
  }
  html+="</table></p>";
  $parent.append(html);
}

function chapterToHTML($element, $parent){
  var paragraphs=$element.find('paragraph');
  var html="<div class='section-chapter'>";
  console.log(paragraphs);
  for (var i = 0; i < paragraphs.length; ++i) {
    var lists=$(paragraphs[i]).contents();
    console.log(lists);

    for (var l = 0; l < lists.length; ++l) {
      var $element= $(lists[l]);
      console.log($element);
      if(lists[l].nodeType==3)html+="<p>"+$element.text()+"</p>";
      if($element.is('title'))html+="<span class='chapter-title'>" + $element.html() +'</span>';
      if($element.is('list')){
        var isOrdered=$element.attr('type')=='ordered';
        if(isOrdered)
        html+="<ol type='1'>";
        else
        html+="<ul style='list-style-type:square'>"
        var lis= $($element.find('item'));
        for (var li = 0; li < lis.length; ++li) {
          html+="<li>"+$(lis[li]).text()+"</li>";
        }
        if(isOrdered)
        html+="</ol>";
        else
        html+="</ul>";
      }
    }
  }
  html+="</div>";
  $parent.append(html);
}

function keywordsToHTML($element, $parent){
  var keywords=$element.find('keyword');
  var html="<div class='section-keywords'>";
  for (var i = 0; i < keywords.length; ++i) {
    html+="#"+$(keywords[i]).attr('name')+" ";
  }
  html+="</div>";
  $parent.append(html);
}

function sourcesToHTML($element, $parent){
  var sources=$element.find('source');
  var html="<div class='section-sources'>";
  for (var i = 0; i < sources.length; ++i) {
    html+="<span class='source'>"+$(sources[i]).text()+" </span>";
  }
  html+="</div>";
  $parent.append(html);
}

function graphToHTML($element, $parent){
  var titles=$element.find('title');
  if(titles.length>0)$parent.append("<span class='section-graph-title'>"+$element.find('title').first().text()+"</span>");
  var subtitles=$element.find('subtitle');
  if(subtitles.length>0)$parent.append("<span class='section-graph-subtitle'>"+$element.find('subtitle').first().text()+"</span>");
  var abstracts=$element.find('abstract');
  if(abstracts.length>0)$parent.append("<span class='section-graph-abstract'>"+$element.find('abstract').first().text()+"</span>");
  var datasets=$element.find('dataset');
  var xData=[],yData=[];
  var legends="<div class='graph-legends'>";
  for (var i = 0; i < datasets.length; ++i) {
    var $dataset=$(datasets[i]);
    var arrayX=['x'];
    var arrayY=[$dataset.attr('label')];
    var datas=$dataset.find('data');
    for (var j = 0; j < datas.length; ++j) {
      $data=$(datas[j]);
      arrayX.push($data.attr('x'));
      arrayY.push(parseFloat($data.attr('y').replace(",", "")));
    }
    xData.push(arrayX);
    yData.push(arrayY);
    if($dataset.attr('label') && $dataset.attr('label').length>0)
    legends+="<div class='graph-legend'> <svg width='40' height='20' xmlns='http://www.w3.org/2000/svg' version='1.1'><rect fill='"+patterns[i]+"' stroke='black' x='0' y='0' width='40' height='20'/></svg>"
    +$dataset.attr('label')+"</div>";
  }

  if ($element.attr('y')=='number') {
    if ($element.attr('x')=='date') {
      dateToNumberGraph($element, $parent, xData, yData);
    }
    else{
      stringToNumberGraph($element, $parent, xData, yData);

      /*      if($element.attr('x')=='continent' || $element.attr('x')=='subcontinent' || $element.attr('x')=='country')
      locationToNumberGraph($element, $parent, xData, yData);
      else
      stringToNumberGraph($element, $parent, xData, yData);
      */
    }
  }
  else if ($element.attr('y')=='percentage') {
    stringToPercentageGraph($element, $parent, xData, yData);
  }
  else if ($element.attr('y')=='string') {
    stringToStringGraph($element, $parent, xData, yData);
  }
  legends+="</div>";
  $('#graph'+graph_number).append(legends);
}

function dateToNumberGraph($element, $parent, xData, yData){
  if(xData.length>0 && xData.length>0){
    var equal=xArrayCheck(xData);
    var settings=getDefaultGraphSettings();
    var dateFormat=getDateFormat(xData[0][1]);
    graph_number++;
    $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
    settings.bindto='#graph'+graph_number;
    settings.axis.y.tick.format=d3.format(".3s");
    settings.data.xFormat=dateFormat[0];
    settings.axis.x.tick.format= dateFormat[1];
    settings.axis.x.type= 'timeseries';

    //settings.axis.x.tick.width=100;

    //settings.axis.y.tick.width=100;
    //settings.axis.x.tick.width=180;
    //settings.axis.x.tick.count=3;
    //settings.padding.bottom=50;
    //settings.size.height=xData[0].length*100;

    //settings.axis.y.tick.rotate=90;
    //settings.axis.rotated= true;
    ////70+xData.length*xData[0].length*30;

    //settings.padding.bottom=50;
    //  settings.axis.y.tick.rotate=90;
    //  settings.axis.rotated= true;
    if(xData.length>1 && equal){
      yData.unshift(xData[0]);
      settings.data.columns=yData;
      settings.data.type='bar';
      settings.axis.y.tick.count=6;
      if(xData.length*xData[0].length>8){
        settings.axis.rotated= true;
        settings.axis.x.tick.width=200;
        settings.size.height=xData.length*xData[0].length*barHeight;
      }else{
        settings.axis.x.tick.culling={'max':4};
      }
      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        settings.bindto='#graph'+graph_number;

        settings.data.columns=[xData[i],yData[i]];
        settings.data.type='line';
        settings.axis.x.tick.count=3;
        settings.size.width=512;
        var chart = c3.generate(settings);
      }
    }
  }
}



function locationToNumberGraph($element, $parent, xData, yData){
  if(xData.length>0 && xData.length>0){
    var dateFormat=getDateFormat(xData[0][1]);
    var equal=xArrayCheck(xData);
    if(xData.length>1 && equal){
      graph_number++;
      $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
      yData.unshift(xData[0]);
      var settings=getDefaultGraphSettings();
      settings.bindto='#graph'+graph_number;
      settings.data.columns=yData;
      settings.axis.x.type= 'category';
      settings.data.type='bar';
      //settings.axis.rotated= true;

      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        var settings=getDefaultGraphSettings();
        settings.bindto='#graph'+graph_number;
        settings.data.columns=[xData[i],yData[i]];
        settings.data.type='bar';
        settings.axis.x.type= 'category';
        //  settings.axis.x.tick.culling={'max':4};

        //  settings.axis.rotated= true;
        var chart = c3.generate(settings);
      }
    }
  }
}
function stringToNumberGraph($element, $parent, xData, yData, format){
  var settings=getDefaultGraphSettings();
  if(xData.length>0 && xData.length>0){
    var equal=xArrayCheck(xData);
    if(xData.length>1 && equal){
      graph_number++;
      $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
      /*yData.unshift(xData[0]);

      settings.bindto='#graph'+graph_number;
      settings.data.columns=yData;
      settings.axis.x.type= 'category';
      settings.data.type='bar';
      //  settings.axis.rotated= true;
      settings.size.height=yData.length*barHeight;
      settings.data.width=150;
      settings.axis.y.tick.rotate=90;
      settings.axis.x.tick.rotate=90;
      settings.axis.y.tick.count=5;
      var chart = c3.generate(settings);

      */
      settings.bindto='#graph'+graph_number;

      yData.unshift(xData[0]);
      settings.data.columns=yData;
      settings.data.type='bar';
      settings.axis.x.type= 'category';
      if(format)
        settings.axis.y.tick.format=d3.format(".3s "+format);
      else
        settings.axis.y.tick.format=d3.format(".3s");
      settings.axis.y.tick.count=6;
      //  settings.axis.x.tick.width=200;

      settings.axis.x.tick.width=180;
      settings.size.height=xData.length*xData[0].length*barHeight;

      if(xData.length*xData[0].length>8){
        settings.axis.rotated= true;

      }else{
        settings.axis.x.tick.culling={'max':4};
      }
      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        var settings=getDefaultGraphSettings();
        settings.bindto='#graph'+graph_number;
        settings.data.columns=[xData[i],yData[i]];
        settings.data.type='bar';
        settings.axis.x.type= 'category';
        settings.axis.y.tick.format=d3.format(".3s");
        settings.axis.y.tick.count=5;
        //  settings.axis.x.tick.culling={'max':4};

        //  settings.axis.y.tick.rotate=90;
        //settings.axis.x.tick.rotate=90;
        settings.axis.x.tick.width=180;
        settings.size.height=xData[i].length*50;

        settings.axis.rotated= true;
        var chart = c3.generate(settings);
      }
    }
  }
}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

function stringToPercentageGraph($element, $parent, xData, yData){
  for(var i=0;i<xData.length;i++){
    graph_number++;

    $parent.append("<div class='section-treemap' id='my-treemap"+graph_number+"' style=''></div>");
    var data=[];
    for(var j=1;j<xData[i].length;j++){
      data.push({  data:'a'+j,label:yData[i][j]+"% "+xData[i][j],value:yData[i][j],fill:patterns[j%patterns.length]});
    }
    var t=$("div#my-treemap"+graph_number).treemap(data, {
      nodeClass: function(node, box){
        if(node.value <= 50){
          return 'minor';
        }
        return 'major';
      },
      itemMargin: 2
    });
    if (!t.isValid) {

      $("#my-treemap"+graph_number).remove();//css('opacity',0.1);

      return stringToNumberGraph($element, $parent, xData, yData, '%');
      //$parent.append("<div>WRONG</div>");
    }
  }
  return;

  /*
    var h=512;

  for(var i=0;i<xData.length;i++){
    graph_number++;
    var html="<div class='section-treemap' id='graph"+graph_number+"' style='height:"+(h+20)+"px; width:512px'>"+
    "<svg style='height:"+(h+20)+"px; width:512px ;font-size:18px;'   xmlns='http://www.w3.org/2000/svg' version='1.1'>";
    var hh=h/100.0;
    var top=0;
    var others=0;
    var count=0;
    for(var j=1;j<xData[i].length;j++){
      if(yData[i][j]<5)
      others+=yData[i][j];
      else{
        count++;
        var text=yData[i][j]+"% "+xData[i][j];
        var tw=getTextWidth(text,'18pt MaisonNeue');
        var rh=Math.round(hh*yData[i][j]);
        html+=  "<rect fill='"+patterns[count%patterns.length]+"' stroke='black' stroke-width='4' x='4' y='"+top+"'  width='508' height='"+rh+"'/>";
        //    html+=  "<rect fill='#ffffff'  stroke-width='0' x='10' y='"+(top+2)+"'  width='"+tw+"' height='22'/>";
        html+=  "<foreignObject x='10' y="+(top+15)+" width='512'><span style='z-index:100;background-color:white;display:inline-block;top:0px;' font-size='12x' fill='red'>"+text+"</span></foreignObject>";
        top+=rh;
      }
    }
    if(others>0){
      count++;
      var text=others+"% Others";
      var tw=getTextWidth(text,'18pt MaisonNeue')+2;
      var rh=Math.round(hh*others);
      html+=  "<rect fill='"+patterns[count%patterns.length]+"' stroke='black' stroke-width='4' x='4' y='"+top+"'  width='508' height='"+rh+"'/>";
      if(others>0){
        //  html+=  "<rect fill='#ffffff'  stroke-width='0' x='10' y='"+(top+2)+"'  width='"+tw+"' height='22'/>";
        html+=  "<foreignObject x='10' y="+(top+15)+" width='512'><p style='z-index:100;background-color:white;display:inline-block;top:0px;' font-size='12x' fill='red'>"+text+"</p></foreignObject>";
      }
    }
    html+="</svg></div>";
  }
  console.log(html);
  $parent.append(html);
  return;


  for(var i=0;i<xData.length;i++){
  graph_number++;
  $parent.append("<div class='section-treemap' id='graph"+graph_number+"'></div>");
  var sample_data = [];

  for(var j=0;j<xData[i].length;j++){
  sample_data.push({'value':yData[i][j],'name':xData[i][j]});
}
var color_index=0;
var visualization = d3plus.viz()
.container('#graph'+graph_number)
.data(sample_data)
.data({'stroke': {'focus':'#000000','primary':'#000000', "width": 2 }})
.axes( {'stroke':{'color':'#000000', 'width':1}})
.edges({'color':'#000000'})
.height({'max':2000})
.labels({'resize':false,'padding':15,'segments':1})
.type("tree_map")
.type({'mode':'dice'})//"squarify", "slice", "dice", "slice-dice"
.coords({'fit':'height'})
.id("name")
.font({ "family": 'MaisonNeue','size':18 })
.color({'focus':'#100000','primary':'#010000', 'secondary':'#001000','missing':patterns[0],'value':patterns[i] })
.color(function(d){
console.log(d);
color_index=(color_index+1)%patterns.length;
return patterns[color_index];
})
.size("value")
.mouse({
"move": false,                        // key will also take custom function
"click": function(){alert("Click!")}
})
.draw();









for(var i=0;i<xData.length;i++){
  graph_number++;
  $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
  //var data = [60000, 60000, 40000, 30000, 20000, 10000];
  //var labels = ["Paris", "London", "New York", "Moscow", "Berlin", "Tokyo"];

  yData[i].shift();
  xData[i].shift();
  var boxFormatter = function (coordinates, index) {
    return{ "fill" : patterns[0] };
  };



  Treemap.draw('graph'+graph_number, 420, 500, yData[i],xData[i], {'label' : {'fill' : 'black'},
  'box'   : boxFormatter});
  console.log("YYY");

  console.log(yData[i]);
  console.log("XXX");
  console.log(xData[i]);

}


return;
for(var i=0;i<xData.length;i++){
  graph_number++;
  $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
  var settings=getDefaultGraphSettings();
  settings.bindto='#graph'+graph_number;
  var data=[];
  for(var j=1;j<xData[i].length;j++){
    data.push([xData[i][j],yData[i][j]]);
  }
  settings.axis.y.tick.format=d3.format(".3s");
  settings.data.columns=data;
  settings.data.type='pie';
  //settings.size.width= 320;
  //
  //settings.padding.bottom=0;
  $('#graph'+graph_number).css('width','452px');
  $('#graph'+graph_number).css('text-align','center');
  settings.size.height= 400;
  settings.size.width= 452;
  //  $('#graph'+graph_number).css('zoom','0.7');
  //$('#graph'+graph_number).css('margin-left','70px');
  //settings.axis.x.type= 'category';
  //  settings.size.width= 352;
  delete settings.axis;
  delete settings.data.x;
  console.log(settings);
  //  settings.axis.x.tick.culling={'max':4};
  var chart = c3.generate(settings);
  //  c3.updateRadius();
  //$('#graph'+graph_number).find('svg').first().attr('width','452');

}

*/
}
function stringToStringGraph($element, $parent, xData, yData){}

function getDefaultGraphSettings(){
  var settings={
    //bindto: '#graph'+graph_number,
    size: {height: 365},
    padding: {  top: 10,bottom:10 ,right:50},
    color: {pattern:patterns},
    data: {
      x: 'x',
      type: 'area',//bar line spline step area area-spline area-step bar scatter pie donut gauge
      //  xFormat: '%Y' // 'xFormat' can be used as custom format of 'x'
      //  labels: true,
      //  columns: cols,

    },
    legend: {
      show:false,
      position: 'bottom'//inset
      /*,
      inset: {
      anchor: 'bottom-left',
      x: 0,
      y: -40
    }*/
  },
  bar: {

    zerobased: false,
    width: {
      ratio: 0.7 // this makes bar width 50% of length between ticks
    }
  },
  grid: {
    x: {
      //  show: true
    },
    y: {
      show: true
    }
  },
  axis: {
    //  rotated: true,
    x: {
      //     type: 'timeseries',//timeseries category indexed
      tick: {
        //      format: '%Y-%m-%d:%H:%M:%S',//  format: function(d) { return "EUR " + d3.format(",s.2f")(d); } ,
        width:150,
        //  height:100,
        //  fit: true
        //      outer: false,
        //      culling: {
        //        max: 5
        //      }
      }/*,
      padding: {
      left: 0,
      right: 0,
    }
    */
  },
  y: {
    tick: {
      //  width:60,
      //  height:100,
      //  fit: true
      //    fit: true
      //  format: '%Y',
      //  rotate: 90,
      //    outer: false,
      //    format: d3.format(".2f")
      //,count:6
    }/*,
    padding: {
    left: 0,
    right: 0,
  }*/
}
}
};
return settings;
}

function xArrayCheck(xData){
  var xEqual=true;
  for(var x=0;x<xData.length-1;x++){
    if(xData[x].length==xData[x+1].length){
      for(var i=0;i<xData[x].length;i++)
      if(xData[x][i]!=xData[x+1][i])
      xEqual=false;
    }
    else{
      xEqual=false;
      break;
    }
  }
  return xEqual;
}

function getDateFormat(s){
  var format=['%Y','%Y'];
  console.log(s+" "+s.length);
  if (s.length>4) {
    if (s.length<7) {
      return ['%Y%m','%Y/%m'];
    }
    if (s.length<9) {
      return ['%Y%m%d','%Y/%m/%d'];
    }
    if (s.length==15) {
      console.log('%Y/%m/%d %H:%M:%S');
      return ['%Y%m%d:%H%M%S','%Y/%m/%d %H:%M:%S'];
    }
  }
  return format;
}
