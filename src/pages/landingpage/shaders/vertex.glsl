varying vec2 vUv;

attribute vec3 aPosition;
attribute float aIndex;
attribute vec4 aTextureCoords;

uniform float uCurrentPage;
uniform float uPageThickness;
uniform float uPageWidth;
uniform float uPageHeight;
uniform float uMeshCount;
uniform float uTime;
uniform float uSlideProgress;
uniform float uProgress;
uniform float uSplitProgress;
uniform float uPageSpacing;

uniform float uScrollY;
uniform float uMaxX;
uniform float uSpeedY;

varying vec4 vTextureCoords;
varying float vIndex;
varying float vRotationProgress;
varying vec3 vPosition;

mat3 getYrotationMatrix(float angle)
{
    return mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
}

mat3 getXrotationMatrix(float angle)
{
    return mat3(
        1.0, 0.0, 0.0,
        0.0, cos(angle), -sin(angle),
        0.0, sin(angle), cos(angle)
    );
}

float remap(float value, float originMin, float originMax)
{
    return clamp((value - originMin) / (originMax - originMin),0.,1.);
}

float getXwave(float x)
{
    return sin(x*2.) * 0.4;
}

void main()
{     
    
    float PI = 3.14159265359;

    // Define the rotation center
    vec3 rotationCenter = vec3(-uPageWidth*0.5, 0.0, 0.0);
    
    // Translate position to make rotation center the origin
    vec3 translatedPosition = position - rotationCenter;    
    
    // Apply rotation around the new origin

    // ========================================
    // TIMELINE - ROTATION ONLY:
    // ========================================
    // PHASE 1: Page Flipping (uProgress 0.0 → 1.0)
    // No split phase - rotation completes and transitions directly to grid
    // ========================================

    // ========================================
    // PHASE 1: PAGE FLIPPING (uProgress only)
    // ========================================
    
    // Step 1: Initial rotation acceleration (0-30% of uProgress)
    float rotationAcclerationProgress = remap(uProgress, 0., 0.3);
    float delayBeforeStart = (aIndex / uMeshCount);
    float localRotAccelerationProgress = clamp((rotationAcclerationProgress - delayBeforeStart), 0.0, 1.0);

    // Step 2: Full speed rotation (30-70% of uProgress)
    float fullSpeedRotationAngle = remap(uProgress, 0.3, 0.7);
    
    // Step 3: Stacking rotation (70-100% of uProgress)
    float stackingAngle = remap(uProgress, 0.7, 1.);
    
    // Calculate rotation components - reduced for face-on ending
    float yAngle = -(position.x*0.2*smoothstep(0.,0.3,rotationAcclerationProgress) - rotationAcclerationProgress*1.5*PI - localRotAccelerationProgress*1.5*PI);
    yAngle += fullSpeedRotationAngle*3.0*PI;    // Reduced from 4.2*PI
    yAngle += position.x*0.2*stackingAngle + (1.-localRotAccelerationProgress)*1.5*PI*stackingAngle + PI*1.2*stackingAngle; // Reduced from 2*PI and 1.7*PI

    // (Reverted end-closure correction to avoid reverse effect)
    
    // Add crumple angle (part of rotation phase) and fade near the end
    float pageCrumpleAngle = (aIndex - (uMeshCount-1.)*0.5)*smoothstep(0.8,1.,stackingAngle)*((-pow(translatedPosition.x,2.))*0.002);
    yAngle += pageCrumpleAngle * (1.0 - smoothstep(0.8, 1.0, uProgress));
    
    // Compute a per-page (instance-level) base Y angle WITHOUT per-vertex components
    // This is used to drive the split direction so all vertices of a page move colinearly
    float baseYAngle = -( - rotationAcclerationProgress*1.5*PI - localRotAccelerationProgress*1.5*PI);
    baseYAngle += fullSpeedRotationAngle*3.0*PI;
    baseYAngle += (1.-localRotAccelerationProgress)*1.5*PI*stackingAngle + PI*1.2*stackingAngle;
    baseYAngle = mod(baseYAngle + 2.0 * PI, 2.0 * PI);
    
    // ========================================
    // LIMIT ROTATION TO ONE SPIN (range [-2π, 0])
    // ========================================
    float maxRotation = 2.0 * PI; // One full rotation
    yAngle = mod(yAngle + maxRotation, 2.0 * PI) - maxRotation;
    
    // No split phase - rotation stays as calculated
    yAngle *= 1.0;

    // Smoothly zero rotation to face-on near the end to match initial pose
    float endPoseGate = 1.0 - smoothstep(0.9, 1.0, uProgress);
    yAngle *= endPoseGate;

    // ========================================
    // POSITIONING EFFECTS - PHASE 1 (uProgress only):
    // ========================================
    
    // Crumple effect: pages bend and curve during stacking phase
    float pageCrumple = (aIndex - (uMeshCount-1.)*0.5)*smoothstep(0.8,1.,stackingAngle)*((uPageWidth-translatedPosition.x-1.)*0.01);
    translatedPosition.z += pageCrumple * endPoseGate; // fade out near end to match initial pose

    // Stacking: pages stack on top of each other during stacking phase
    float stackingPages = (uMeshCount-aIndex) * uPageThickness*smoothstep(0.8,1.,stackingAngle);
    translatedPosition.z += stackingPages * endPoseGate; // fade out near end to match initial pose

    // ========================================
    // Z SCROLL LOGIC (always active):
    // ========================================
    
    float boxCenterZ = uPageSpacing*( - (aIndex - (uMeshCount-1.)*0.5));        
    
    float maxZ = uMeshCount * (uPageSpacing + uPageThickness) * 0.5;

    float centerZProgress = boxCenterZ - uScrollY;
    float wrappedCenterZ = mod(centerZProgress + maxZ, 2.0 * maxZ) - maxZ - getXwave((position.y+uPageHeight*0.5)/uPageHeight)*clamp(uSpeedY*2.,-2.,2.); 
    
    float zOffset = wrappedCenterZ - boxCenterZ;
    
    translatedPosition.z += zOffset;
    
    vec3 rotatedPosition = getYrotationMatrix(yAngle) * translatedPosition;        

    // X rotation
    float initialRotationProgress = remap(uProgress,0.,0.15);

    // Translate back to original coordinate system
    rotatedPosition += rotationCenter;
    // Ensure the early X offset is zero at both the very start and at the end of rotation
    // so the final pose matches the initial face-on pose
    float endGate = endPoseGate;
    rotatedPosition.x += initialRotationProgress * uPageWidth * 0.5 * endGate;
        
    float xAngle = -PI*0.2*initialRotationProgress;
    
    // Smoothly zero X rotation near the end of rotation to match initial pose
    xAngle *= endPoseGate;

    vec3 newPosition = getXrotationMatrix(xAngle) * rotatedPosition;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);        

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;    

    vUv = uv;    
    vTextureCoords=aTextureCoords;
    vIndex=aIndex;
    vRotationProgress=localRotAccelerationProgress;
}