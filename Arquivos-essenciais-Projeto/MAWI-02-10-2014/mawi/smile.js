/**
 * Objeto animado smile
 * @posx = posicaoX
 * @posy = posiçãoY
 * @boca = nome da animação para boca. Pode ser "marota", "sorriso", "seria" ou "triste"
 * @olhos = nome para animação dos olhos. Pode ser "normal", "triste", "pensativo" ou "bravo"
 * @cor = cor do corpo do smile
 */
function Smile(size, boca, olhos, cor)
{
    this.size = size;
    this.color = cor;
    this.boca = null;
    this.olhos = null;
	this.left = false; //animação para o lado invertido
    this.start = new Date(); /* usado para controlar algumas animações em função do tempo passado */
    this.sizeDiv2 = size*0.5; /*otimização*/
    this.sizeMul2 = size*2;/*otimização*/
    this.PI2 = 2*Math.PI;/*otimização*/
    /* Atributos para animação lágrima */
    this.moveTriste = 0.0;
    this.dirTriste = 1;
    this.lagrimaY = 0;
    this.lagrimaDir = false;
    /* fim dos atributos animação lágrima */
    /* Atributos para animação dos olhos pensativos*/
    this.movePensativo = 0.0;
    this.dirPensativo = 1;
    /* Fim dos atributos para animação dos olhos pensativos*/        
    /* Atributos para animação da palpebra */
    this.piscando = false;
    this.fechaPalpebra = 0;
    this.dirPalpebra = 1;
    /* Fim dos atributos para animação da palpebra */
        
	
    /**
     * Seleciona a animação para boca e olhos dependendo dos argumentos
     */
    this.setAnimation = function(boca, olhos){
        this.start = new Date();
        if(boca=="marota")
            this.boca = this.bocaMarota;
        else if(boca=="sorriso")
            this.boca = this.bocaSorriso;
        else if(boca=="seria")
            this.boca = this.bocaSeria;
        else if(boca=="triste")
            this.boca = this.bocaTriste;
		
        if(olhos=="normal")
            this.olhos = this.olhosNormais;
        else if(olhos=="triste")
            this.olhos = this.olhosTristes;
        else if(olhos=="pensativo")
            this.olhos = this.olhosPensativos;
        else if(olhos=="bravo")
            this.olhos = this.olhosBravos;
    }
    
    /**
     * Animação da boca sorrindo e aberta
     */
    this.bocaMarota = function(ctx) {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 0.3*this.size;
        ctx.beginPath();
        ctx.arc(this.sizeDiv2, this.sizeDiv2, this.size*2.5, 0, Math.PI, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        /* parte rosa(lingua)*/
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(-this.size, this.sizeDiv2, this.size, Math.PI, this.PI2, true);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Animação da boca triste
     */
    this.bocaTriste = function(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.3*this.size;
        ctx.beginPath();
        ctx.arc( 1.3*this.size,  3*this.size, this.size*1.5, 1.2*Math.PI, 1.8*Math.PI, false);
        ctx.stroke();
    }
    
    /**
     * Animação da boca séria
     */
    this.bocaSeria = function(ctx) {
        
		if(this.left) 
			this.bocaSeriaEsq(ctx)
		else{
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 0.3*this.size;
			ctx.beginPath();
			ctx.moveTo(0 , this.sizeMul2);
			ctx.lineTo(this.sizeMul2, this.sizeMul2);
		//	ctx.moveTo(0 , 1.5*this.size);
			//ctx.lineTo(0 , 2.5*this.size);
			ctx.stroke();
		}
    }
	
	/**
     * Animação da boca séria
     */
    this.bocaSeriaEsq = function(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.3*this.size;
        ctx.beginPath();
        ctx.moveTo(-this.sizeDiv2 , this.sizeMul2);
        ctx.lineTo(this.size, this.sizeMul2);
        ctx.stroke();
    }
	
    
    /**
    * Animação do sorriso
    */
    this.bocaSorriso = function(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.3*this.size;
        ctx.beginPath();
        ctx.arc(this.size, this.size, this.size*1.5, 0.15*Math.PI, 0.85*Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, this.sizeMul2, this.sizeDiv2, 0.8*Math.PI, 1.5*Math.PI, false);
        ctx.stroke();
    }
    
    /**
    * Olhos normais que piscam
    */
    this.olhosNormais = function(ctx) { 

		if(this.left){
			this.olhosNormaisLeft(ctx);
		}
		else{
			this.olhosNormaisInt(ctx);
			this.olhosNormaisExt(ctx);	
			this.desenhaSpotOlhosNormais(ctx);
			this.olhosNormaisTemporizaPiscar(ctx);
		}
    }
	
	 this.olhosNormaisLeft = function(ctx) {   
        this.olhosNormaisIntLeft(ctx);
        this.olhosNormaisExtLeft(ctx);	
        this.desenhaSpotOlhosNormaisLeft(ctx);
        this.olhosNormaisTemporizaPiscar(ctx);
    }
	
    
    this.olhosNormaisInt = function(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.3*this.size;
        /*Parte externa Olho Esquerdo*/
        ctx.beginPath();
        ctx.arc(0, -this.size, this.size, 0, Math.PI, false);//baixo
        ctx.arc(0, -this.sizeMul2, this.size, Math.PI, this.PI2, false);//cima
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
            
        /*Parte externa Olho Direito. Aplicamos uma leve escala para parecer menor*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.beginPath();
        ctx.arc(3*this.size, -this.size, this.size, 0, Math.PI, false);
        ctx.arc(3*this.size, -this.sizeMul2, this.size, Math.PI, this.PI2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
	
	this.olhosNormaisIntLeft = function(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.3*this.size;
        /*Parte externa Olho Esquerdo*/
        ctx.beginPath();
        ctx.arc(-this.sizeDiv2, -this.size, this.size, 0, Math.PI, false);//baixo
        ctx.arc(-this.sizeDiv2, -this.sizeMul2, this.size, Math.PI, this.PI2, false);//cima
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
            
        /*Parte externa Olho Direito. Aplicamos uma leve escala para parecer menor*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.beginPath();
        ctx.arc(-3*this.size, -this.size, this.size, 0, Math.PI, false);
        ctx.arc(-3*this.size, -this.sizeMul2, this.size, Math.PI, this.PI2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
	
    
    this.olhosNormaisExt = function(ctx){
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.3*this.size;
        
        /*Parte interna olho Esquerdo*/
        ctx.beginPath();
        ctx.arc(0.2*this.size, -1.5*this.size, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
			
        /*Parte interna olho Direito. Aplicamos uma leve escala para parecer menor*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.beginPath();
        ctx.arc(3.2*this.size, -1.5*this.size, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();    
        ctx.restore();	
    }
	
	
	this.olhosNormaisExtLeft = function(ctx){
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.3*this.size;
        
        /*Parte interna olho Esquerdo*/
        ctx.beginPath();
        ctx.arc(-0.5*this.size, -1.5*this.size, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
		
        /*Parte interna olho Direito. Aplicamos uma leve escala para parecer menor*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.beginPath();
        ctx.arc(-3.0*this.size, -1.5*this.size, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();    
        ctx.restore();	
    }
    
    this.olhosNormaisTemporizaPiscar = function(ctx){
        /* indica se deve começar a animação de piscar. Inicia a cada 2,5 segundos passados*/
        var dt = (new Date()) - this.start;			
        if(dt > 2500){
            this.start = new Date();
            this.piscando = true;
        }
        /* Renderiza animação de piscar */
        if(this.piscando){
            this.piscar(ctx); //chamada da animação piscar, que ao terminar colocará this.piscando como false
        }	
    }
	
    /**
     * Olhos com raiva
     */
    this.olhosBravos= function(ctx) {
        this.olhosBravosExt(ctx);
        this.olhosBravosInt(ctx);
        this.desenhaSpotOlhosRaiva(ctx);
    }
    this.olhosBravosExt = function(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.4*this.size;
        /* Olho esquerdo */
        ctx.beginPath();
        ctx.arc(0, -this.sizeDiv2, this.size, 0, Math.PI, false);
        ctx.lineTo(-this.size, -this.sizeMul2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        /* Olho direito */
        ctx.beginPath();
        ctx.arc(3*this.size, -this.sizeDiv2, this.size, 0, Math.PI, false);
        ctx.lineTo(3*this.size + this.size, -this.sizeMul2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    this.olhosBravosInt = function(ctx){
        /************* Parte interna ****************/
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.2*this.size;
        /* Parte interna olho esquerdo */
        ctx.beginPath();
        ctx.arc(0, -this.sizeDiv2, this.sizeDiv2, 0, Math.PI, false);
        ctx.lineTo(-this.sizeDiv2, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        /* Parte interna olho direito */
        ctx.beginPath();
        ctx.arc(3*this.size, -this.sizeDiv2, this.sizeDiv2, 0, Math.PI, false);
        ctx.lineTo(3*this.size + this.sizeDiv2, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();      
    }	
	
    /**
    * Olhos com aspecto triste e chorando
    */
    this.olhosTristes = function(ctx) {
        this.temporizaOlhosTristes();
        this.olhosTristesExt(ctx);
        this.olhosTristesInt(ctx);
        this.desenhaSpotOlhosTriste(ctx);
        this.desenhaLagrima(ctx);
    }
    this.temporizaOlhosTristes = function(){
        this.moveTriste += (0.003*this.size)*this.dirTriste;
        this.lagrimaY += (0.03*this.size);
	
        if(  Math.abs(this.moveTriste)  >  this.size*0.02 ) { /* movimento do spot do olho */
            this.dirTriste = -this.dirTriste; 
            this.start = new Date();
        }
        if(this.lagrimaY > 4*this.size) { /* recomeçar a soltar lágrima */
            this.lagrimaY = 0;
            this.lagrimaDir = !this.lagrimaDir;
        }
    }
    this.olhosTristesExt = function(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.3*this.size;
        /* Olho esquerdo parte externa */
        ctx.beginPath();
        ctx.arc(0, -this.size, this.size, 0, Math.PI, false);
        ctx.lineTo(this.size, -this.sizeMul2);//, this.size, Math.PI, 2*Math.PI, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        /* Olho direito parte externa */
        ctx.beginPath();
        ctx.arc(3*this.size, -this.size, this.size, 0, Math.PI, false);
        ctx.lineTo(3*this.size - this.size, -this.sizeMul2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    this.olhosTristesInt = function(ctx){
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.2*this.size;
        /* olho esquerdo parte interna */
        ctx.beginPath();
        ctx.arc(0, -this.size, this.size*0.6, 0, Math.PI, false);
        ctx.lineTo(this.sizeDiv2, -1.6*this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        /* olho direito parte interna */
        ctx.beginPath();
        ctx.arc(3*this.size, -this.size , this.size*0.6, 0, Math.PI, false);
        ctx.lineTo(3*this.size - this.sizeDiv2, -1.6*this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();       
    }
    /**
    * Desenha as gotas das lágrimas 
    */
    this.desenhaLagrima = function(ctx)
    {
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.globalAlpha = 0.5;
        if( this.lagrimaDir ){
            ctx.beginPath();
            ctx.arc(this.size, this.lagrimaY , 
                this.size/4, 0, Math.PI, false);
            ctx.lineTo(this.size, -this.size/2 + this.lagrimaY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        else
        {
            ctx.beginPath();
            ctx.arc(2*this.size, this.lagrimaY, this.size/4, 0, Math.PI, false);
            ctx.lineTo(2*this.size, -this.size/2 + this.lagrimaY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }
        
    /**
    * Olhos com pensativos
    */
    this.olhosPensativos = function(ctx) {
        this.olhosPensativosExt(ctx);
        this.temporizaOlhosPensativos(ctx);
        this.olhosPensativosInt(ctx);
        this.desenhaSpotOlhosPensativos(ctx);
    }
    this.olhosPensativosExt = function(ctx){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 0.3*this.size;
        /* olho esquerdo parte externa */
        ctx.beginPath();
        ctx.arc(-this.sizeDiv2, -this.size, this.size*1.4, Math.PI, this.PI2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        /* olho direito parte externa */
        ctx.beginPath();
        ctx.arc(2.5*this.size, -this.size, this.size*1.4, Math.PI, this.PI2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    this.olhosPensativosInt = function(ctx){
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.1*this.size;
        /* olho esquerdo parte interna*/
        ctx.beginPath();
        ctx.arc(-0.3*this.size + this.movePensativo, -this.size*1.5, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        /* olho direito parte interna*/
        ctx.beginPath();
        ctx.arc(2.7*this.size + this.movePensativo, -this.size*1.5, this.size*0.6, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();  
    }
    this.temporizaOlhosPensativos = function()
    {
        var dt = (new Date()) - this.start;	
        if(dt>1000)/* reinicia movimento após 1s*/		
        {
            this.movePensativo += 0.005*this.dirPensativo;
            if(  Math.abs(this.movePensativo)  >  this.sizeDiv2)
            {
                this.dirPensativo = -this.dirPensativo;
                this.start = new Date();
            }
        }
    }
    
	
    /**
    * Renderização do corpo esférico
    */
    this.corpo = function(ctx){
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.4*this.size;
        ctx.beginPath();
        ctx.arc(0 , -this.sizeDiv2, this.size*4, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    this.setAnimation(boca,olhos); //default
    this.render = function(ctx){
        ctx.save();
        ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
        
        this.corpo(ctx);
       // criaSombra(ctx);
		this.boca(ctx);
        this.olhos(ctx);
        
        ctx.restore();
    }
	
    criaSombra = function(ctx){
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;  
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
    }
	
    /**
    * Animação da palpebra
    */
    this.piscar = function(ctx){
        this.fechaPalpebra += 0.15*this.size * this.dirPalpebra;
	  
        if(this.fechaPalpebra > 1.5*this.size)
        {
            this.dirPalpebra = -this.dirPalpebra;
        }
        else if(this.fechaPalpebra < 0)
        {
            this.dirPalpebra = 1;
            this.piscando = false;
        }
        this.piscarEsqDir(ctx);
    }	
	
	
    /**
    * desenho das palpebras esquerda e direita
    */
    this.piscarEsqDir = function(ctx){
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.color;
        ctx.lineWidth = 0.2*this.size;
        /* palpebra esquerda*/
        ctx.beginPath();
        
		if(this.left)
			ctx.translate(-this.sizeDiv2,-2*this.size);
		else
			ctx.translate(0,-2*this.size);
        ctx.arc(0, 0, this.size, Math.PI, 2*Math.PI, false);
        ctx.lineTo(this.size, this.fechaPalpebra);
        ctx.lineTo(-this.size, this.fechaPalpebra);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        /* palpebra direita (o olho é menor)*/			
        ctx.scale(0.95,0.95);
		ctx.translate(3*this.size, 2*this.size);
        ctx.beginPath();
        
		if(this.left)
			ctx.translate(-this.size*5.5,-2*this.size);
		else
			ctx.translate(0,-2*this.size);
			
        ctx.arc(0, 0, this.size, Math.PI, 2*Math.PI, false);
        ctx.lineTo(this.size, this.fechaPalpebra);
        ctx.lineTo(-this.size, this.fechaPalpebra);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
	
	
    /**********************************************SPOT DOS OLHOS *******************************************************************/
    /**
    * Desenha spot para olho com raiva
    */
    this.desenhaSpotOlhosRaiva = function(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(0.2*this.size, -this.sizeDiv2, this.size*0.1, 0, this.PI2, false);
        ctx.arc(3.2*this.size, -this.sizeDiv2, this.size*0.1, 0, this.PI2, false);
        ctx.closePath();
        ctx.fill();
    }
	
    /**
    * Desenha spot para olhos tristes
    */
    this.desenhaSpotOlhosTriste = function(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(3.1*this.size, -this.size , this.size/5 - this.moveTriste, 0, 2*Math.PI, false);
        ctx.arc(0.1*this.size, -this.size, this.size/5 - this.moveTriste,  0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
    * Desenha spot para olhos sem expressão
    */
    this.desenhaSpotOlhosNormais = function (ctx){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(0.4*this.size, -1.5*this.size, this.size*0.1, 0, this.PI2, false);/*spot do olho esquerdo*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.arc(3.4*this.size, -1.5*size, size*0.1, 0, this.PI2, false);/*spot do olho direito*/
        ctx.restore();
        ctx.closePath();
        ctx.fill();
    }
	
	
	 /**
    * Desenha spot para olhos sem expressão
    */
    this.desenhaSpotOlhosNormaisLeft = function (ctx){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-0.4*this.size, -1.5*this.size, this.size*0.1, 0, this.PI2, false);/*spot do olho esquerdo*/
        ctx.save();
        ctx.scale(0.95,0.95);
        ctx.arc(-3.4*this.size, -1.5*size, size*0.1, 0, this.PI2, false);/*spot do olho direito*/
        ctx.restore();
        ctx.closePath();
        ctx.fill();
    }
	
	
    /**
    * Desenha spot para olhos pensativos
    */
    this.desenhaSpotOlhosPensativos = function(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(0.1*this.size - this.size/2 + this.movePensativo, -this.size*1.4, this.size*0.1, 0, 2*Math.PI, false);
        ctx.arc(3.6*this.size - this.size + this.movePensativo, -this.size*1.4, this.size*0.1, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}
Smile.prototype = new Drawable();

