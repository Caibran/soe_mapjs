import { LightingState } from "../state/lighting-state";

/**
 * LightingLayer renders lighting effects as an overlay on the map.
 * It uses a RenderTexture to draw the lighting and composites it
 * using multiply blend mode.
 */
export class LightingLayer {
  constructor(scene) {
    this.scene = scene;
    this.lightingState = LightingState.default();
    this.enabled = true;
    this.dirty = true;
    this.showMarkers = true; // Show light source position markers in editor

    // RenderTexture for the lighting layer
    this.renderTexture = null;

    // Canvas for drawing gradients (used for both WebGL and Canvas renderers)
    this.lightCanvas = document.createElement("canvas");
    this.lightCtx = this.lightCanvas.getContext("2d");

    // Animation time for flicker effects
    this.time = 0;
  }

  setLightingState(lightingState) {
    this.lightingState = lightingState || LightingState.default();
    this.dirty = true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.dirty = true;
  }

  setShowMarkers(showMarkers) {
    this.showMarkers = showMarkers;
    this.dirty = true;
  }

  /**
   * Convert hex color to RGB object
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Calculate flicker intensity based on time
   */
  getFlickerMultiplier(flicker, flickerSpeed, flickerIntensity, offset = 0) {
    if (!flicker || flickerIntensity === 0) {
      return 1.0;
    }

    // Use sine wave with noise for natural flicker
    const t = (this.time + offset) * flickerSpeed * 0.001;
    const flicker1 = Math.sin(t * 5.7) * 0.5 + 0.5;
    const flicker2 = Math.sin(t * 13.3 + 1.7) * 0.5 + 0.5;
    const flicker3 = Math.sin(t * 7.1 + 3.2) * 0.5 + 0.5;

    const combined = (flicker1 + flicker2 * 0.5 + flicker3 * 0.3) / 1.8;
    const variation = (combined - 0.5) * flickerIntensity * 0.2;

    return Math.max(0.1, 1.0 + variation);
  }

  /**
   * Draw a radial gradient light source
   */
  drawLightSource(
    ctx,
    x,
    y,
    color,
    size,
    spread,
    intensity,
    flickerMult = 1.0,
  ) {
    const rgb = this.hexToRgb(color);
    const effectiveIntensity = intensity * flickerMult;

    // Size is the inner bright area, spread is the falloff distance
    const innerRadius = size * 32; // Convert to pixels (tile size is 64x32 isometric)
    const outerRadius = (size + spread) * 32;

    if (outerRadius <= 0) return;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);

