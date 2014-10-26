/**
 *função para geração dos trechos de fumaça
 * i - índice da mini nuvem sendo gerada
 * w - limite da largura onde a mini nuvem pode ser gerada
 * h - altura total da nuvem
 * fogh - altura de cada mini nuvem
 */
function SmokeFog(i, w, h, fogh) { // 
    this.x = Math.round(Math.random() * w);
    this.y = fogh*(i+1) + h; /* y , aparecer abaixo do limite */
    this.drift = Math.random()*w*2; /* deslocamento aleatório que a mini nuvem fará a cada iteração */
} 

/**
 * Nuvem de fumaça. Pode ser usado como nuvem de fogo ou vapor também.
 * w - largura da base da fumaça
 * h - altura total da nuvem
 * color - cor da nuvem
 * qtd - quantidade de mini nuvens da nuvem total
 */
function Smoke(w,h, color, qtd){
    this.m = [1,0,0,1,0,0]; /*m default*/
    this.maxfogs = qtd; /* quantidade máxima de mini nuvens*/
    this.fogArrray = []; /* vetor de mini nuvens */
    this.maxHeight = h; /* altura máxima da nuvem total*/
    this.maxWidth = w; /* largura máxima da base da nuvem total*/
    this.color = color; 
    this.speed = 2;/* velocidade de subida */
    this.fogHeight = 30; /* altura de cada mini nuvem */
    this.disp = 0.003; /* fator de dispersão das mini nuvens*/
    this.shadow = true; /* gerar sombra ?*/
                
    /*Inicializa vetor de mini nuvens */
    this.createFogs = function(){
        this.fogArrray = [];
        for(var i=0; i< this.maxfogs; i++){
            this.fogArrray[i] = new SmokeFog(i, this.maxWidth, this.maxHeight, this.fogHeight);
        }
    }
    this.createFogs();
    
    /**
     * Renderiza todas as mini nuvens
     */
    this.render = function(ctx){
        ctx.save();
        ctx.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5]);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.fogHeight;
                     
        if(this.shadow){
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 20;
        }
        
        /*desenha cada mini nuvem */
        for (var i = 0; i < this.fogArrray.length; i++) {
            if(this.fogArrray[i].y <= (this.maxHeight +  this.fogHeight)){ /* se a mini nuvem estiver no limite visível ( 0 até altura máxima)*/
                ctx.globalAlpha = this.fogArrray[i].y/this.maxHeight; /*transparência é proporcional a altura da mini nuvem*/
                ctx.beginPath();
                ctx.moveTo(this.fogArrray[i].x, this.fogArrray[i].y);
                /* 1/3 das mini nuvens viradas à esquerda, o restante viradas à direita */
                if(i%3==0)            {
                    ctx.bezierCurveTo(this.fogArrray[i].x + this.fogArrray[i].drift, this.fogArrray[i].y - this.fogHeight*0.5,
                        this.fogArrray[i].x - this.fogArrray[i].drift,  this.fogArrray[i].y - this.fogHeight,
                        this.fogArrray[i].x, this.fogArrray[i].y - this.fogHeight*1.5);
                }
                else{             
                    ctx.bezierCurveTo(this.fogArrray[i].x - this.fogArrray[i].drift, this.fogArrray[i].y - this.fogHeight*0.5,
                        this.fogArrray[i].x + this.fogArrray[i].drift,  this.fogArrray[i].y - this.fogHeight,
                        this.fogArrray[i].x, this.fogArrray[i].y - this.fogHeight*1.5);
                }
                ctx.stroke();
            }
        }
        ctx.restore();
        this.updatePositions();
    },
    
    /* Atualiza posições de toda mini nuvem*/    
    this.updatePositions = function(){
        for (var i = 0; i < this.fogArrray.length; i++) {
            /* ainda não passou do limite Y da tela */
            if (this.fogArrray[i].y > 0) {
                this.fogArrray[i].y -= this.speed; /*desloca em Y */
                
                if(this.fogArrray[i].y <= this.maxHeight){ /* se já está visível = entre 0 e limite da nuvem total*/
                    /*aplica deslocamento nas nuvens divisíveis por 3 e por 2 */
                    if(i%3==0)
                        this.fogArrray[i].x += (this.fogArrray[i].y  - this.maxHeight)*this.disp;
                    else if(i%2==0)
                        this.fogArrray[i].x -= (this.fogArrray[i].y - this.maxHeight)*this.disp;
                    this.fogArrray[i].drift += Math.random();
                }
                
            }
            else {/* se ultrapassou o limite Y da tela, reseta sua posição*/
                this.fogArrray[i].y = this.maxHeight + this.fogHeight;
                this.fogArrray[i].drift = Math.random()*this.maxWidth;
                this.fogArrray[i].x = Math.round(Math.random() * this.maxWidth);
            }
        }
    }
}
Smoke.prototype = new Drawable();