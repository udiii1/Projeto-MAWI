function SmokeCloud(w,h, color, qtd){
    this.m = [1,0,0,1,0,0];
    this.smokeArray = []; 
    this.maxHeight = h; /*alcance da chuva no eixo Y*/
    this.maxWidth = w; /*alcance da chuva no eixo X*/
    //this.wind = 0; /*vento - altera o deslocamento (drift)*/
    
                
    /*Função de renderização, presente em todo Drawable - desenha todas as gotas e atualiza as posições */
    this.render = function(ctx){
        ctx.save();
        ctx.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5]);
                     
       
        ctx.shadowBlur    = 20;
        
        for(var i = 0; i < this.smokeArray.length; i++){
        
            var fogArray = this.smokeArray[i].fogArrray; 
            ctx.save()            ;
            ctx.transform(this.smokeArray[i].m[0],this.smokeArray[i].m[1],this.smokeArray[i].m[2],this.smokeArray[i].m[3],this.smokeArray[i].m[4],this.smokeArray[i].m[5]);
            ctx.shadowColor   = this.smokeArray[i].color;
            ctx.strokeStyle = this.smokeArray[i].color;//whitesmoke
            ctx.lineWidth = this.smokeArray[i].fogHeight;
    
            for (var j = 0; j < fogArray.length; j++) {
                //                if(fogArray[j].y <= this.maxHeight){
                ctx.globalAlpha = fogArray[j].y/this.maxHeight;
                ctx.beginPath();
                    
                //                    ctx.rect(150, 150, 50, 50);
                    
                ctx.moveTo(fogArray[j].x, fogArray[j].y);
                if(j%3==0)            
                    ctx.bezierCurveTo(fogArray[j].x + fogArray[j].drift, fogArray[j].y - this.smokeArray[i].fogHeight*0.5,
                        fogArray[j].x - fogArray[j].drift,  fogArray[j].y - this.smokeArray[i].fogHeight,
                        fogArray[j].x, fogArray[j].y - this.smokeArray[i].fogHeight*1.5);
                else             
                    ctx.bezierCurveTo(fogArray[j].x - fogArray[j].drift, fogArray[j].y - this.smokeArray[i].fogHeight*0.5,
                        fogArray[j].x + fogArray[j].drift,  fogArray[j].y - this.smokeArray[i].fogHeight,
                        fogArray[j].x, fogArray[j].y - this.smokeArray[i].fogHeight*1.5);

                ctx.stroke();
            
            //                }
            }
            this.update();
            ctx.restore();
        }
        
        ctx.restore();
       
    }
    
    
    
    /* Atualiza as posições das gotas - se passarem dos limites máximos definidos nos eixos X ou Y, são recicladas, colocadas na posição oposta*/
    this.update = function(){
        
        
        for(var f = 0; f < this.smokeArray.length; f++){
        
            
        var fogArrray = this.smokeArray[f].fogArrray;
        
        
            for (var i = 0; i < fogArrray.length; i++) {
                if (fogArrray[i].y > 0) {
                    
                   // alert('');
                    
                    fogArrray[i].y -= this.smokeArray[f].speed;
                
                    if(fogArrray[i].y <= this.maxHeight){
				
                        if(i%3==0)
                            fogArrray[i].x += (fogArrray[i].y  - this.maxHeight)*.003;
                        else if(i%2==0)
                            fogArrray[i].x -= (fogArrray[i].y - this.maxHeight)*.003;
                        fogArrray[i].drift += Math.random();
                    }
                
                    if (fogArrray[i].y <= 0){
                        fogArrray[i].y = this.maxHeight + this.smokeArray[f].fogHeight;
                        fogArrray[i].drift = Math.random()*this.smokeArray[f].maxWidth;
                        fogArrray[i].x = Math.round(Math.random() * this.smokeArray[f].maxWidth);
                    }
                }
            }
        }
    }
    
    
}
SmokeCloud.prototype = new Drawable();