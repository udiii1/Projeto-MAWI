var Phys =
{
    gravity: 0.5, /* gravidade default...*/
    staticObjects: new Array(),

    dot: function(v1,v2){
        return v1[0]*v2[0] + v1[1]*v2[1];
    },
        
    normalize : function (v){
        if(v[0]==0 && v[1]==0) return [0,0];
        var vn = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
        v[0] = v[0]/vn;
        v[1] = v[1]/vn;
        return v;
    },
    
    addForceLimit : function(body, newvel, direction, limite){
        /*	var escalaX = Phys.dot(direction,[1,0]);
			var escalaY = Math.sin(Math.acos(Phys.dot(direction,[1,0])));
			body.velx = body.velx + newvel * escalaX;
			body.vely = body.vely + newvel * escalaY;
			if( Math.abs(body.velx) > limite ) 
				body.velx -= newvel * escalaX;
			if( Math.abs(body.vely) > limite ) 
				body.vely -= newvel * escalaY;*/
        if( Math.abs(body.velx) < limite ) 	{
            var escalaX = Phys.dot(direction,[1,0]);
            body.velx = body.velx + newvel * escalaX;
        }
        if( Math.abs(body.vely) < limite ) {
            var escalaY = Math.sin(Math.acos(Phys.dot(direction,[1,0])));
            body.vely = body.vely + newvel * escalaY;
        }
    },
    
    addForce : function(body, newvel, direction){
        this.addForceLimit(body, newvel, direction, 10000);
    },
    
    run : function(obj, body){
        
        var dx = body.velx;//
        var dy = body.vely;   
        //var px = 100 + piso1.m[4];//obj.m[4];
        var px = body.bb.minx;
        var py = body.bb.miny;

        var ix = false;
        var iy = false;
        var touchingX = false;
        var touchingY = false;

        for(var i=0; i< SceneGraph.root.children[1].children.length; i++){
        
        
        
            //if(i==3) continue;
        
            //var block = Phys.staticObjects[i].body;
            var block = SceneGraph.root.children[1].children[i].obj.body;
        
        
            //   if(!block) continue;
        
            var interx = block.bb.interx(obj.body.bb.minx + dx, 
                obj.body.bb.minx +     obj.body.bb.width     + dx);
                
            var intery = block.bb.intery(obj.body.bb.miny + dy+Phys.gravity,
                obj.body.bb.miny +    obj.body.bb.height     + dy + Phys.gravity);
        
            var janoChao = block.bb.intery(obj.body.bb.miny,
                obj.body.bb.miny +     obj.body.bb.height);
        
		
            if(!iy && ( intery && interx )  /*&&    (!intery2 || (intery2&&!interx2) )*/        )
            {
                iy = true;
                touchingY = true;
            }
        
            if(!ix && (interx && janoChao )   /*&&   (!interx2 || (!interF2&&interx2) )*/           )
            {
                ix = true;
                touchingX = true;
            }
            if(ix&&iy) {
                break;
            }
            else {
                ix = iy = false;
            }
        }


        if(!touchingY){  
            obj.m[5] += dy;
            
            obj.body.bb.miny += dy;
            obj.body.bb.maxy += dy;
            // piso1.m[5] += dy;
            // piso2.m[5] += dy;
            
            body.colliding = false;
            body.vely += Phys.gravity;//n�o � necessario addforce, calculo j� constante
        }
        else{
            body.colliding = true;
            body.vely =0;
            if(Math.abs(body.velx) < 0.2)
                body.velx=0.0;
            else if(body.velx >0)
                body.velx = body.velx - body.friction;
            else
                body.velx = body.velx + body.friction;
        }
        
        if(!touchingX){
            // obj.m[4] += dx;
            SceneGraph.root.children[1].obj.m[4] -= dx;
            for(i=0; i <SceneGraph.root.children[1].children.length; i++){
                var bb = SceneGraph.root.children[1].children[i].obj.body.bb;
                bb.minx -= dx;
                bb.maxx -= dx;
            }
        }
        else{
            body.velx = 0;
        }

        //body.direction = Phys.normalize([ obj.m[4]-px, obj.m[5]-py]);
        body.direction = Phys.normalize([ dx, obj.m[5]-py]);
		
    }
};


function CPhysBody(){
    this.velx= 0;  
    this.vely= 0; //this.acelx= 0.0;//this.acely= 0.0;
    this.direction = [0,0];
    this.colliding = false;
    this.friction = 0.0;
    //this.bounce = 0.0;
    this.bb = null;
}