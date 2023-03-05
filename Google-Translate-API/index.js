
const { json } = require('body-parser');
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
let translatedAfter;
const port = process.env.PORT ||3090;
app.use(bodyParser.json());
app.use(cors());
let targetLanguage="en";
let sourceLang="en";

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

//Recieve send translated text
app.post("", async (req, res) => {
    const { textToTr, targetLang, sourceLang } = req.body;
    console.log(textToTr + "texttotr");
    try {
      const response = await translateText(textToTr, targetLang, sourceLang);
      const translatedText = `${response}`;
      console.log(translatedText);
      res.json({
        data: translatedText,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while translating text.");
    }
  });
    
  // Detect source language
const detectLanguage = async (text) => {
    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
}

//Translator method
const translateText = async (text, targetLanguage) => {
    try {
      let [response] = await translate.translate(text,targetLanguage);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
    }
  };

  //Test
translateText(' ناوت چیە', 'en')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

    //Port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
 });
