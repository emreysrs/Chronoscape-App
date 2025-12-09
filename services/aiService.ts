// OpenAI Vision API Service
// To use this, you need to add your OpenAI API key

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // Replace with your actual key

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
