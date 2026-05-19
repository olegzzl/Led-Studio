// app.js

const ledPanel = document.getElementById('led-panel');
const tempSlider = document.getElementById('temp-slider');
const hueSlider = document.getElementById('hue-slider');
const brightSlider = document.getElementById('bright-slider');

const tempVal = document.getElementById('temp-val');
const hueVal = document.getElementById('hue-val');
const brightVal = document.getElementById('bright-val');

const btnStrobe = document.getElementById('btn-strobe');
const btnBlink = document.getElementById('btn-blink');

// Active mode: 'temp' (Color Temperature) or 'spectrum' (Rainbow spectrum)
let activeMode = 'temp';

// Preset engine state variables
let currentPreset = null;
let presetInterval = null;

// Marquee state variables
let marqueeActive = false;
let marqueeX = 0;
let marqueeAnimFrame = null;

// Helper function to calculate RGB for color temperature
// 0 on slider -> 6500K (Daylight White)
// 100 on slider -> 2000K (Warm-Warm-Yellow)
function getTempColor(tempValue) {
    const t = tempValue / 100;
    const r = 255;
    // Linearly interpolate green from 255 to 150 (glowing warm yellow-orange)
    const g = Math.round(255 - t * 105);
    // Linearly interpolate blue from 255 to 50 (deep warm amber-yellow)
    const b = Math.round(255 - t * 205);
    return `rgb(${r}, ${g}, ${b})`;
}

// A helper to safely update ledPanel innerHTML without destroying the control panel in fullscreen
function setLedHTML(html) {
    let contentWrapper = document.getElementById('led-content-wrapper');
    if (!contentWrapper) {
        contentWrapper = document.createElement('div');
        contentWrapper.id = 'led-content-wrapper';
        contentWrapper.style.width = '100%';
        contentWrapper.style.height = '100%';
        contentWrapper.style.position = 'absolute';
        contentWrapper.style.top = '0';
        contentWrapper.style.left = '0';
        contentWrapper.style.pointerEvents = 'none';
        
        const aside = document.querySelector('aside');
        Array.from(ledPanel.childNodes).forEach(node => {
            if (node !== aside) {
                ledPanel.removeChild(node);
            }
        });
        ledPanel.insertBefore(contentWrapper, ledPanel.firstChild);
    }
    contentWrapper.innerHTML = html;
}

// Clean up any running preset animations and reset buttons
function clearActivePreset() {
    let wasActive = false;
    
    if (presetInterval) {
        clearInterval(presetInterval);
        presetInterval = null;
        wasActive = true;
    }
    if (currentPreset !== null) wasActive = true;
    currentPreset = null;
    
    // Stop marquee if active
    if (marqueeActive) {
        stopMarquee();
        wasActive = true;
    }
    marqueeActive = false;
    
    // Only modify the DOM if a preset was actually running
    if (wasActive) {
        // Restore the LED panel clean layout
        setLedHTML('');
        ledPanel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Reset active styles on all preset buttons
        const presetButtons = document.querySelectorAll('#presets-container button');
        presetButtons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
            btn.classList.add('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
        });
    }
}

// Preset 1: Police (Полиция) - Alternating red and blue double-flash strobe
function startPolicePreset() {
    clearActivePreset();
    currentPreset = 'police';
    
    // Highlight button
    document.getElementById('preset-police').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-police').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    // Set panel background to solid black so transparent parts are off
    ledPanel.style.backgroundColor = '#000000';
    
    // Setup side-by-side splits
    setLedHTML(`
        <div class="w-full h-full flex" style="transition: none;">
            <div class="w-1/2 h-full" id="police-left" style="transition: none;"></div>
            <div class="w-1/2 h-full" id="police-right" style="transition: none;"></div>
        </div>
    `);
    
    const left = document.getElementById('police-left');
    const right = document.getElementById('police-right');
    
    let step = 0;
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        ledPanel.style.opacity = baseOpacity;
        
        // 8-step cycle for realistic cruiser lights
        if (step < 4) {
            // Left flashes red on step 0 and 2, solid black on 1 and 3
            const isRed = (step === 0 || step === 2);
            left.style.backgroundColor = isRed ? '#FF0000' : '#000000';
            right.style.backgroundColor = '#000000';
            ledPanel.style.setProperty('--glow-color', isRed ? `rgba(255, 0, 0, ${baseOpacity * 0.4})` : 'transparent');
        } else {
            // Right flashes blue on step 4 and 6, solid black on 5 and 7
            const isBlue = (step === 4 || step === 6);
            left.style.backgroundColor = '#000000';
            right.style.backgroundColor = isBlue ? '#0000FF' : '#000000';
            ledPanel.style.setProperty('--glow-color', isBlue ? `rgba(0, 0, 255, ${baseOpacity * 0.4})` : 'transparent');
        }
        
        step = (step + 1) % 8;
    }, 75);
}

