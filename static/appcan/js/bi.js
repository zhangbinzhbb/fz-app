var appPlatf=appcan.locStorage.val("appPlatf");
//highcharts标题
var titleFontSize = appPlatf=="1" ? "4em" : "2em";

//X轴坐标字体
var xAxisFontSize = appPlatf=="1" ? "2em" : "1em";

//Y轴坐标字体
var yAxisFontSize = appPlatf=="1" ? "2em" : "1em";

//Y轴标题字体
var yTitleFontSize = appPlatf=="1" ? "2em" : "1em";

//柱顶总计数据
var stackLabelSize = appPlatf=="1" ? "2em" : "1em";

//柱图内部数据
var dataLabelSize = appPlatf=="1" ? "2em" : "1em";

//图例字体
var legendFontSize = appPlatf=="1" ? "2em" : "1em";

//柱体的宽度，数字越小越宽
var groupWidth = 0.1;

//tooltip框内的字体
var toolTipFontSize = appPlatf=="1" ? "2em" : "1em";

//highchart图表高度
var  HEIGHT = appPlatf=="1" ? 700 : 350;

//折线图折线宽度
var lineWidth = appPlatf=="1" ? "10" : "5";