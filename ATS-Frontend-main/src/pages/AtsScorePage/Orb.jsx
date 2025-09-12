import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function OrbWithText({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  text = "Your Text",
  textColor = "white",
  textSize = "1.5rem",
  fontWeight = "600",
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hover, setHover] = useState(forceHoverState);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up scene
    const scene = new THREE.Scene();
    
    // Set up camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 1;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create shader material
    const orbShader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() },
        hue: { value: hue },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: hoverIntensity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        
        uniform float iTime;
        uniform vec3 iResolution;
        uniform float hue;
        uniform float hover;
        uniform float rot;
        uniform float hoverIntensity;
        varying vec2 vUv;
        
        vec3 rgb2yiq(vec3 c) {
          float y = dot(c, vec3(0.299, 0.587, 0.114));
          float i = dot(c, vec3(0.596, -0.274, -0.322));
          float q = dot(c, vec3(0.211, -0.523, 0.312));
          return vec3(y, i, q);
        }
        
        vec3 yiq2rgb(vec3 c) {
          float r = c.x + 0.956 * c.y + 0.621 * c.z;
          float g = c.x - 0.272 * c.y - 0.647 * c.z;
          float b = c.x - 1.106 * c.y + 1.703 * c.z;
          return vec3(r, g, b);
        }
        
        vec3 adjustHue(vec3 color, float hueDeg) {
          float hueRad = hueDeg * 3.14159265 / 180.0;
          vec3 yiq = rgb2yiq(color);
          float cosA = cos(hueRad);
          float sinA = sin(hueRad);
          float i = yiq.y * cosA - yiq.z * sinA;
          float q = yiq.y * sinA + yiq.z * cosA;
          yiq.y = i;
          yiq.z = q;
          return yiq2rgb(yiq);
        }
        
        float hash(float n) {
          return fract(sin(n) * 43758.5453123);
        }
        
        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          
          float n = p.x + p.y * 157.0 + 113.0 * p.z;
          return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                         mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
                     mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                         mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
        }
        
        vec4 extractAlpha(vec3 colorIn) {
          float a = max(max(colorIn.r, colorIn.g), colorIn.b);
          return vec4(colorIn.rgb / (a + 1e-5), a);
        }
        
        const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
        const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
        const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
        const float innerRadius = 0.6;
        const float noiseScale = 0.65;
        
        float light1(float intensity, float attenuation, float dist) {
          return intensity / (1.0 + dist * attenuation);
        }
        
        float light2(float intensity, float attenuation, float dist) {
          return intensity / (1.0 + dist * dist * attenuation);
        }
        
        vec4 drawOrb(vec2 uv) {
          vec3 color1 = adjustHue(baseColor1, hue);
          vec3 color2 = adjustHue(baseColor2, hue);
          vec3 color3 = adjustHue(baseColor3, hue);
          
          float ang = atan(uv.y, uv.x);
          float len = length(uv);
          float invLen = len > 0.0 ? 1.0 / len : 0.0;
          
          float n0 = noise(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
          float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
          float d0 = distance(uv, (r0 * invLen) * uv);
          float v0 = light1(1.0, 10.0, d0);
          v0 *= smoothstep(r0 * 1.05, r0, len);
          float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
          
          float a = iTime * -1.0;
          vec2 pos = vec2(cos(a), sin(a)) * r0;
          float d = distance(uv, pos);
          float v1 = light2(1.5, 5.0, d);
          v1 *= light1(1.0, 50.0, d0);
          
          float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
          float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
          
          vec3 col = mix(color1, color2, cl);
          col = mix(color3, col, v0);
          col = (col + v1) * v2 * v3;
          col = clamp(col, 0.0, 1.0);
          
          return extractAlpha(col);
        }
        
        void main() {
          // Convert from 0-1 UV space to -1 to 1 coordinate space
          vec2 uv = (vUv - 0.5) * 2.0;
          
          // Apply rotation
          float angle = rot;
          float s = sin(angle);
          float c = cos(angle);
          uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
          
          // Apply hover distortion
          uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
          uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
          
          // Draw the orb
          vec4 col = drawOrb(uv);
          gl_FragColor = vec4(col.rgb * col.a, col.a);
        }
      `
    });
    
    // Create a simple plane to render our shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, orbShader);
    scene.add(mesh);
    
    // Resize handler
    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Update renderer
      renderer.setSize(width, height);
      
      // Update uniform
      orbShader.uniforms.iResolution.value.set(width, height, width / height);
      
      // Update state for text positioning
      setContainerSize({ width, height });
    }
    
    // Initialize size
    resize();
    window.addEventListener("resize", resize);
    
    // Mouse interaction
    let targetHover = forceHoverState ? 1 : 0;
    let currentRot = 0;
    const rotationSpeed = 0.3; // radians per second
    
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;
      
      const distance = Math.sqrt(uvX * uvX + uvY * uvY);
      const newHoverState = distance < 0.8;
      setHover(newHoverState);
      
      if (newHoverState) {
        targetHover = 1;
      } else {
        targetHover = 0;
      }
    };
    
    const handleMouseLeave = () => {
      targetHover = 0;
      setHover(false);
    };
    
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    // Animation loop
    let lastTime = 0;
    let rafId;
    
    const animate = (time) => {
      rafId = requestAnimationFrame(animate);
      
      // Convert to seconds
      const t = time * 0.001;
      const dt = (time - lastTime) * 0.001;
      lastTime = time;
      
      // Update uniforms
      orbShader.uniforms.iTime.value = t;
      orbShader.uniforms.hue.value = hue;
      orbShader.uniforms.hoverIntensity.value = hoverIntensity;
      
      // Smooth hover transition
      const effectiveHover = forceHoverState ? 1 : targetHover;
      orbShader.uniforms.hover.value += (effectiveHover - orbShader.uniforms.hover.value) * 0.1;
      
      // Handle rotation
      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      orbShader.uniforms.rot.value = currentRot;
      
      // Render
      renderer.render(scene, camera);
    };
    
    rafId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      orbShader.dispose();
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div 
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          // transform: 'translate(-50%, -50%)',
          color: textColor,
          fontSize: textSize,
          fontWeight: fontWeight,
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.7)',
          letterSpacing: '0.05em',
          zIndex: 2,
          transition: 'transform 0.2s ease-in-out',
          transform: `translate(-50%, -50%) scale(${hover ? 1.05 : 1})`,

        }}
      >
        {text}
      </div>
    </div>
  );
}