// Preset 2: Tech (Техника) - Soft orange hazard warn flashes
function startTechPreset() {
    clearActivePreset();
    currentPreset = 'tech';
    
    document.getElementById('preset-tech').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-tech').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    ledPanel.style.backgroundColor = 'rgb(255, 140, 0)';
    let time = 0;
    
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        // Smooth hazard warning style sine-wave pulse (from 0.1 to 1.0)
        const pulse = 0.1 + 0.9 * Math.abs(Math.sin(time));
        ledPanel.style.opacity = baseOpacity * pulse;
        ledPanel.style.setProperty('--glow-color', `rgba(255, 140, 0, ${baseOpacity * pulse * 0.5})`);
        time += 0.12;
    }, 50);
}

// Preset 3: Candle (Свеча) - Flicker warm golden ambient flame
function startCandlePreset() {
    clearActivePreset();
    currentPreset = 'candle';
    
    document.getElementById('preset-candle').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-candle').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    ledPanel.style.backgroundColor = 'rgb(255, 160, 20)';
    
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        // Rapid random flame flicker simulation between 60% and 100% intensity
        const flicker = 0.6 + Math.random() * 0.4;
        ledPanel.style.opacity = baseOpacity * flicker;
        ledPanel.style.setProperty('--glow-color', `rgba(255, 160, 20, ${baseOpacity * flicker * 0.5})`);
    }, 80);
}

// Preset 4: TV (ТВ) - Cold blue-purple cinematic lighting with sharp shifts, rapid micro-flicker and slow decay
function startTvPreset() {
    clearActivePreset();
    currentPreset = 'tv';
    
    document.getElementById('preset-tv').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-tv').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    // Initial color
    let targetR = 100, targetG = 150, targetB = 255;
    let curR = 100, curG = 150, curB = 255;
    let targetOpacity = 0.8;
    let curOpacity = 0.8;
    
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        
        // Randomly trigger sharp shifts representing cuts and fast movement (about once a second)
        if (Math.random() < 0.08) {
            const type = Math.random();
            if (type < 0.35) {
                // Cool Cinematic Blue/Cyan (Action scenes)
                targetR = 120 + Math.random() * 80;
                targetG = 160 + Math.random() * 70;
                targetB = 255;
                targetOpacity = 0.4 + Math.random() * 0.6;
            } else if (type < 0.60) {
                // Sky Blue/Teal (Daylight scenes)
                targetR = 60 + Math.random() * 70;
                targetG = 110 + Math.random() * 80;
                targetB = 210 + Math.random() * 45;
                targetOpacity = 0.3 + Math.random() * 0.6;
            } else if (type < 0.75) {
                // Cozy Warm Amber/Orange reflection (Indoor scene cuts)
                targetR = 200 + Math.random() * 55;
                targetG = 110 + Math.random() * 70;
                targetB = 50 + Math.random() * 60;
                targetOpacity = 0.45 + Math.random() * 0.45;
            } else if (type < 0.90) {
                // Cinematic Dark/Shadows (Night scenes/Suspense)
                targetR = 20 + Math.random() * 30;
                targetG = 20 + Math.random() * 30;
                targetB = 60 + Math.random() * 40;
                targetOpacity = 0.15 + Math.random() * 0.3;
            } else {
                // Bright flash (Camera flash, explosion, transition)
                targetR = 240 + Math.random() * 15;
                targetG = 240 + Math.random() * 15;
                targetB = 255;
                targetOpacity = 0.85 + Math.random() * 0.15;
            }
        }
        
        // Linear interpolation to make transitions natural and slow down (decays smoothly)
        // We use faster interpolation (0.15 for colors, 0.12 for opacity) for sudden dramatic scene cuts
        curR += (targetR - curR) * 0.15;
        curG += (targetG - curG) * 0.15;
        curB += (targetB - curB) * 0.15;
        curOpacity += (targetOpacity - curOpacity) * 0.12;
        
        // Apply a rapid micro-flicker representing picture motion and camera jitter
        const microFlicker = 0.85 + Math.random() * 0.22; // 85% to 107%
        const finalOpacity = Math.max(0.05, Math.min(1.0, baseOpacity * curOpacity * microFlicker));
        
        ledPanel.style.backgroundColor = `rgb(${Math.round(curR)}, ${Math.round(curG)}, ${Math.round(curB)})`;
        ledPanel.style.opacity = finalOpacity;
        ledPanel.style.setProperty('--glow-color', `rgba(${Math.round(curR)}, ${Math.round(curG)}, ${Math.round(curB)}, ${finalOpacity * 0.5})`);
    }, 60);
}

