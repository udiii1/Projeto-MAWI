/**
* Bounding Box
*/
function CBB(minx,maxx,miny,maxy){
    this.name = "BB";
	this.maxx= maxx;
    this.maxy= maxy;
    this.miny= miny;
    this.minx= minx;
    this.width = maxx-minx;
    this.height = maxy-miny;
	
    this.interx = function(minx, maxx){
        if( minx > this.maxx ||
            this.minx > maxx ||
            maxx <   this.minx ||
            this.maxx < minx)
            {
            return false;
        }
        return true;
    }
    
    this.inflate = function(){
        this.maxx= this.minx + this.width;
        this.maxy= this.miny + this.height;
    }
    
    this.intery = function(miny,maxy){
        if( miny >   this.maxy ||
            this.miny > maxy ||
            maxy <   this.miny ||
            this.maxy < miny)
            {
            return false;
        }
        return true;
    }
    
    this.intersect = function(minx,maxx, miny,maxy){
        return this.intery(miny,maxy) || this.interx(minx,maxx);
    }
};

function CSB(centerx,centery, radius){
	this.name = "BS";
	this.centerx = centerx;
	this.centery = centery;
	this.radius = radius;
	
	this.intersect = function(obj){
            
		if(obj.name == "BS"){
			var distanceX = obj.centerx - this.centerx;
			var distanceY = obj.centery - this.centery;

			var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
	
			if( magnitude < (this.radius + obj.radius) ){
				return true;
            }
			return false;
        }
		else if( obj.name == "BB" ){
                //calcula o diametro do quadrado                
                var diametro = Math.sqrt(Math.pow(obj.width,2) + Math.pow(obj.height,2));
                //pega distancia entre o diametro e o raio;
                var distancia = Math.sqrt(Math.pow((obj.minx + obj.width) - (this.centerx-this.radius),2) 
				+ Math.pow((obj.miny + obj.height) - (this.centery - this.radius),2));
                
                //detecta se vai haver colisão
                if ( ( (this.centerx+this.radius) >= obj.minx && (this.centerx-this.radius) <= (obj.minx + obj.width) )
                    &&
					 ( (this.centery + this.radius)>= obj.miny && (this.centery - this.radius) <= (obj.miny + obj.height) )
                    && 
					 (distancia <= (diametro+this.radius))
				){                    
                    //window.clearInterval(intervalo);
                    //alert("colidiu!!");                    
                }
		}
	}
		
		
		
		
		
};

//minx,maxx,miny,maxy
//var bfloor = new CBB(0,170,130,150);      
//var bfloor2 = new CBB(220, 300, 130,150);


//var bfloor2 = new CBB(50, 100, 100,120);
