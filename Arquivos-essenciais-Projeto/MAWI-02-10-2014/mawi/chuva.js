/*Objeto que representará uma gota */
function Drop(i, w) { // função das gotas em si e seus atributos
    this.x = Math.round(Math.random() * w);
    this.y = -10*(i+1);
    this.drift = Math.random(); /* deslocamento aleatório que a gota fará a cada iteração */
} 

/**
 * Objeto que representará a chuva. Este objeto possui um vetor de gotas e é responsável por atualizar suas posições.
 * Objeto Drawable - renderizável
 * Rain(w,h, color, qtDrops) - alcance da chuva no eixo X, alcance da chuva no eixo Y, cor das gotas, quantidade de gotas
 */
function Rain(w,h, color, qtDrops){
    this.maxdrops = qtDrops; /*quantidade de gotas*/
    this.dropArray = []; /* vetor com as gotas precalculadas*/
    this.maxHeight = h; /*alcance da chuva no eixo Y*/
    this.maxWidth = w; /*alcance da chuva no eixo X*/
    this.color = color; /*cor das gotas*/
    this.wind = 0; /*vento - altera o deslocamento (drift)*/
    this.speed = 4; /* velocidade da chuva */
    this.dropWidth =  2; /* largura das gotas*/
    this.dropHeight = 4; /* altura das gotas*/
                
    /*Inicializa vetor de gotas */
    this.createDrops = function(){
        this.dropArray = [];
        for(var i=0; i< this.maxdrops; i++){
            this.dropArray[i] = new Drop(i, this.maxWidth);
        }
    }
    this.createDrops();
    
    /*Função de renderização, presente em todo Drawable - desenha todas as gotas e atualiza as posições */
    this.render = function(ctx){
        ctx.save();
        ctx.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5]);
        ctx.fillStyle = this.color;//whitesmoke
        for (var i = 0; i < this.dropArray.length; i++) {
            ctx.fillRect(this.dropArray[i].x, this.dropArray[i].y, this.dropWidth, this.dropHeight);
        }
        ctx.restore();
        this.update();
    },
    
    /* Atualiza as posições das gotas - se passarem dos limites máximos definidos nos eixos X ou Y, são recicladas, colocadas na posição oposta*/
    this.update = function(){
        for (var i = 0; i < this.dropArray.length; i++) {
            if (this.dropArray[i].y <= this.maxHeight) {
                this.dropArray[i].y += this.speed;
                if (this.dropArray[i].y > this.maxHeight){
                    this.dropArray[i].y = -10*(i+1);
                }
                this.dropArray[i].x += (this.dropArray[i].drift + this.wind);
                            
                if (    (this.dropArray[i].x > this.maxWidth) && this.wind >=0)
                    this.dropArray[i].x = 0;
                else if(  (this.dropArray[i].x < 0) && this.wind <0)
                    this.dropArray[i].x = this.maxWidth;
            }
        }
    }
}
Rain.prototype = new Drawable();