function markerstr(x,y,r,type,clas,colour){
	if (type=="circle"){
		return "<circle class="+clas+" cx="+x+" cy="+y+" r=\""+r+"\" stroke=\""+colour+"\" stroke-width=\"2\" fill=\""+colour+"\"/>"
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
	ysmax=Math.max.apply(null, ys[0])
	ysmin=Math.min.apply(null, ys[0])
	ysrange=ysmax-ysmin
	y1max=Math.max.apply(null, ys[1])
	y1min=Math.min.apply(null, ys[1])
	y1range=y1max-y1min
	// space for the x and y axis
	xaxisspace=0.1
	yaxisspace=0.1
	// padding around the data points (unused axis) also fixing the start and end points of the axis manually
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
	polygonpoints=""
	pointcolours=[["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900"],["#fe4365","#fc9d9a","#f9cdad","#c8c8a9","#83af9b"],["#ecd078","#d95b43","#c02942","#542437","#53777a"],["#556270","#4ecdc4","#c7f464","#ff6b6b","#c44d58"],["#774f38","#e08e79","#f1d4af","#ece5ce","#c5e0dc"],["#e8ddcb","#cdb380","#036564","#033649","#031634"],["#490a3d","#bd1550","#e97f02","#f8ca00","#8a9b0f"],["#594f4f","#547980","#45ada8","#9de0ad","#e5fcc2"],["#00a0b0","#6a4a3c","#cc333f","#eb6841","#edc951"],["#e94e77","#d68189","#c6a49a","#c6e5d9","#f4ead5"],["#3fb8af","#7fc7af","#dad8a7","#ff9e9d","#ff3d7f"],["#d9ceb2","#948c75","#d5ded9","#7a6a53","#99b2b7"],["#ffffff","#cbe86b","#f2e9e1","#1c140d","#cbe86b"],["#efffcd","#dce9be","#555152","#2e2633","#99173c"],["#343838","#005f6b","#008c9e","#00b4cc","#00dffc"],["#413e4a","#73626e","#b38184","#f0b49e","#f7e4be"],["#ff4e50","#fc913a","#f9d423","#ede574","#e1f5c4"],["#99b898","#fecea8","#ff847c","#e84a5f","#2a363b"],["#655643","#80bca3","#f6f7bd","#e6ac27","#bf4d28"],["#00a8c6","#40c0cb","#f9f2e7","#aee239","#8fbe00"],["#351330","#424254","#64908a","#e8caa4","#cc2a41"],["#554236","#f77825","#d3ce3d","#f1efa5","#60b99a"],["#ff9900","#424242","#e9e9e9","#bcbcbc","#3299bb"],["#5d4157","#838689","#a8caba","#cad7b2","#ebe3aa"],["#8c2318","#5e8c6a","#88a65e","#bfb35a","#f2c45a"],["#fad089","#ff9c5b","#f5634a","#ed303c","#3b8183"],["#ff4242","#f4fad2","#d4ee5e","#e1edb9","#f0f2eb"],["#d1e751","#ffffff","#000000","#4dbce9","#26ade4"],["#f8b195","#f67280","#c06c84","#6c5b7b","#355c7d"],["#1b676b","#519548","#88c425","#bef202","#eafde6"],["#bcbdac","#cfbe27","#f27435","#f02475","#3b2d38"],["#5e412f","#fcebb6","#78c0a8","#f07818","#f0a830"],["#452632","#91204d","#e4844a","#e8bf56","#e2f7ce"],["#eee6ab","#c5bc8e","#696758","#45484b","#36393b"],["#f0d8a8","#3d1c00","#86b8b1","#f2d694","#fa2a00"],["#f04155","#ff823a","#f2f26f","#fff7bd","#95cfb7"],["#2a044a","#0b2e59","#0d6759","#7ab317","#a0c55f"],["#bbbb88","#ccc68d","#eedd99","#eec290","#eeaa88"],["#b9d7d9","#668284","#2a2829","#493736","#7b3b3b"],["#b3cc57","#ecf081","#ffbe40","#ef746f","#ab3e5b"],["#a3a948","#edb92e","#f85931","#ce1836","#009989"],["#67917a","#170409","#b8af03","#ccbf82","#e33258"],["#e8d5b7","#0e2430","#fc3a51","#f5b349","#e8d5b9"],["#aab3ab","#c4cbb7","#ebefc9","#eee0b7","#e8caaf"],["#300030","#480048","#601848","#c04848","#f07241"],["#ab526b","#bca297","#c5ceae","#f0e2a4","#f4ebc3"],["#607848","#789048","#c0d860","#f0f0d8","#604848"],["#a8e6ce","#dcedc2","#ffd3b5","#ffaaa6","#ff8c94"],["#3e4147","#fffedf","#dfba69","#5a2e2e","#2a2c31"],["#b6d8c0","#c8d9bf","#dadabd","#ecdbbc","#fedcba"],["#fc354c","#29221f","#13747d","#0abfbc","#fcf7c5"],["#1c2130","#028f76","#b3e099","#ffeaad","#d14334"],["#edebe6","#d6e1c7","#94c7b6","#403b33","#d3643b"],["#cc0c39","#e6781e","#c8cf02","#f8fcc1","#1693a7"],["#dad6ca","#1bb0ce","#4f8699","#6a5e72","#563444"],["#a7c5bd","#e5ddcb","#eb7b59","#cf4647","#524656"],["#fdf1cc","#c6d6b8","#987f69","#e3ad40","#fcd036"],["#5c323e","#a82743","#e15e32","#c0d23e","#e5f04c"],["#230f2b","#f21d41","#ebebbc","#bce3c5","#82b3ae"],["#b9d3b0","#81bda4","#b28774","#f88f79","#f6aa93"],["#3a111c","#574951","#83988e","#bcdea5","#e6f9bc"],["#5e3929","#cd8c52","#b7d1a3","#dee8be","#fcf7d3"],["#1c0113","#6b0103","#a30006","#c21a01","#f03c02"],["#382f32","#ffeaf2","#fcd9e5","#fbc5d8","#f1396d"],["#e3dfba","#c8d6bf","#93ccc6","#6cbdb5","#1a1f1e"],["#000000","#9f111b","#b11623","#292c37","#cccccc"],["#c1b398","#605951","#fbeec2","#61a6ab","#accec0"],["#8dccad","#988864","#fea6a2","#f9d6ac","#ffe9af"],["#f6f6f6","#e8e8e8","#333333","#990100","#b90504"],["#1b325f","#9cc4e4","#e9f2f9","#3a89c9","#f26c4f"],["#5e9fa3","#dcd1b4","#fab87f","#f87e7b","#b05574"],["#951f2b","#f5f4d7","#e0dfb1","#a5a36c","#535233"],["#413d3d","#040004","#c8ff00","#fa023c","#4b000f"],["#eff3cd","#b2d5ba","#61ada0","#248f8d","#605063"],["#2d2d29","#215a6d","#3ca2a2","#92c7a3","#dfece6"],["#cfffdd","#b4dec1","#5c5863","#a85163","#ff1f4c"],["#4e395d","#827085","#8ebe94","#ccfc8e","#dc5b3e"],["#9dc9ac","#fffec7","#f56218","#ff9d2e","#919167"],["#a1dbb2","#fee5ad","#faca66","#f7a541","#f45d4c"],["#ffefd3","#fffee4","#d0ecea","#9fd6d2","#8b7a5e"],["#a8a7a7","#cc527a","#e8175d","#474747","#363636"],["#ffedbf","#f7803c","#f54828","#2e0d23","#f8e4c1"],["#f8edd1","#d88a8a","#474843","#9d9d93","#c5cfc6"],["#f38a8a","#55443d","#a0cab5","#cde9ca","#f1edd0"],["#4e4d4a","#353432","#94ba65","#2790b0","#2b4e72"],["#0ca5b0","#4e3f30","#fefeeb","#f8f4e4","#a5b3aa"],["#a70267","#f10c49","#fb6b41","#f6d86b","#339194"],["#9d7e79","#ccac95","#9a947c","#748b83","#5b756c"],["#edf6ee","#d1c089","#b3204d","#412e28","#151101"],["#046d8b","#309292","#2fb8ac","#93a42a","#ecbe13"],["#4d3b3b","#de6262","#ffb88c","#ffd0b3","#f5e0d3"],["#fffbb7","#a6f6af","#66b6ab","#5b7c8d","#4f2958"],["#ff003c","#ff8a00","#fabe28","#88c100","#00c176"],["#fcfef5","#e9ffe1","#cdcfb7","#d6e6c3","#fafbe3"],["#9cddc8","#bfd8ad","#ddd9ab","#f7af63","#633d2e"],["#30261c","#403831","#36544f","#1f5f61","#0b8185"],["#d1313d","#e5625c","#f9bf76","#8eb2c5","#615375"],["#ffe181","#eee9e5","#fad3b2","#ffba7f","#ff9c97"],["#aaff00","#ffaa00","#ff00aa","#aa00ff","#00aaff"],["#c2412d","#d1aa34","#a7a844","#a46583","#5a1e4a"]]
	y=ys[0]
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
		pointcolour=pointcolours[Math.floor(Math.random()*100)][k%5]
		//chart.innerHTML+="<circle class=\"datapoint\" cx="+xcoords[k] +" cy="+(ycoords[k]) +" r=\""+pointsize+"\" stroke=\""+pointcolour+"\" stroke-width=\"2\" fill=\"white\"/>"
		chart.innerHTML+=markerstr(xcoords[k],ycoords[k],(ys[1][k]-y1min)*50/(y1range)+20,plottype,"datapoint",pointcolour)
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
	if (ys.length>1){
		//chart.innerHTML+=drawkey(1.05*w,0.15*h,ys.length,yseriestitles,pointcolours,plottype,atitlesize*h)
	}
}
plot("chart",[0,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5,2,3,Math.random()*5,5],[[Math.random()*5,0,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5,5,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5],[Math.random()*5,0,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5,Math.random()*5,5,Math.random()*5]],"","",1000,1000,false,["red","blue","green"],"circle",)