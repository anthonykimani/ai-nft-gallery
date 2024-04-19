require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Function to generate image
const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 5, // Number of images to generate
        size: "1024x1024", // Size of the image
        response_format: "b64_json", // Returns the file itself, encoded as base64 JSON, this way we can directly save it
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// Function to save image to file
const saveImage = (imageData, index) => {
  const buffer = Buffer.from(imageData, "base64");
  fs.writeFileSync(`./african_leader_${index}.png`, buffer);
};

// Generate and save 10 images
const main = async () => {
  const imageData = await generateImage(
    "Cool pixel art NFT of popular african leaders"
  );
  for (let i = 0; i < 5; i++) {
    if (imageData) {
      saveImage(imageData.data[i].b64_json, i);
    }
  }
};

// Call the function to generate and save images
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
