/**
* NET Messages manager
* Ao adicionar objetos NetMessage não utilize índices numéricos como: NET.messages.push(obj) ou NET.messages[0] = obj. (ao remover o hash reorganiza os índices)
* Utilize NET.messages['identificacao'] = obj.
*/
var NET = {
    messages: new Array(),
	run: function(){
	
		for(var m in NET.messages){
			var msg = NET.messages[m];
			if(!msg.started)
				msg.run(m);
		}
		
		for(var m in NET.messages){
			var msg = NET.messages[m];
			
			if(msg.stoped){
				clearInterval(msg.handle);
				NET.messages.pop(msg);
			}
		}
	}
}


/**
* url: url do webservice ou página a ser invocado pelo objeto NetMessage
* repeat: quantidade de vezes que a mensagem deve ser repetida. -1 para infinitas vezes
* interval: intervalo entre a execução de uma mensagem e outra
* update: função que será executada a cada chamada do objeto NetMessage (opcional)
* updateargs: argumentos da função update (pode ser array)
* callback: função que será executada ao término de cada chamada da invocacao da url (opcional)
* callbackargs: argumentos da função callback (pode ser array)
*/
function NetMessage(url, repeat, interval, update, updateargs, callback, callbackargs, ws){

	this.handle = null; /*handle da funcao setInterval caso o número de iterações seja pré definido*/
	this.repeat = repeat; /* quantidade de repetições, 0 para nenhuma, -1 para contínuamente*/
	this.interval = parseInt(interval,10); /*intervalo de repetição*/
	this.url = url;
	this.args = new Array(); /*argumentos da url chave=>valor*/
	this.stoped = false; // esta mensagem já foi executada todas as vezes desejadas
	this.started = false; // já foi iniciado o loop iterativo de execução desta mensagem
	this.ws = ws;

	this.run = function(idx){
		this.started = true;
		if(!repeat){
			ws.post(url + NetMessage.montaParametros(idx), function(){callback(callbackargs);});	

			if(update)
					update(updateargs);
			this.stoped=true;
			callback(callbackargs);
		}
		else
		{
		
		
		
			this.handle = 
			setInterval(
			function(){
				var obj = NET.messages[idx];
				
				ws.post(url + NetMessage.montaParametros(idx), function(){callback(callbackargs);});	
				
				if(update){
				
					update(updateargs);
					}
				
				if(--obj.repeat == 0){
					clearInterval(obj.handle);
					obj.stoped = true;
					callback(callbackargs);
				}
				
			}, this.interval);
		}
	}
	
	NetMessage.montaParametros = function(idx){
		
		var obj = NET.messages[idx];

		var par = "?idx="+idx;
		for (var i in obj.args){
			par += "&" + i + "=" + obj.args[i];
		}
		return par;
	}
	
	this.clearArgs = function(){
		this.args = new Array();
		this.args.length = 0;
	}
	
	this.addArg = function(chave,valor){
		this.args[chave] = valor;
		this.args.length++;
	}
}//NetMessage


