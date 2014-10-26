

/**
 * Representa uma bolha da explosão
 * @posx = posição x do centro da bolha
 * @posy = posição y do centro da bolha
 * @radius = raio máximo que esta bolha pode atingir
 */
function Bubble(posx, posy, radius){
    Bubble.colors = ['#FFFF00','#FFFA03','#FFF505','#FFF008','#FFEB0A','#FFE60D','#FFE00F','#FFDB12','#FFD614','#FFD117','#FFCC1A','#FFC71C','#FFC21F','#FFBD21','#FFB824','#FFB226','#FFAD29','#FFA82B','#FFA32E','#FF9E30','#FF9933'
    ,'#CC2900','#B22400','#991F00','#801A00','#661400']; /* variação de cores da explosao */
    this.pos = [posx,posy]; /* centro da bolha*/
    this.radius = radius; /* raio máximo */
    this.step = radius/Bubble.colors.length; /* de quanto em quanto o raio tem que crescer pra alcançar o máximo variando entre todas as cores */
    this.currentColor = 0; /* índice da cor atual */
    this.nextColor = this.step; /* quanto é necessário para chegar na próxima cor */
    Bubble.endAngle = Math.PI*2; /* ângulo final dos arcos (completo) */ 
    this.currentRadius = 0.1; /* raio inicial da bolha */
    this.alphaFactor = 1/Bubble.colors.length; /* quanto diminuir de opacidade para partir da cor 1 opaca até a cor n transparente*/
                
    /**
    * Método principal responsável pela renderização
    */
    this.render = function(ctx, speed){ 
        this.renderMainBubble(ctx);
        this.renderParticles(ctx);
        this.updateRadiusAndColor(speed);
    }
	
    /**
    * Desenha a bolha central
    */
    this.renderMainBubble = function(ctx){
        ctx.fillStyle = Bubble.colors[this.currentColor]; //seleciona cor
        ctx.globalAlpha = (Bubble.colors.length - this.currentColor)*this.alphaFactor + 0.3; //seleciona nível de opacidade
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.currentRadius, 0, Bubble.endAngle, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
        
    /**
     * Desenha as 4 particluas em volta da bolha principal
     */
    this.renderParticles = function(ctx){
        var particle = this.currentRadius*1.5;
        ctx.beginPath();
        ctx.arc(this.pos[0]+particle,this.pos[1]+particle,0.5,0,Bubble.endAngle, false);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.pos[0]-particle,this.pos[1]-particle,0.5,0,Bubble.endAngle, false);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.pos[0]+particle,this.pos[1]-particle,0.5,0,Bubble.endAngle, false);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.pos[0]-particle,this.pos[1]+particle,0.5,0,Bubble.endAngle, false);
        ctx.fill();
        ctx.closePath();
    }
    
    /**
     * Atualiza raio da bolha principal e verifica qual cor deve ser a próxima
     */
    this.updateRadiusAndColor = function(speed){
        this.currentRadius += Math.random() * speed;
        if( this.currentRadius > this.radius ){
            this.currentRadius  = 0.1;
            this.currentColor = 0;
            this.nextColor = this.step;
        }
                        
        if (this.currentRadius > this.nextColor){
            this.nextColor += this.step;
            this.currentColor++;
        }
    }
}

/**
 * Objeto que armazena as várias bolhas da explosão
 * @posx = posição x do centro do conjunto de bolhas
 * @posy = posição x do centro do conjunto de bolhas
 * @perimeter = Até onde as bolhas podem ir (quadrado)
 * @maxRadius = raio máximo das bolhas
 * @qtdBubbles = quantidade de bolhas
 * @speed = velocidade da explosão
 */
function Explosion(posx,posy, perimeter, maxRadius, qtdBubbles, speed){
    this.perimeter = perimeter;   
    this.maxRadius = maxRadius;
    this.speed = speed;
    /*cria 5 raios aleatórios respeitando o limite máximo*/
    this.radius = [ 
    (Math.random()* this.maxRadius),
    (Math.random()* this.maxRadius),
    (Math.random()* this.maxRadius),
    (Math.random()* this.maxRadius),
    (Math.random()* this.maxRadius)];
    this.items = new Array(); /* bolhas */

    /*
 * Gera as qtd bolhas
 * @qtd = quantidade de bolhas a serem criadas
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
            this.items.push(new Bubble(posx+Math.random()*this.perimeter - this.perimeter/2,
                posy+Math.random()*this.perimeter - this.perimeter/2,
                this.radius[Math.round(Math.random()* (this.radius.length-1) )]));
        }
    }

    /* Gera bolhas*/
    this.generate(qtdBubbles);

    /* Função de renderização, chama a renderização de cada uma das bolhas */
    this.render = function(ctx)
    {
        ctx.save();
        ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
        ctx.strokeStyle = '#FF9933';
        ctx.lineWidth = 0.1;
        for(var i=0; i<this.items.length; i++){
            this.items[i].render(ctx, this.speed);
        }
        ctx.restore();
    }
}
Explosion.prototype = new Drawable();