class DirectionalLight {

    // <float>lightIntensity
    // <float3>lightColor
    // <float3>lightPos
    // <float3>focalPoint
    // <float3>lightUp
    // <bool>hasShadowMap
    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));// 网格
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);   // 发光材质球
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        // 帧缓冲对象(Framebuffer Object, FBO)
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);
        console.log("M变换：" + modelMatrix);

        // View transform
        // (static) lookAt(out, eye, center, up) → {mat4} 
        // Generates a look-at matrix with the given eye position, focal point, and up axis. If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        console.log("V变换：" + viewMatrix);

        // Projection transform
        // (static) ortho(out, left, right, bottom, top, near, far) → {mat4}
        // Generates a orthogonal projection matrix with the given bounds
        mat4.ortho(projectionMatrix, -100, 100, -100, 100, 1e-2, 1000);
        console.log("P变换：" + projectionMatrix);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);
        console.log("MVP变换：" + lightMVP);

        return lightMVP;
    }
}
