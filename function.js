function markerstr(x,y,r,type,clas,colour){
	if (type=="circle"){
		return "<circle class="+clas+" cx="+x+" cy="+y+" r=\""+r+"\" stroke=\""+colour+"\" stroke-width=\"2\" fill=\"white\"/>"
	}
	if (type=="x"){
		return "<line class="+clas+" x1="+(x-r)+" y1="+(y-r)+" x2="+(x+r)+" y2="+(y+r)+" r=\""+r+"\" stroke=\""+colour+"\" stroke-width=\"1.5\" />"+"<line class="+clas+" x1="+(x+r)+" y1="+(y-r)+" x2="+(x-r)+" y2="+(y+r)+" r=\""+r+"\" stroke=\""+colour+"\" stroke-width=\"1.5\" />"
	}
}
function gridline(x1,x2,y1,y2){
	return "<line x1=\""+x1+"\" y1=\""+y1+"\" x2=\""+x2+"\" y2=\""+y2+"\" stroke=\"grey\" stroke-width=\"1\" />"
}
function label(size,x,y,text){
	return "<text style=\"font-size:"+size+"px\" x=\""+x+"\" y=\""+y+"\">"+text+"</text>"
}
function drawkey(x,y,series,titles,colours,marker,fontsize="20px"){
	output="<text x="+x+" y="+y+" style=\"font-size:"+fontsize+"\">Key</text>"
	if (titles==0){
		for (i=0;i<series;i++){
			colour=colours[i%colours.length]
			output+=markerstr(x*1.03/1.05,0.2*h+i/20*h,5,marker,"key",colour)
			output+="<text x="+x+" y="+((0.2+i/20)*h+5)+" style=\"font-size:"+fontsize+"\">"+"y"+i+"</text>"
		}
	}
	else{
		for (i=0;i<series;i++){
			colour=colours[i%colours.length]
			output+=markerstr(x*1.03/1.05,0.2*h+i/20*h,5,marker,"key",colour)
			output+="<text x="+x+" y="+((0.2+i/20)*h+5)+" style=\"font-size:"+fontsize+"\">"+titles[i]+"</text>"
		}
	}
	return output
}
function plot(svgid,x,ys,xtitle="",ytitle="",height,width,joinpoints=false,pointcolours=["red"],plottype="circle",shade=false,xlabels=5,ylabels=5,xlinesperlabel=2,ylinesperlabel=2,yseriestitles=0,xmanualinput=false,ymanualinput=false,xstart=0,xend=10,ystart=0,yend=10,atitlesize=0.05,labelsize=0.04,pointsizes=[4]){
	chart=document.getElementById(svgid)
	chart.innerHTML=""
	chart.setAttribute("height", height)
	chart.setAttribute("width", width)
	// height and width of chart
	h=chart.height.animVal.value*0.8
	w=chart.width.animVal.value*0.8
	// max min and range of both data sets
	xmax=Math.max.apply(null, x)
	xmin=Math.min.apply(null, x)
	xrange=xmax-xmin
	ysmin=0
	ysmax=0
	for (m=0;m<ys.length;m++){
		y=ys[m]
		ymax=Math.max.apply(null, y)
		ymin=Math.min.apply(null, y)
		if (m>0){
			if (ymin<ysmin){
				ysmin=ymin
			}
		}
		else{
			ysmin=ymin
		}
		if (m>0){
			if (ymax>ysmax){
				ysmax=ymax
			}
		}
		else{
			ysmax=ymax
		}
	}
	ysrange=ysmax-ysmin
	// space for the x and y axis
	xaxisspace=0.1
	yaxisspace=0.1
	// padding around the data points (unused axis) also fixing the start and end points of the axis manually
	/*
	xmanualinput=false
	ymanualinput=false
	xstart=0
	xend=10
	ystart=0
	yend=10
	*/
	leftpp=0.0
	rightpp=0.0
	bottompp=0.0
	toppp=0.0
	if (xmanualinput){
		leftpp=(xmin-xstart)/xrange
		rightpp=(xend-xmax)/xrange
	}
	if (ymanualinput){
		bottompp=(ysmin-ystart)/ysrange
		toppp=(yend-ysmax)/ysrange
	}
	// gridlines
	xgridsep=((1-yaxisspace)*w)/xlabels/xlinesperlabel
	ygridsep=((1-xaxisspace)*h)/ylabels/ylinesperlabel
	xlines=xlabels*xlinesperlabel
	ylines=ylabels*ylinesperlabel
	for (j=1;j<xlines+1;j++){
		chart.innerHTML+=gridline(yaxisspace*w+j*xgridsep,yaxisspace*w+j*xgridsep,(1-xaxisspace)*h+0.1*h,0.1*h)
	}
	for (j=1;j<ylines+1;j++){
		chart.innerHTML+=gridline(yaxisspace*w,w,(1-xaxisspace)*h-j*ygridsep+0.1*h,(1-xaxisspace)*h-j*ygridsep+0.1*h)
	}
	// drawing the axis on
	chart.innerHTML+="<line id=\"yaxis\" x1=\""+(yaxisspace*w)+"\" y1=\""+((1-xaxisspace)*h+0.1*h)+"\" x2=\""+(yaxisspace*w)+"\" y2=\""+(0.1*h-1)+"\" stroke=\"black\" stroke-width=\"5\" />"
	chart.innerHTML+="<line id=\"xaxis\" x1=\""+(yaxisspace*w)+"\" y1=\""+((1-xaxisspace)*h+0.1*h)+"\" x2=\""+(w+1)+"\" y2=\""+((1-xaxisspace)*h+0.1*h)+"\" stroke=\"black\" stroke-width=\"5\" />"
	chart.innerHTML+="<circle id=\"origin\" cx=\""+(yaxisspace*w)+"\" cy=\""+((1-xaxisspace)*h+0.1*h)+"\" r=2 fill=\"black\" />"
	// conversion factor for x and y axis in data units per pixel
	xAUp=(1-yaxisspace)*w/(xrange*(1+leftpp+rightpp))
	yAUp=(1-xaxisspace)*h/(ysrange*(1+bottompp+toppp))
	// axis labels
	// x labels
	for (b=0;b<xlabels+1;b++){
		labelvalue=xmin-leftpp*xrange+b*(xrange+(leftpp+rightpp)*xrange)/xlabels
		labelvalue=Number( labelvalue.toPrecision(3) )
		labelspacing=((1-yaxisspace)*w)/xlabels
		chart.innerHTML+=label(Math.floor(labelsize*h),(yaxisspace*w+b*labelspacing-4),((1-xaxisspace/2.5)*h+0.1*h),labelvalue)
	}
	// y labels
	for (j=0;j<ylabels+1;j++){
		labelvalue=ysmin-bottompp*ysrange+j*(ysrange+(toppp+bottompp)*ysrange)/ylabels
		labelvalue=Number( labelvalue.toPrecision(3) )
		labelspacing=((1-xaxisspace)*h)/ylabels
		chart.innerHTML+=label(Math.floor(labelsize*h),(yaxisspace*w/2.5),((1-xaxisspace)*h-j*labelspacing+5+0.1*h),labelvalue)
	}
	// axis titles
	chart.innerHTML+="<text style=\"font-size:"+Math.floor(atitlesize*h)+"px\" x=\""+(w/2)+"\" y=\""+((1-xaxisspace/40)*h+0.1*h)+"\">"+xtitle+"</text>"
	chart.innerHTML+="<text style=\"font-size:"+Math.floor(atitlesize*h)+"px\" x=\""+(yaxisspace*w/5)+"\" y=\""+(h/2+0.1*h+0.02*w)+"\" transform=\"rotate(270 "+yaxisspace*w/5+","+(h/2+0.1*h)+")\">"+ytitle+"</text>"
	for (m=0;m<ys.length;m++){
		polygonpoints=""
		polygonpoints+=xaxisspace*h+","+((1-yaxisspace)*w+0.1*h)+" "
		y=ys[m]
		pointsize=pointsizes[m%pointsizes.length]
		pointcolour=pointcolours[m%pointcolours.length]
		// setting up arrays with the coordinates
		xcoords=[]
		ycoords=[]
		// number of datapoints to plot
		datapoints=Math.min(x.length,y.length)
		// calculating the coordinates and adding them to the relevant array
		ystart=ysmin-bottompp*ysrange/(1-bottompp-toppp-xaxisspace)
		xstart=xmin-leftpp*xrange
		for (i=0;i<datapoints;i++){
			ycoords.push(h-((xaxisspace)*h+yAUp*(y[i]-ystart))+0.1*h)
			xcoords.push((yaxisspace)*w+xAUp*(x[i]-xstart))
		}
		// drawing the data points
		for (k=0;k<xcoords.length;k++){
			//chart.innerHTML+="<circle class=\"datapoint\" cx="+xcoords[k] +" cy="+(ycoords[k]) +" r=\""+pointsize+"\" stroke=\""+pointcolour+"\" stroke-width=\"2\" fill=\"white\"/>"
			chart.innerHTML+=markerstr(xcoords[k],ycoords[k],pointsize,plottype,"datapoint",pointcolour)
			polygonpoints+=xcoords[k]+","+ycoords[k]+" "
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
		polygonpoints+=w+","+((1-xaxisspace)*h+0.1*h)+" "
		if (shade==true){
			chart.innerHTML="<polygon points=\""+polygonpoints+"\" style=\"fill:LightGrey\"/>"+chart.innerHTML
		}
	}
	if (ys.length>1){
		chart.innerHTML+=drawkey(1.05*w,0.15*h,ys.length,yseriestitles,pointcolours,plottype,atitlesize*h)
	}
}
function datarow(){
	ysets=document.getElementById("ysets").value
	head=document.getElementById("dataheader")
	head.innerHTML="<td></td><td>x</td>"
	colours=document.getElementById("colours")
	colours.innerHTML='<td>colours</td><td></td>'
	table=document.getElementById("datatable")
	xvalue=document.getElementsByName("x")[0].value
	table.innerHTML="<td>Data</td><td><textarea id=\"xdata\" name=\"x\" style=\"width: 40px\" rows=\"100\"></textarea></td>"
	for (i=0;i<ysets;i++){
		table.innerHTML+="<td><textarea id=\"ydata"+i+"\" name=\"y"+i+"\" style=\"width: 40px\" rows=\"100\"></textarea></td>"
		colours.innerHTML+='<td><select id=ycolour'+i+'><option value="red">Red</option><option value="yellow">Yellow</option><option value="black">Black</option><option value="green">Green</option><option value="blue">Blue</option></select></td>'
		head.innerHTML+="<td><input id=\"y"+i+"\" value=\"y"+i+"\" type=\"text\"></td>"
	}
	document.getElementsByName("x")[0].value=xvalue
	movetable()
}
function movetable(){
	document.getElementById("dataentry").style.left=(400+document.getElementById("chart").width.animVal.value+"px")
	document.getElementById("dataentry").style.bottom=(400+document.getElementById("chart").height.animVal.value)+"px"
}
function toarray(x){
    values=x.split('\n')
    for (i=0;i<values.length;i++){
    	values[i]=parseFloat(values[i])
    }
    return values
}
function yarrays(){
	ysets=document.getElementById("ysets").value
	a=[]
	for (n=0;n<ysets;n++){
		a.push(toarray(document.getElementById("ydata"+n).value))
	}
	return a
}
function xarray(){
	return toarray(document.getElementById("xdata").value)
}
function getcolours(){
	ysets=document.getElementById("ysets").value
	a=[]
	for (n=0;n<ysets;n++){
		a.push(document.getElementById("ycolour"+n).value)
	}
	return a
}
function gettitles(){
	ysets=document.getElementById("ysets").value
	a=[]
	for (n=0;n<ysets;n++){
		a.push(document.getElementById("y"+n).value)
	}
	return a
}
function gettype(){
	if (document.getElementsByName("markershape")[0].checked==false){
		return "circle"
	}
	else{
		return "x"
	}
}
plot("chart",[0,1,2,3,4,5],[[0,1,2,3,4,5],[2,3,4,3,2,2],[1,5,1,5,1,5]],"","",1000,1000,joinpoints=true,["red","blue","green"],"circle",)