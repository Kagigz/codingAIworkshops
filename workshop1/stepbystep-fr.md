# Step-by-step

Le but est de créer une scène contenant plusieurs objets, dans laquelle il est possible de cliquer sur un objet pour contrôler ses movements à l'aide du clavier.
Quelques objets seront animés, et certains seront créés à l'intérieur d'une boucle for.

## Ajouter des éléments

On commence par ajouter d'autres objets à notre scène.

 ```
    // Add elements

    var blueMat = new BABYLON.StandardMaterial("blue", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = BABYLON.Color3.Blue();

    var purpleMat = new BABYLON.StandardMaterial("purple", scene);
    purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.emissiveColor = BABYLON.Color3.Purple();

    var blueBox = BABYLON.MeshBuilder.CreateBox("box", {size:1}, scene);
    blueBox.material = blueMat;
    blueBox.position.x = -2.5;
    blueBox.position.y = 0.5;
    blueBox.position.z = 2;

    var purpleDonut = BABYLON.MeshBuilder.CreateTorus("torus", {diameter:1, thickness:0.5}, scene);
    purpleDonut.material = purpleMat;
    purpleDonut.position.x = 2;
    purpleDonut.position.y = 0.5;
    purpleDonut.position.z = -2;
```
 
 ## Détacher la caméra
 
 Pour que la prochaine étape fonctionne, il faut détacher la caméra de la scène, sinon lorsque l'on voudra bouger un objet la caméra bougera avec.
 
 Il faut donc enlever ou commenter la ligne `camera.attachControl(canvas, true);`

 ## Ajouter des contrôles au clavier
 
On ajoute la possibilité de bouger la sphère sur les axes x et z à l'aide du clavier.

 ```
     // Add keyboard control 

     scene.onKeyboardObservable.add((keyboardInfo) => {


            if(keyboardInfo.event.key == "ArrowLeft" || keyboardInfo.event.key == "q"){
                sphere.position.x-=0.1
            }
            else if(keyboardInfo.event.key == "ArrowRight" || keyboardInfo.event.key == "d")
            {
                sphere.position.x+=0.1
            }
            else if(keyboardInfo.event.key == "ArrowUp" || keyboardInfo.event.key == "z"){
                sphere.position.z+=0.1
            }
            else if(keyboardInfo.event.key == "ArrowDown" || keyboardInfo.event.key == "s")
            {
                sphere.position.z-=0.1
            }
    });
```

Pour éviter que lorsque l'on relâche une touche (KEYUP event) il y ait un dernier mouvement, on ajoute cela autour du code précédent :

```
        if(keyboardInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN){
            ...
        }
```

Pour changer la vitesse plus facilement, au lieu de déplacement de 0.1, on déplace de la variable speed après l'avoir déclarée :

 ```
var speed = 0.5;
```

## Ajouter la sélection à la souris
 
On veut pouvoir sélectionner quel objet on veut bouger à la souris.

```
    // Add pointer selection

     scene.onPointerObservable.add((pointerInfo) => {      		
        if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
            actionPointerDown();
        }
    });
```

```
   var pickedObject = sphere;
    
    var actionPointerDown = (obj) => {
        pickedObject = obj;
    }
```

```
    actionPointerDown(pointerInfo.pickInfo.pickedMesh);
 ```
 
 On doit aussi changer *sphere* en *pickedObject* partout dans le code lié aux contrôles clavier.

 Pour éviter que lorsque l'on clique dans le vide, il n'y ait aucun objet sélectionné (l'objet est *null*) et que rien ne bouge, on rajoute :
 
 ```
    var actionPointerDown = (obj) => {
        if(obj != null){
            pickedObject = obj;
        }
    }
```
 
On peut également changer la vitesse en fonction de l'objet sélectionné.

```
    var actionPointerDown = (obj) => {
        if(obj != null){
            pickedObject = obj;

            if (pickedObject == sphere){
                speed = 0.5;
            }
            else if (pickedObject == purpleDonut){
                speed = 1.5;
            }
            else if (pickedObject == blueBox){
                speed = 0.1;
            }
        }
    }
```

## Génerer un certain nombre d'objets

On peut générer un nombre défini d'objets à l'aide d'une boucle for.

```
    var redMat = new BABYLON.StandardMaterial("red", scene);
    redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = BABYLON.Color3.Red();


    for(var i=0;i<3;i++){
        var redBox = BABYLON.Mesh.CreateBox("redBox"+i, 0.5, scene);
        redBox.material = redMat;
        redBox.position.x = -3;
        redBox.position.x += i;
        redBox.position.y = 3;
    }
```

## Animer

Pour finir, on peut animer les objets de notre choix.

```
    // Animate

    scene.actionManager = new BABYLON.ActionManager(scene);

    var rotate = function (mesh) {
        scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
    }

    rotate(blueBox);
    rotate(purpleDonut);
```
