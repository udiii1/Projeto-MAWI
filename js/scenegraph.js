/* Implementação de um grafo de cena primitivo....há ainda mais a fazer, mas não agora
[ cos(angle) -sin(angle) 0 ]
[ sin(angle)  cos(angle) 0 ]
[     0           0      1 ]
cos 0.70717619
sin 0.707037366
 **/

/* Nó sem nada, somente para ser ponto de referência de um conjunto de atores ou objetos */
function DummyNode(){
    //this.m =  [0.525321989,-0.850903525,0.850903525, 0.525321989, 40, 40]
    this.m = [1, 0, 0, 1, 0, 0];
}


function Node(obj,parent){
    this.obj = obj;
    this.parent = parent;
    this.children = new Array();
    this.add = function(obj){
        var node = new Node(obj,this);
        this.children.push(node);
        return node;
    }
}


var SceneGraph = {
    root: null,
    render: function(ctx, root){
        if(root.parent!=null && root.obj.render != null) /* se o nó possui pai (não é a raiz) e seu objeto é renderizável */
            root.obj.render(ctx, root.obj);
        ctx.save();
        ctx.transform(root.obj.m[0], root.obj.m[1], root.obj.m[2], root.obj.m[3], root.obj.m[4], root.obj.m[5]);
        for(var i=0; i< root.children.length; i++){
            SceneGraph.render(ctx,root.children[i]);
        }
        ctx.restore();
    }
}
SceneGraph.root = new Node(new DummyNode(),null);