// Preset 5: Party (Пати) - Random vibrant flashes with random timing
function startPartyPreset() {
    clearActivePreset();
    currentPreset = 'party';
    
    document.getElementById('preset-party').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-party').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    let nextChange = 0;
    let curHue = 0;
    
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        
        if (Date.now() > nextChange) {
            // Pick a brand new vibrant hue from the rainbow spectrum
            curHue = Math.random() * 360;
            // Party timing: fast and slow flashes blended (from 150ms to 900ms)
            const duration = 150 + Math.random() * 750;
            nextChange = Date.now() + duration;
        }
        
        ledPanel.style.backgroundColor = `hsl(${curHue}, 100%, 50%)`;
        ledPanel.style.opacity = baseOpacity;
        ledPanel.style.setProperty('--glow-color', `hsla(${curHue}, 100%, 50%, ${baseOpacity * 0.5})`);
    }, 50);
}

// Preset 6: Fire (Огонь) - Flickering campfire simulation with deep red and orange sparks
function startFirePreset() {
    clearActivePreset();
    currentPreset = 'fire';
    
    document.getElementById('preset-fire').classList.add('bg-primary', 'text-on-primary', 'border-primary');
    document.getElementById('preset-fire').classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-outline-variant');
    
    presetInterval = setInterval(() => {
        const baseOpacity = brightSlider.value / 100;
        
        // Campfire HSL: Red-Orange Hue 0° to Golden Yellow Hue 38°
        const hue = Math.random() * 38;
        const saturation = 90 + Math.random() * 10;
        const lightness = 38 + Math.random() * 25; // flickering flames
        
        ledPanel.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ledPanel.style.opacity = baseOpacity * (0.75 + Math.random() * 0.25);
        ledPanel.style.setProperty('--glow-color', `hsla(${hue}, ${saturation}%, ${lightness}%, ${baseOpacity * 0.5})`);
    }, 90);
}

// Refined Accordion Logic
function toggleAccordion(id) {
    const content = document.getElementById('content-' + id);
    const chevron = document.getElementById('chevron-' + id);
    
    if (content && chevron) {
        const isCollapsed = content.classList.contains('collapsed');
        
        // Toggle classes
        if (isCollapsed) {
            content.classList.remove('collapsed');
            chevron.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            chevron.classList.add('collapsed');
        }
    }
}

// Initialize accordion states
window.addEventListener('DOMContentLoaded', () => {
    ['equalizer', 'presets', 'library', 'marquee'].forEach(id => {
        const content = document.getElementById('content-' + id);
        const chevron = document.getElementById('chevron-' + id);
        if(content && chevron) {
            content.classList.add('collapsed');
            chevron.classList.add('collapsed');
        }
    });
});

let isStrobe = false;
let isBlink = false;

function updateLED() {
    if (marqueeActive) return; // Keep marquee active

    const temp = parseInt(tempSlider.value);
    const hue = parseInt(hueSlider.value);
    const brightness = parseInt(brightSlider.value);

    // Calculate real-time color temperature in Kelvin (6500K down to 2000K)
    const kelvin = Math.round(6500 - (temp * 45));
    
    // Update numerical indicators in real time
    tempVal.textContent = kelvin + ' K';
    hueVal.textContent = hue + '°';
    brightVal.textContent = brightness + '%';

    let baseColor;
    
    if (activeMode === 'temp') {
        // Highlight active slider/label
        tempSlider.parentElement.style.opacity = '1';
        hueSlider.parentElement.style.opacity = '0.5';
        baseColor = getTempColor(temp);
    } else {
        tempSlider.parentElement.style.opacity = '0.5';
        hueSlider.parentElement.style.opacity = '1';
        baseColor = `hsl(${hue}, 100%, 50%)`;
    }

    // Apply color and brightness (opacity) to the panel
    ledPanel.style.backgroundColor = baseColor;
    ledPanel.style.opacity = brightness / 100;
    
    // Update glow shadow color matching the active light state
    const glowOpacity = (brightness / 100) * 0.5;
    let rgbaGlow;
    if (activeMode === 'temp') {
        const t = temp / 100;
        rgbaGlow = `rgba(255, ${Math.round(255 - t * 105)}, ${Math.round(255 - t * 205)}, ${glowOpacity})`;
    } else {
        rgbaGlow = baseColor.replace('hsl', 'hsla').replace(')', `, ${glowOpacity})`);
    }
    ledPanel.style.setProperty('--glow-color', rgbaGlow);
}

