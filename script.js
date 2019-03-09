// data input
x=[0,1,2,3,4,5,6,7,8,9,10]
xtitle="Data1"
y=[4,3,2,4,3,4,7,8,3,10,9]
ytitle="Data2"
atitlesize=0.05
labelsize=0.04
joinpoints=true
pointcolour="blue"
pointsize=3
// getting the chart
chart=document.getElementById("chart")
// height and width of chart
h=chart.height.animVal.value*0.8
w=chart.width.animVal.value*0.8
// max min and range of both data sets
xmax=Math.max.apply(null, x)
xmin=Math.min.apply(null, x)
xrange=xmax-xmin
ymax=Math.max.apply(null, y)
ymin=Math.min.apply(null, y)
yrange=ymax-ymin
// number of datapoints to plot
datapoints=Math.min(x.length,y.length)
// setting up arrays with the coordinates
xcoords=[]
ycoords=[]
// space for the x and y axis
xaxisspace=0.1
yaxisspace=0.1
// padding around the data points (unused axis) also fixing the start and end points of the axis manually
xmanualinput=false
ymanualinput=true
xstart=0
xend=100
ystart=0
yend=10
leftpp=0.0
rightpp=0.0
bottompp=0.0
toppp=0.0
if (xmanualinput){
	leftpp=(xmin-xstart)/xrange
	rightpp=(xend-xmax)/xrange
}
if (ymanualinput){
	bottompp=(ymin-ystart)/yrange
	toppp=(yend-ymax)/yrange
}
// gridlines
xlabels=5
ylabels=5 // defined here to align axis labels with labels
xlinesperlabel=2
ylinesperlabel=2
xgridsep=((1-yaxisspace)*w)/xlabels/xlinesperlabel
ygridsep=((1-xaxisspace)*h)/ylabels/ylinesperlabel
xlines=Math.floor((w-yaxisspace)/xgridsep)-Math.floor((w-yaxisspace)/xgridsep)%xlinesperlabel
ylines=Math.floor((h-xaxisspace)/ygridsep)-Math.floor((h-xaxisspace)/ygridsep)%ylinesperlabel
for (j=1;j<xlines+1;j++){
	chart.innerHTML+="<line x1=\""+(yaxisspace*w+j*xgridsep)+"\" y1=\""+((1-xaxisspace)*h+0.1*h)+"\" x2=\""+(yaxisspace*w+j*xgridsep)+"\" y2=\""+0.1*h+"\" stroke=\"grey\" stroke-width=\"1\" />"
}
for (j=1;j<ylines+1;j++){
	chart.innerHTML+="<line x1=\""+(yaxisspace*w)+"\" y1=\""+((1-xaxisspace)*h-j*ygridsep+0.1*h)+"\" x2=\""+w+"\" y2=\""+((1-xaxisspace)*h-j*ygridsep+0.1*h)+"\" stroke=\"grey\" stroke-width=\"1\" />"
}
// drawing the axis on
chart.innerHTML+="<line id=\"yaxis\" x1=\""+(yaxisspace*w)+"\" y1=\""+((1-xaxisspace)*h+0.1*h)+"\" x2=\""+(yaxisspace*w)+"\" y2=\""+0.1*h+"\" stroke=\"black\" stroke-width=\"5\" />"
chart.innerHTML+="<line id=\"xaxis\" x1=\""+(yaxisspace*w)+"\" y1=\""+((1-xaxisspace)*h+0.1*h)+"\" x2=\""+w+"\" y2=\""+((1-xaxisspace)*h+0.1*h)+"\" stroke=\"black\" stroke-width=\"5\" />"
chart.innerHTML+="<circle id=\"origin\" cx=\""+(yaxisspace*w)+"\" cy=\""+((1-xaxisspace)*h+0.1*h)+"\" r=2 fill=\"black\" />"
// conversion factor for x and y axis in data units per pixel
xAUp=(1-(leftpp+rightpp+yaxisspace))*w/xrange
yAUp=(1-(toppp+bottompp+xaxisspace))*h/yrange
// axis labels
// x labels
for (j=0;j<xlabels+1;j++){
	labelvalue=xmin-leftpp*xrange+j*(xrange+(leftpp+rightpp)*xrange)/xlabels
	labelvalue=Number( labelvalue.toPrecision(3) )
	labelspacing=((1-yaxisspace)*w)/xlabels
	chart.innerHTML+="<text style=\"font-size:"+Math.floor(labelsize*h)+"px\" x=\""+(yaxisspace*w+j*labelspacing-4)+"\" y=\""+((1-xaxisspace/2.5)*h+0.1*h)+"\">"+labelvalue+"</text>"
}
// y labels
for (j=0;j<ylabels+1;j++){
	labelvalue=ymin-bottompp*yrange+j*(yrange+(toppp+bottompp)*yrange)/ylabels
	labelvalue=Number( labelvalue.toPrecision(3) )
	labelspacing=((1-xaxisspace)*h)/ylabels
	chart.innerHTML+="<text style=\"font-size:"+Math.floor(labelsize*h)+"px\" x=\""+(yaxisspace*w/2.5)+"\" y=\""+((1-xaxisspace)*h-j*labelspacing+5+0.1*h)+"\">"+labelvalue+"</text>"
}
// axis titles
chart.innerHTML+="<text style=\"font-size:"+Math.floor(atitlesize*h)+"px\" x=\""+(w/2)+"\" y=\""+((1-xaxisspace/40)*h+0.1*h)+"\">"+xtitle+"</text>"
chart.innerHTML+="<text style=\"font-size:"+Math.floor(atitlesize*h)+"px\" x=\""+(yaxisspace*w/5)+"\" y=\""+(h/2+0.1*h+0.02*w)+"\" transform=\"rotate(270 "+yaxisspace*w/5+","+(h/2+0.1*h)+")\">"+ytitle+"</text>"
// calculating the coordinates and adding them to the relevant array
ystart=ymin-bottompp*yrange/(1-bottompp-toppp-xaxisspace)
xstart=xmin-leftpp*xrange/(1-leftpp-rightpp-yaxisspace)
for (i=0;i<datapoints;i++){
	ycoords.push(h-((xaxisspace)*h+yAUp*(y[i]-ystart))+0.1*h)
	xcoords.push((yaxisspace)*w+xAUp*(x[i]-xstart))
}
// drawing the data points
for (k=0;k<xcoords.length;k++){
	chart.innerHTML+="<circle class=\"datapoint\" cx="+xcoords[k] +" cy="+(ycoords[k]) +" r=\""+pointsize+"\" stroke=\""+pointcolour+"\" stroke-width=\"2\" fill=\"white\"/>"
	if (k>0 && joinpoints){
		x1=xcoords[k-1]
		y1=ycoords[k-1]
		y2=ycoords[k]
		x2=xcoords[k]
		theta=Math.atan((x2-x1)/(y2-y1))
		if (y2<y1){
			chart.innerHTML+="<line x1="+(x1-4*Math.sin(theta)) +" y1="+(y1-4*Math.cos(theta)) +" x2="+(x2+4*Math.sin(theta)) +" y2="+(y2+4*Math.cos(theta)) +" stroke=\""+pointcolour+"\" stroke-width=\"2\"/>"
		}
		else{
			chart.innerHTML+="<line x1="+(x1+4*Math.sin(theta)) +" y1="+(y1+4*Math.cos(theta)) +" x2="+(x2-4*Math.sin(theta)) +" y2="+(y2-4*Math.cos(theta)) +" stroke=\""+pointcolour+"\" stroke-width=\"2\"/>"
		}
	}
}