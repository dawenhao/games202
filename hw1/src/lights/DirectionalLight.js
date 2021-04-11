class DirectionalLight {

    // <float>lightIntensity
    // <float3>lightColor
    // <float3>lightPos
    // <float3>focalPoint
    // <float3>lightUp
    // <bool>hasShadowMap
    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        console.log("CalcLightMVP");
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
        mat4.scale(modelMatrix, modelMatrix, scale);
        mat4.translate(modelMatrix, modelMatrix, translate);
        console.log("M变换：" + modelMatrix);

        // View transform
        let newLPos = [-this.lightPos[0], -this.lightPos[1], -this.lightPos[2]];
        mat4.translate(viewMatrix, viewMatrix, newLPos);
        console.log("V变换：" + viewMatrix);

        // Projection transform
        mat4.lookAt(projectionMatrix, this.lightPos, this.focalPoint, this.lightUp);
        console.log("P变换：" + projectionMatrix);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);
        console.log("MVP变换：" + lightMVP);

        return lightMVP;
    }
}