// Marquee Logic (Бегущая строка)
function startMarquee() {
    clearActivePreset();
    marqueeActive = true;
    
    // Highlight Play button and unhighlight Stop
    document.getElementById('btn-marquee-start').classList.add('bg-primary', 'text-on-primary');
    document.getElementById('btn-marquee-start').classList.remove('bg-surface-container-high', 'text-primary');
    document.getElementById('btn-marquee-stop').classList.remove('bg-primary', 'text-on-primary');
    document.getElementById('btn-marquee-stop').classList.add('bg-surface-container-high', 'text-on-surface-variant');
    
    const textVal = document.getElementById('marquee-text').value.trim() || "LED STUDIO";
    
    // Set up LED matrix container and overlay inside the panel
    setLedHTML(`
        <div class="led-matrix-container" id="marquee-container" style="background-color: #000000;">
            <div class="led-matrix-text" id="marquee-scroller"></div>
            <div class="led-matrix-overlay"></div>
        </div>
    `);
    
    const scroller = document.getElementById('marquee-scroller');
    scroller.textContent = textVal;
    
    // Initial position: right edge of the panel
    marqueeX = ledPanel.offsetWidth || 768;
    
    updateMarqueeParams();
    
    if (marqueeAnimFrame) {
        cancelAnimationFrame(marqueeAnimFrame);
    }
    
    function scrollLoop() {
        if (!marqueeActive) return;
        
        const speed = parseFloat(document.getElementById('marquee-speed-slider').value);
        marqueeX -= (speed * 0.7); // Scroll speed factor
        
        // Wrap around when text leaves completely
        if (marqueeX < -scroller.offsetWidth) {
            marqueeX = ledPanel.offsetWidth || 768;
        }
        
        scroller.style.transform = `translate3d(${marqueeX}px, 0, 0)`;
        marqueeAnimFrame = requestAnimationFrame(scrollLoop);
    }
    
    marqueeAnimFrame = requestAnimationFrame(scrollLoop);
}

function stopMarquee() {
    marqueeActive = false;
    if (marqueeAnimFrame) {
        cancelAnimationFrame(marqueeAnimFrame);
        marqueeAnimFrame = null;
    }
    
    // Reset buttons styling
    document.getElementById('btn-marquee-start').classList.remove('bg-primary', 'text-on-primary');
    document.getElementById('btn-marquee-start').classList.add('bg-surface-container-high', 'text-primary');
    document.getElementById('btn-marquee-stop').classList.add('bg-primary', 'text-on-primary');
    document.getElementById('btn-marquee-stop').classList.remove('bg-surface-container-high', 'text-on-surface-variant');
}

function updateMarqueeParams() {
    if (!marqueeActive) return;
    
    const scroller = document.getElementById('marquee-scroller');
    const container = document.getElementById('marquee-container');
    if (!scroller || !container) return;
    
    // Text size slider
    const textSize = parseInt(document.getElementById('marquee-text-size-slider').value);
    document.getElementById('marquee-text-size-val').textContent = textSize + 'px';
    scroller.style.fontSize = textSize + 'px';
    
    // Text color slider
    const textHue = parseInt(document.getElementById('marquee-text-color-slider').value);
    let textColor;
    if (textHue === 0) {
        textColor = '#FFFFFF';
        document.getElementById('marquee-text-color-val').textContent = '#FFFFFF';
    } else {
        textColor = `hsl(${textHue}, 100%, 50%)`;
        document.getElementById('marquee-text-color-val').textContent = `HSL ${textHue}°`;
    }
    scroller.style.color = textColor;
    
    // Background color slider
    const bgHue = parseInt(document.getElementById('marquee-bg-color-slider').value);
    let bgColor;
    if (bgHue === 0) {
        bgColor = '#000000';
        document.getElementById('marquee-bg-color-val').textContent = '#000000';
    } else {
        bgColor = `hsl(${bgHue}, 100%, 6%)`; // Deep rich dark glowing color
        document.getElementById('marquee-bg-color-val').textContent = `HSL ${bgHue}°`;
    }
    container.style.backgroundColor = bgColor;
    
    // Speed indicator
    const speed = parseFloat(document.getElementById('marquee-speed-slider').value);
    document.getElementById('marquee-speed-val').textContent = speed.toFixed(1) + 'x';
    
    // General shadow glow
    ledPanel.style.setProperty('--glow-color', textColor.replace('hsl', 'hsla').replace(')', ', 0.3)'));
}

