var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    //camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

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

    var pickedObject = sphere;
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


    // Add keyboard control 

    var speed = 0.5;

     scene.onKeyboardObservable.add((keyboardInfo) => {

        if(keyboardInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN){
                if(keyboardInfo.event.key == "ArrowLeft" || keyboardInfo.event.key == "q"){
                    pickedObject.position.x-=speed
                }
                else if(keyboardInfo.event.key == "ArrowRight" || keyboardInfo.event.key == "d")
                {
                    pickedObject.position.x+=speed
                }
                else if(keyboardInfo.event.key == "ArrowUp" || keyboardInfo.event.key == "z"){
                    pickedObject.position.z+=speed
                }
                else if(keyboardInfo.event.key == "ArrowDown" || keyboardInfo.event.key == "s")
                {
                    pickedObject.position.z-=speed
                }
        }
    });


    // Add pointer selection

     scene.onPointerObservable.add((pointerInfo) => {      		
        if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
            actionPointerDown(pointerInfo.pickInfo.pickedMesh);
        }
    });


    // Animate

    scene.actionManager = new BABYLON.ActionManager(scene);

    var rotate = function (mesh) {
        scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
    }

    rotate(blueBox);
    rotate(purpleDonut);

    return scene;

};