    // Inner bright area
    const innerAlpha = Math.min(1, effectiveIntensity);
    gradient.addColorStop(
      0,
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${innerAlpha})`,
    );

    // Transition point at inner radius
    const midRatio = Math.min(0.99, innerRadius / outerRadius);
    gradient.addColorStop(
      midRatio,
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${innerAlpha * 0.7})`,
    );

    // Fade to transparent at outer radius
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Convert tile coordinates to screen coordinates (isometric)
   */
  tileToScreen(tileX, tileY) {
    // Isometric conversion: x = (tileX - tileY) * 32, y = (tileX + tileY) * 16
    return {
      x: (tileX - tileY) * 32 + 32, // Center of tile
      y: (tileX + tileY) * 16 + 16,
    };
  }

  /**
   * Render the lighting layer to the provided canvas context
   *
   * Global light strength controls the transparency of the darkness overlay:
   * - 10 = fully transparent (no darkening visible)
   * - 0 = fully opaque (complete darkness)
   *
   * Light sources create bright spots that punch through the darkness.
   */
  renderToCanvas(width, height, scrollX, scrollY, zoom) {
    if (!this.enabled || !this.lightingState) {
      return null;
    }

    const globalLight = this.lightingState.globalLight;
    const playerLight = this.lightingState.playerLight;
    const lightSources = this.lightingState.lightSources;

    // Calculate darkness opacity (inverse of brightness)
    // Strength 10 = fully transparent (0 opacity), Strength 0 = fully opaque (1 opacity)
    const darknessOpacity = globalLight ? 1.0 - globalLight.strength / 10.0 : 0;

    const hasPlayerLight =
      playerLight && playerLight.enabled && playerLight.intensity > 0;
    const hasLightSources = lightSources && lightSources.length > 0;

    // If fully transparent and no markers needed, skip rendering
    if (darknessOpacity <= 0 && !(this.showMarkers && hasLightSources)) {
      return null;
    }

    // Resize canvas if needed
    if (
      this.lightCanvas.width !== width ||
      this.lightCanvas.height !== height
    ) {
      this.lightCanvas.width = width;
      this.lightCanvas.height = height;
    }

    const ctx = this.lightCtx;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Only draw lighting effects if there is darkness
    if (darknessOpacity > 0) {
      // Fill with the darkness color at the calculated opacity
      const rgb = globalLight
        ? this.hexToRgb(globalLight.color)
        : { r: 0, g: 0, b: 0 };
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darknessOpacity})`;
      ctx.fillRect(0, 0, width, height);

      // Use "destination-out" to cut holes in the darkness for light sources
      ctx.globalCompositeOperation = "destination-out";

      // Draw light sources (they cut through the darkness)
      if (hasLightSources) {
        for (let i = 0; i < lightSources.length; i++) {
          const ls = lightSources[i];
          const screenPos = this.tileToScreen(ls.x, ls.y);

          // Apply camera transform
          const x = (screenPos.x - scrollX) * zoom;
          const y = (screenPos.y - scrollY) * zoom;

          const flickerMult = this.getFlickerMultiplier(
            ls.flicker,
            ls.flickerSpeed,
            ls.flickerIntensity,
            i * 1000, // Offset for variety
          );

          this.drawLightHole(
            ctx,
            x,
            y,
            ls.size * zoom,
            ls.spread * zoom,
            ls.intensity,
            flickerMult,
          );
        }
      }

      // Draw player light preview at center of screen (for preview purposes)
      if (hasPlayerLight) {
        const centerX = width / 2;
        const centerY = height / 2;

        const flickerMult = this.getFlickerMultiplier(
          playerLight.flicker,
          playerLight.flickerSpeed,
          playerLight.flickerIntensity,
          999,
        );

        this.drawLightHole(
          ctx,
          centerX,
          centerY,
          playerLight.size * zoom,
          playerLight.spread * zoom,
          playerLight.intensity,
          flickerMult,
        );
      }

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      // Now overlay the light colors using "lighter" blend mode
      if (hasLightSources || hasPlayerLight) {
        ctx.globalCompositeOperation = "lighter";

        if (hasLightSources) {
          for (let i = 0; i < lightSources.length; i++) {
            const ls = lightSources[i];
            const screenPos = this.tileToScreen(ls.x, ls.y);
            const x = (screenPos.x - scrollX) * zoom;
            const y = (screenPos.y - scrollY) * zoom;

            const flickerMult = this.getFlickerMultiplier(
              ls.flicker,
              ls.flickerSpeed,
              ls.flickerIntensity,
              i * 1000,
            );

            this.drawLightGlow(
              ctx,
              x,
              y,
              ls.color,
              ls.size * zoom,
              ls.spread * zoom,
              ls.intensity * darknessOpacity, // Scale by darkness so lights are visible
              flickerMult,
            );
          }
        }

        if (hasPlayerLight) {
          const centerX = width / 2;
          const centerY = height / 2;

          const flickerMult = this.getFlickerMultiplier(
            playerLight.flicker,
            playerLight.flickerSpeed,
            playerLight.flickerIntensity,
            999,
          );

          this.drawLightGlow(
            ctx,
            centerX,
            centerY,
            playerLight.color,
            playerLight.size * zoom,
            playerLight.spread * zoom,
            playerLight.intensity * darknessOpacity,
            flickerMult,
          );
        }

        ctx.globalCompositeOperation = "source-over";
      }
    } // End of if (darknessOpacity > 0)

    // Draw light source markers (editor indicators) - always show when enabled
    ctx.globalCompositeOperation = "source-over";
    if (hasLightSources && this.showMarkers) {
      this.drawLightSourceMarkers(ctx, lightSources, scrollX, scrollY, zoom);
    }

    return this.lightCanvas;
  }

  /**
   * Draw a hole in the darkness (using destination-out)
   */
  drawLightHole(ctx, x, y, size, spread, intensity, flickerMult = 1.0) {
    const effectiveIntensity = Math.min(1, intensity * flickerMult);
    const innerRadius = size * 32;
    const outerRadius = (size + spread) * 32;

    if (outerRadius <= 0) return;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);

    // Center is fully transparent (cuts through darkness completely)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${effectiveIntensity})`);

    // Transition at inner radius
    const midRatio = Math.min(0.99, innerRadius / outerRadius);
    gradient.addColorStop(
      midRatio,
      `rgba(255, 255, 255, ${effectiveIntensity * 0.7})`,
    );

    // Edge fades to no cut
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw a colored light glow
   */
  drawLightGlow(ctx, x, y, color, size, spread, intensity, flickerMult = 1.0) {
    const rgb = this.hexToRgb(color);
    const effectiveIntensity = Math.min(0.5, intensity * flickerMult * 0.3);
    const innerRadius = size * 32;
    const outerRadius = (size + spread) * 32;

    if (outerRadius <= 0 || effectiveIntensity <= 0) return;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);

    gradient.addColorStop(
      0,
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${effectiveIntensity})`,
    );

    const midRatio = Math.min(0.99, innerRadius / outerRadius);
    gradient.addColorStop(
      midRatio,
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${effectiveIntensity * 0.5})`,
    );

    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw light source markers (editor indicators)
   */
  drawLightSourceMarkers(ctx, lightSources, scrollX, scrollY, zoom) {
    for (let i = 0; i < lightSources.length; i++) {
      const ls = lightSources[i];
      const screenPos = this.tileToScreen(ls.x, ls.y);
      const x = (screenPos.x - scrollX) * zoom;
      const y = (screenPos.y - scrollY) * zoom;

      // Draw a distinctive marker icon
      this.drawMarkerIcon(ctx, x, y, ls.color, zoom);
    }
  }

  /**
   * Draw a single light source marker icon
   */
  drawMarkerIcon(ctx, x, y, color, zoom) {
    const size = 16 * zoom; // Base marker size
    const rgb = this.hexToRgb(color);

    // Draw outer glow ring
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
    ctx.fill();

    // Draw main circle
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 200, 50, 0.9)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 150, 0, 1)`;
    ctx.lineWidth = 2 * zoom;
    ctx.stroke();

    // Draw inner bright spot
    ctx.beginPath();
    ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, 1)`;
    ctx.fill();

    // Draw sun rays
    const rayCount = 8;
    const innerRadius = size * 0.7;
    const outerRadius = size * 1.1;
    ctx.strokeStyle = `rgba(255, 200, 50, 0.8)`;
    ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const x1 = x + Math.cos(angle) * innerRadius;
      const y1 = y + Math.sin(angle) * innerRadius;
      const x2 = x + Math.cos(angle) * outerRadius;
      const y2 = y + Math.sin(angle) * outerRadius;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  }

  /**
   * Update animation time for flicker effects
   */
  update(time, _delta) {
    this.time = time;

    // Check if any lights have flicker enabled
    const hasFlicker =
      (this.lightingState.playerLight?.flicker &&
        this.lightingState.playerLight?.enabled) ||
      this.lightingState.lightSources?.some((ls) => ls.flicker);

    if (hasFlicker) {
      this.dirty = true;
    }
  }

  /**
   * Destroy resources
   */
  destroy() {
    if (this.renderTexture) {
      this.renderTexture.destroy();
      this.renderTexture = null;
    }
    this.lightCanvas = null;
    this.lightCtx = null;
  }
}