// Local Canvas video recorder engine (no permission required, runs 100% locally)
function saveMarqueeVideo() {
    const textInput = document.getElementById('marquee-text').value.trim() || "LED STUDIO";
    const saveBtn = document.getElementById('btn-marquee-save-video');
    const originalContent = saveBtn.innerHTML;
    
    // Set recording state
    saveBtn.innerHTML = `
        <svg class="w-4 h-4 animate-spin text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H12v4"></path></svg>
        <span class="font-label-sm uppercase font-bold text-[11px]">Запись (5с)...</span>
    `;
    saveBtn.disabled = true;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    
    // Capture stream
    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks = [];
    
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `led-marquee-${Date.now()}.webm`;
        a.click();
        
        // Restore button state
        saveBtn.innerHTML = originalContent;
        saveBtn.disabled = false;
    };
    
    // Read current colors and size
    const textSize = parseInt(document.getElementById('marquee-text-size-slider').value);
    const textHue = parseInt(document.getElementById('marquee-text-color-slider').value);
    const textColor = textHue === 0 ? '#FFFFFF' : `hsl(${textHue}, 100%, 50%)`;
    
    const bgHue = parseInt(document.getElementById('marquee-bg-color-slider').value);
    const bgColor = bgHue === 0 ? '#000000' : `hsl(${bgHue}, 100%, 6%)`;
    
    const speed = parseFloat(document.getElementById('marquee-speed-slider').value);
    
    // Animate canvas
    let x = canvas.width;
    let recordingActive = true;
    
    function drawFrame() {
        if (!recordingActive) return;
        
        // 1. Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Draw text
        ctx.fillStyle = textColor;
        ctx.font = "900 " + textSize + "px 'Outfit', 'Inter', sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(textInput.toUpperCase(), x, canvas.height / 2);
        
        // 3. Draw LED Dot Grid Overlay
        ctx.fillStyle = "rgba(19, 19, 19, 0.95)";
        const dotSpacing = 6;
        const dotRadius = 2.6; // Increased from 2.0 to make pixels larger and brighter
        
        for (let py = 0; py < canvas.height; py += dotSpacing) {
            for (let px = 0; px < canvas.width; px += dotSpacing) {
                ctx.beginPath();
                ctx.arc(px + dotSpacing/2, py + dotSpacing/2, dotRadius, 0, Math.PI * 2);
                ctx.rect(px + dotSpacing, py, -dotSpacing, dotSpacing);
                ctx.fill();
            }
        }
        
        // Increment scroll position
        x -= (speed * 0.7);
        const textWidth = ctx.measureText(textInput.toUpperCase()).width;
        if (x < -textWidth) {
            x = canvas.width;
        }
        
        requestAnimationFrame(drawFrame);
    }
    
    // Start recording
    recorder.start();
    drawFrame();
    
    // Stop recording after 5 seconds
    setTimeout(() => {
        recordingActive = false;
        recorder.stop();
    }, 5000);
}

// Event Listeners to switch modes and update display in real time
tempSlider.addEventListener('input', () => {
    clearActivePreset();
    activeMode = 'temp';
    updateLED();
});

hueSlider.addEventListener('input', () => {
    clearActivePreset();
    activeMode = 'spectrum';
    updateLED();
});

brightSlider.addEventListener('input', () => {
    // Real-time brightness adjustment for presets
    if (!currentPreset && !marqueeActive) {
        updateLED();
    }
});

btnStrobe.addEventListener('click', () => {
    clearActivePreset();
    isStrobe = !isStrobe;
    isBlink = false;
    ledPanel.classList.remove('animate-blink');
    btnBlink.classList.remove('bg-primary', 'text-on-primary');
    
    if (isStrobe) {
        ledPanel.classList.add('animate-strobe');
        btnStrobe.classList.add('bg-primary', 'text-on-primary');
    } else {
        ledPanel.classList.remove('animate-strobe');
        btnStrobe.classList.remove('bg-primary', 'text-on-primary');
    }
});

