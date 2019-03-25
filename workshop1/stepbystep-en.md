# Step-by-step

The goal is to create a scene containing several objects, in which it is possible to click on an object to control its movements with the keyboard.
Some objects will be animated, and some objects will be generated inside a for loop.

## Add elements

First, we add other objects to our scene.

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
 
 ## De-Attach camera control
 
 In order for the next step to work, we need to de-attach the camera from the scene, otherwise when we try to move an object the camera will move along with it:

 Remove or comment out `camera.attachControl(canvas, true);`

 ## Add  keyboard control
 
 We add the possibility of moving the sphere on the x and z axis with the keyboard.

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

To avoid movement when we release the key (KEYUP event), we wrap the previous code with this:

```
        if(keyboardInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN){
            ...
        }
```

To change the movement speed more easily, we create a variable and use this instead of hard-coding the value 0.1.

 ```
var speed = 0.5;
```

 ## Add pointer selection
 
Next, we want to be able to choose which object we move by clicking on it.

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
 
 We also need to change *sphere* into *pickedObject* for everything related to keyboard control.

 To avoid not moving any object after clicking somewhere random (which makes the object selected null), we can add this:
 
 ```
    var actionPointerDown = (obj) => {
        if(obj != null){
            pickedObject = obj;
        }
    }
```
 
We can also change the speed based on the selected object.

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

## Generate a certain number of objects

We can generate a certain number of objects with a for loop.

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

## Animate

Finally, we can animate objects of our chosing.

```
    // Animate

    scene.actionManager = new BABYLON.ActionManager(scene);

    var rotate = function (mesh) {
        scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
    }

    rotate(blueBox);
    rotate(purpleDonut);
```
