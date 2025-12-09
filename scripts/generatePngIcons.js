const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG content for app icon
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="50%" style="stop-color:#FFA500"/>
      <stop offset="100%" style="stop-color:#DAA520"/>
    </linearGradient>
    <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#F4E4BA"/>
      <stop offset="100%" style="stop-color:#D4A574"/>
    </linearGradient>
    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.35)"/>
      <stop offset="50%" style="stop-color:rgba(255,255,255,0.15)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.25)"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGradient)"/>
  
  <!-- Subtle glow behind hourglass -->
  <ellipse cx="512" cy="512" rx="280" ry="320" fill="rgba(255,215,0,0.1)"/>
  
  <!-- Hourglass centered in icon -->
  <g transform="translate(312, 162) scale(4)">
    <!-- Top frame bar -->
    <rect x="15" y="5" width="70" height="8" rx="2" fill="url(#goldGradient)"/>
    <rect x="18" y="7" width="64" height="2" fill="#FFF8DC" opacity="0.5"/>
    
    <!-- Bottom frame bar -->
    <rect x="15" y="117" width="70" height="8" rx="2" fill="url(#goldGradient)"/>
    <rect x="18" y="119" width="64" height="2" fill="#FFF8DC" opacity="0.5"/>
    
    <!-- Left frame connectors -->
    <rect x="18" y="13" width="6" height="10" fill="url(#goldGradient)"/>
    <rect x="18" y="107" width="6" height="10" fill="url(#goldGradient)"/>
    
    <!-- Right frame connectors -->
    <rect x="76" y="13" width="6" height="10" fill="url(#goldGradient)"/>
    <rect x="76" y="107" width="6" height="10" fill="url(#goldGradient)"/>
    
    <!-- Glass body - top bulb -->
    <path d="M24 23 Q24 55, 50 65 Q76 55, 76 23 L76 20 Q76 18, 74 18 L26 18 Q24 18, 24 20 Z" 
          fill="url(#glassGradient)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    
    <!-- Glass body - bottom bulb -->
    <path d="M24 107 Q24 75, 50 65 Q76 75, 76 107 L76 110 Q76 112, 74 112 L26 112 Q24 112, 24 110 Z" 
          fill="url(#glassGradient)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    
    <!-- Sand in top -->
    <path d="M28 28 Q28 48, 50 58 Q50 58, 50 58 Q72 48, 72 28 L72 25 L28 25 Z" 
          fill="url(#sandGradient)" opacity="0.7"/>
    
    <!-- Sand stream -->
    <rect x="48" y="58" width="4" height="14" fill="#D4A574" opacity="0.8"/>
    
    <!-- Sand in bottom -->
    <path d="M30 105 Q30 90, 50 80 Q70 90, 70 105 L70 108 L30 108 Z" 
          fill="url(#sandGradient)" opacity="0.9"/>
    
    <!-- Decorative gems -->
    <circle cx="50" cy="9" r="3" fill="#E74C3C"/>
    <circle cx="35" cy="9" r="2" fill="#3498DB"/>
    <circle cx="65" cy="9" r="2" fill="#3498DB"/>
    <circle cx="50" cy="121" r="3" fill="#E74C3C"/>
    <circle cx="35" cy="121" r="2" fill="#3498DB"/>
    <circle cx="65" cy="121" r="2" fill="#3498DB"/>
    
    <!-- Shine effects -->
    <path d="M30 30 Q32 45, 40 50" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30 100 Q32 90, 38 85" stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
</svg>
`;

const assetsDir = path.join(__dirname, '..', 'assets');
const iosIconsDir = path.join(__dirname, '..', 'ios', 'Chronoscape', 'Images.xcassets', 'AppIcon.appiconset');

// iOS icon sizes needed
const iosSizes = [
  { size: 1024, name: 'icon-1024.png' },
];

// Expo/React Native icon sizes
const expoSizes = [
  { size: 1024, name: 'icon.png' },
  { size: 1024, name: 'adaptive-icon.png' },
];

async function generateIcons() {
  console.log('Generating app icons...\n');
  
  const svgBuffer = Buffer.from(svgContent);
  
  // Generate Expo icons
  for (const { size, name } of expoSizes) {
    const outputPath = path.join(assetsDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }
  
  // Generate iOS App Store icon
  const iosIconPath = path.join(iosIconsDir, 'App-Store-Icon.png');
  if (fs.existsSync(iosIconsDir)) {
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(iosIconPath);
    console.log(`✓ Generated iOS App Store Icon (1024x1024)`);
  }
  
  console.log('\n✅ All icons generated successfully!');
  console.log('\nNote: For iOS, you may need to update the Contents.json in AppIcon.appiconset');
}

generateIcons().catch(console.error);
