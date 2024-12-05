import axios from "axios";
import fs from "fs";
import jsYaml from "js-yaml";

const LANGS_FILEPATH = "./src/common/languageColors.json";
const CUSTOM_LANGS_FILEPATH = "./src/common/customLanguageColors.json";

// Retrieve languages from GitHub linguist repository YAML file
axios
  .get(
    "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml",
  )
  .then((response) => {
    // Convert them to a JS Object
    const languages = jsYaml.load(response.data);

    const languageColors = {};

    // Filter only language colors from the whole file
    Object.keys(languages).forEach((lang) => {
      languageColors[lang] = languages[lang].color;
    });

    // Read custom language colors from JSON file
    const customLanguageColors = JSON.parse(
      fs.readFileSync(CUSTOM_LANGS_FILEPATH, "utf8"),
    );

    // Merge custom colors with default colors
    Object.keys(customLanguageColors).forEach((lang) => {
      languageColors[lang] = customLanguageColors[lang];
    });

    // Write the merged language colors to the output file
    fs.writeFileSync(
      LANGS_FILEPATH,
      JSON.stringify(languageColors, null, "    "),
    );
  });
