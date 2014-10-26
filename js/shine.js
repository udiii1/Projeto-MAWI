

/**
 * Representa uma bolha da explosão
 * @posx = posição x do centro da bolha
 * @posy = posição y do centro da bolha
 * @radius = raio máximo que esta bolha pode atingir
 * @cor = cor da estrela em questão
 * @perimeter = perímetro máximo dentro do qual a posição x,y da estrela pode estar
 */
function Star(posx, posy, radius, cor, perimeter){


    Star.perimeter = perimeter;
	this.color = cor; /* cor */
	this.originalPos = [posx,posy];
    this.pos = [posx + Math.random()*perimeter - perimeter*0.5,
                posy + Math.random()*perimeter - perimeter*0.5]; /* centro x y*/

    this.radius = radius; /* raio máximo */
    this.currentRadius = 0.01; /* raio inicial */
                
    /**
    * Método principal responsável pela renderização
    */
    this.render = function(ctx, speed){ 
	
		this.renderStar(ctx);
        this.updateRadius(speed);
    }
	
    /**
     * Desenha as 4 particluas em volta do centro
     */
    this.renderStar = function(ctx){
		ctx.strokeStyle= this.color;
        ctx.beginPath();
		ctx.moveTo(this.pos[0],this.pos[1] - this.currentRadius/2);
		ctx.lineTo(this.pos[0], this.pos[1] + this.currentRadius/2);
        ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.pos[0]- this.currentRadius/2,this.pos[1] );
		ctx.lineTo(this.pos[0]+ this.currentRadius/2, this.pos[1]);
        ctx.closePath();
		ctx.stroke();
    }
    
    /**
     * Atualiza raio
     */
    this.updateRadius = function(speed){
        this.currentRadius += Math.random() * speed;
        if( this.currentRadius >= this.radius ){
            this.currentRadius  = 0.01;
		    /* muda posição da estrela, que reaparecerá em outro lugar*/
			this.pos = [this.originalPos[0] + Math.random()*Star.perimeter - Star.perimeter*0.5,
                this.originalPos[1] + Math.random()*Star.perimeter - Star.perimeter*0.5]; /* centro*/
			
        }
    }
}

/**
 * Objeto que armazena as várias estrelas
 * @posx = posição x do centro do conjunto de estrelas
 * @posy = posição x do centro do conjunto de estrelas
 * @perimeter = perímetro máximo dentro do qual a posição x,y de cada estrela pode estar
 * @maxRadius = raio máximo das estrelas
 * @qtd = quantidade de estrelas
 * @speed = velocidade do tempo de vida de cada estrela (brilho)
 */
function Shine(posx, posy, perimeter, maxRadius, qtd, speed){

    this.perimeter = perimeter;   
    this.maxRadius = maxRadius;
    this.speed = speed;
	this.lineWidth = 0.4;
	this.colors = ['#FFFFCC','#99FFFF']; /*cores default*/
    
    /*
	* Gera as qtd de estrelas e atualiza propriedades
	* @qtd = quantidade de estrelas a serem criadas
	*/
    this.generate = function(qtd){
        this.radius = [ 
        (Math.random()* this.maxRadius),
        (Math.random()* this.maxRadius),
        (Math.random()* this.maxRadius),
        (Math.random()* this.maxRadius),
        (Math.random()* this.maxRadius)];
        this.items = [];

        for(var i=0; i<qtd; i++)
        {
			if(i%2==0){
				this.items.push(new Star(
				posx,
				posy,
				this.radius[Math.round(Math.random()* (this.radius.length-1) )], this.colors[0],
				this.perimeter));
			}
			else{
				this.items.push(new Star(
				posx,
				posy,
				this.radius[Math.round(Math.random()* (this.radius.length-1) )], this.colors[1],
				this.perimeter));
			}
        }
    }

    /* Gera estrelas*/
    this.generate(qtd);

    /* Função de renderização, chama a renderização de cada uma das bolhas */
    this.render = function(ctx)
    {
        ctx.save();
        ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
        ctx.lineWidth = this.lineWidth;
        for(var i=0; i<this.items.length; i++){
            this.items[i].render(ctx, this.speed);
        }
        ctx.restore();
    }
}
Shine.prototype = new Drawable();