btnBlink.addEventListener('click', () => {
    clearActivePreset();
    isBlink = !isBlink;
    isStrobe = false;
    ledPanel.classList.remove('animate-strobe');
    btnStrobe.classList.remove('bg-primary', 'text-on-primary');

    if (isBlink) {
        ledPanel.classList.add('animate-blink');
        btnBlink.classList.add('bg-primary', 'text-on-primary');
    } else {
        ledPanel.classList.remove('animate-blink');
        btnBlink.classList.remove('bg-primary', 'text-on-primary');
    }
});

// Wire interactive preset buttons
document.getElementById('preset-police').addEventListener('click', startPolicePreset);
document.getElementById('preset-tech').addEventListener('click', startTechPreset);
document.getElementById('preset-candle').addEventListener('click', startCandlePreset);
document.getElementById('preset-tv').addEventListener('click', startTvPreset);
document.getElementById('preset-party').addEventListener('click', startPartyPreset);
document.getElementById('preset-fire').addEventListener('click', startFirePreset);

// Wire Marquee events
document.getElementById('btn-marquee-start').addEventListener('click', startMarquee);
document.getElementById('btn-marquee-stop').addEventListener('click', stopMarquee);

document.getElementById('marquee-speed-slider').addEventListener('input', updateMarqueeParams);
document.getElementById('marquee-text-size-slider').addEventListener('input', updateMarqueeParams);
document.getElementById('marquee-text-color-slider').addEventListener('input', updateMarqueeParams);
document.getElementById('marquee-bg-color-slider').addEventListener('input', updateMarqueeParams);

document.getElementById('btn-marquee-save-video').addEventListener('click', saveMarqueeVideo);

// Fullscreen and Control Panel logic
let asideParent = null;
let asideNextSibling = null;
const asideElement = document.querySelector('aside');

let isDraggingInsideAside = false;

if (asideElement) {
    asideElement.addEventListener('mousedown', () => { isDraggingInsideAside = true; });
    asideElement.addEventListener('touchstart', () => { isDraggingInsideAside = true; }, { passive: true });
}

document.addEventListener('mouseup', () => { setTimeout(() => { isDraggingInsideAside = false; }, 0); });
document.addEventListener('touchend', () => { setTimeout(() => { isDraggingInsideAside = false; }, 0); });

// Double-click to toggle fullscreen mode
ledPanel.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        ledPanel.requestFullscreen().then(() => {
            if (asideElement) {
                asideParent = asideElement.parentNode;
                asideNextSibling = asideElement.nextSibling;
                asideElement.style.position = 'absolute';
                asideElement.style.right = '0';
                asideElement.style.top = '0';
                asideElement.style.height = '100%';
                asideElement.style.zIndex = '1000';
                asideElement.style.display = 'none'; // Hidden initially
                ledPanel.appendChild(asideElement);
            }
        }).catch(err => {
            console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && asideParent && asideElement) {
        // Restore aside
        asideElement.style.position = '';
        asideElement.style.right = '';
        asideElement.style.top = '';
        asideElement.style.height = '';
        asideElement.style.zIndex = '';
        asideElement.style.display = '';
        asideParent.insertBefore(asideElement, asideNextSibling);
        asideParent = null;
        asideNextSibling = null;
    }
});

// Auto-hide control panel if window becomes too narrow (mobile portrait)
window.addEventListener('resize', () => {
    if (document.fullscreenElement && asideElement && window.innerWidth < 768) {
        if (asideElement.style.display === 'flex') {
            asideElement.style.display = 'none';
        }
    }
});

// Single tap/click on screen reveals control panel in fullscreen
ledPanel.addEventListener('click', (e) => {
    if (document.fullscreenElement && asideElement) {
        if (isDraggingInsideAside) return;
        
        // Ignore clicks inside the aside panel
        if (asideElement.contains(e.target)) return;
        
        if (asideElement.style.display === 'none') {
            // Only show if the screen is wide enough (>= 768px)
            // This prevents the control panel from taking 100% width and trapping the user on mobile portrait
            if (window.innerWidth >= 768) {
                asideElement.style.display = 'flex';
            }
        } else {
            asideElement.style.display = 'none';
        }
    }
});

// Initial draw
updateLED();
