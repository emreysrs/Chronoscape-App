// OpenAI Vision API Service
// To use this, set OPENAI_API_KEY in your environment variables or .env file

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE";

// Historical location data for better AI prompts
const LOCATION_HISTORY: Record<string, { name: string; historicalInfo: Record<number, string> }> = {
  Isfahan: {
    name: "Si-o-se-pol Bridge, Isfahan, Iran",
    historicalInfo: {
      1600: "newly constructed during Safavid era, pristine condition, bustling with merchants and travelers, traditional Persian architecture at its peak",
      1700: "Safavid golden age, ornate decorations, busy bazaar activities, traditional clothing, horse-drawn carriages",
      1800: "Qajar period, some wear on stones, traditional tea houses along the bridge, oil lamps for night illumination",
      1900: "early 20th century, mix of traditional and early modern elements, first photographs era",
      1950: "mid-century, before major urbanization, traditional lifestyle still dominant",
    }
  },
  London: {
    name: "Tower Bridge, London, UK",
    historicalInfo: {
      1600: "no bridge yet, wooden structures along Thames, Tudor era London, sailing ships",
      1700: "Georgian London, no Tower Bridge, old London Bridge visible, sailing vessels",
      1800: "Victorian era beginning, industrial revolution, steam ships, no Tower Bridge yet",
      1894: "Tower Bridge just completed, Victorian Gothic style, steam-powered bascules, horse carriages",
      1900: "Edwardian era, gas lamps, early automobiles mixing with horse carriages",
      1950: "post-war London, rebuilding era, classic British cars, fog and smog",
    }
  }
};

// Generate historical version of current view using AI
export async function generateHistoricalView(
  currentImageUri: string,
  location: "Isfahan" | "London",
  targetYear: number
): Promise<{ imageUrl: string | null; description: string }> {
  const locationData = LOCATION_HISTORY[location];
  
  // Find closest historical info
  const years = Object.keys(locationData.historicalInfo).map(Number).sort((a, b) => a - b);
  let closestYear = years[0];
  for (const year of years) {
    if (year <= targetYear) {
      closestYear = year;
    }
  }
  const historicalContext = locationData.historicalInfo[closestYear] || "historical period";

  const prompt = `Create a highly realistic historical photograph showing ${locationData.name} as it would have appeared in the year ${targetYear}. 
Style: Authentic ${targetYear < 1900 ? "painted illustration or early photograph" : targetYear < 1950 ? "vintage sepia photograph" : "mid-century color photograph"}.
Historical context: ${historicalContext}.
Include period-appropriate: architecture, clothing on people, transportation, lighting (${targetYear < 1880 ? "oil lamps/candles" : targetYear < 1920 ? "gas lamps" : "electric lights"}), atmosphere.
Make it photorealistic and historically accurate. Show the passage of time through architectural details, surrounding environment, and human activity.`;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1792", // Portrait orientation for mobile
          quality: "hd",
          style: "natural",
        }),
      }
    );

    const data = await response.json();

    if (data.data && data.data[0]) {
      const description = generateHistoricalDescription(location, targetYear, historicalContext);
      return {
        imageUrl: data.data[0].url,
        description: description,
      };
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Historical Image Generation Error:", error);
    // Return fallback description without image
    return {
      imageUrl: null,
      description: generateHistoricalDescription(location, targetYear, historicalContext),
    };
  }
}

function generateHistoricalDescription(location: string, year: number, context: string): string {
  if (location === "Isfahan") {
    if (year < 1650) {
      return `Si-o-se-pol (${year}): The bridge stands in its early glory during the Safavid Empire. Shah Abbas I's architectural masterpiece serves as both crossing and gathering place. ${context}`;
    } else if (year < 1800) {
      return `Si-o-se-pol (${year}): The 33-arch bridge continues to be the heart of Isfahan's social life. Tea houses beneath the arches bustle with poets, merchants, and travelers. ${context}`;
    } else if (year < 1920) {
      return `Si-o-se-pol (${year}): Centuries of footsteps have worn the stones smooth. The bridge has witnessed empires rise and fall, yet remains Isfahan's beloved landmark. ${context}`;
    } else {
      return `Si-o-se-pol (${year}): Traditional life flows around the ancient bridge. The Zayandeh River still runs beneath its arches as it has for centuries. ${context}`;
    }
  } else {
    if (year < 1886) {
      return `Thames River (${year}): Tower Bridge does not yet exist. The area shows ${year < 1800 ? "Georgian London with sailing ships" : "Victorian London preparing for industrialization"}. ${context}`;
    } else if (year < 1894) {
      return `Tower Bridge Construction (${year}): The iconic bridge is being built. Workers and engineers create what will become London's most recognizable landmark. ${context}`;
    } else if (year < 1950) {
      return `Tower Bridge (${year}): The Victorian Gothic masterpiece stands proud over the Thames. ${year < 1920 ? "Gas lamps illuminate the bridge at night" : "The bridge has survived the Blitz"}. ${context}`;
    } else {
      return `Tower Bridge (${year}): Post-war London rebuilds around its iconic landmark. The bridge continues to open for tall ships passing through. ${context}`;
    }
  }
}

export async function analyzeImageWithAI(
  imageUri: string,
  mode: "archaeological" | "speculative",
  year: number
): Promise<string> {
  try {
    // Convert image to base64 if needed
    const base64Image = await convertImageToBase64(imageUri);

    const prompt =
      mode === "archaeological"
        ? `You are an expert archaeologist and historian. Analyze this image and describe what this location might have looked like in ${year}. Focus on architectural styles, urban planning, and historical context. Be specific and educational. Keep response under 150 words.`
        : `You are a futurologist and urban planner. Based on this image, project what this location might look like in ${year}. Consider climate change, technological advancement, sustainable development, and societal trends. Be realistic and based on current scientific projections. Keep response under 150 words.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }

    throw new Error("No response from AI");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Fallback response
    if (mode === "archaeological") {
      return `Historical reconstruction - ${year}\n\nThis location shows architectural features typical of the ${
        year < 1850 ? "early" : year < 1900 ? "mid" : "late"
      } ${Math.floor(year / 100)}th century. Based on the visible structures and urban layout, this area likely featured classical architectural elements with ${
        year < 1900 ? "ornate details and traditional building materials" : "early industrial influences"
      }.`;
    } else {
      return `Speculative projection - ${year}\n\nFuture scenario showing ${
        year < 2040
          ? "incremental sustainable improvements"
          : year < 2060
          ? "significant climate adaptation measures"
          : "advanced sustainable urban development"
      }. The area would likely feature ${
        year < 2050
          ? "solar integration and green roofs"
          : "vertical gardens, advanced materials, and climate-resilient design"
      }. Population and climate trends suggest enhanced density with improved quality of life.`;
    }
  }
}

async function convertImageToBase64(uri: string): Promise<string> {
  // For now, return the URI directly
  // In production, you'd convert the image to base64
  return uri;
}

// Alternative: Generate image with DALL-E
export async function generateHistoricalImage(
  prompt: string
): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      }
    );

    const data = await response.json();

    if (data.data && data.data[0]) {
      return data.data[0].url;
    }

    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
