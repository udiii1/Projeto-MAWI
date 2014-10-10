function Fish(x,y, escala, cor1, cor2, speed){
	this.m = [escala,0,0,escala,x,y];
	this.dir  = 1;
	this.tick = 0;
	this.color1 = cor1;
	this.color2 = cor2;
	this.speed = speed;
	
	this.render = function(ctx){
		ctx.save();
		
		ctx.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4]-this.tick, this.m[5]);
		//ctx.rotate(2*this.tick*Math.PI/180);
		 var grd = ctx.createLinearGradient(0,0, 60, 50);
		
		grd.addColorStop(0, this.color1);   
		grd.addColorStop(1, this.color2);
		ctx.fillStyle = grd;
		
		
		
		//rabo
		//ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.moveTo(10,30);
		ctx.lineTo(0,20);
		ctx.lineTo(4,30);
		ctx.lineTo(0,40);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		//dorsal
		ctx.beginPath();
		ctx.moveTo(20,20);
		ctx.lineTo(20,15);
		ctx.lineTo(30,20);
		ctx.lineTo(20,25);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		
		
		
		//corpo
		//ctx.fillStyle = "orange";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(10,30);
		ctx.bezierCurveTo(10,30,20,20,30,20);
		ctx.bezierCurveTo(30,20,60,30,30,40);
		ctx.bezierCurveTo(30,40,20,40,10,30);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		
		//lateral
		ctx.beginPath();
		ctx.moveTo(23,30);
		ctx.lineTo(30,30);
		ctx.lineTo(20,40+this.tick);
		ctx.lineTo(23,30);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		
		
		
		
		
		
		
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(35, 26 , 3, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(36, 26 , 1.5, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
		
		
		ctx.restore();
	
	this.tick += this.speed*this.dir;
	if(Math.abs(this.tick) >2){
		this.dir = this.dir*-1;
	}
	
	
    };
	
	//this.width = 50;
	//this.height = 50;
}
Fish.prototype = new Drawable(); /* desenhável */
