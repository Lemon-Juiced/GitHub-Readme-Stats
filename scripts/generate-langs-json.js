import axios from "axios";
import fs from "fs";
import jsYaml from "js-yaml";

const LANGS_FILEPATH = "./src/common/languageColors.json";
const CUSTOM_LANGS_FILEPATH = "./src/common/customLanguageColors.json";

// Read custom language colors from JSON file
const customLanguageColors = JSON.parse(
  fs.readFileSync(CUSTOM_LANGS_FILEPATH, "utf8"),
);

const languageColors = { ...customLanguageColors };

// Retrieve languages from GitHub linguist repository YAML file
axios
  .get(
    "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml",
  )
  .then((response) => {
    // Convert them to a JS Object
    const languages = jsYaml.load(response.data);

    // Add colors from Linguist only if they do not conflict with custom colors
    Object.keys(languages).forEach((lang) => {
      if (!languageColors[lang]) {
        languageColors[lang] = languages[lang].color;
      }
    });

    // Write the merged language colors to the output file
    fs.writeFileSync(
      LANGS_FILEPATH,
      JSON.stringify(languageColors, null, "    "),
    );

    console.log("Language colors have been written to", LANGS_FILEPATH);
  })
  .catch((error) => {
    console.error("Error fetching or processing language colors:", error);
  });
