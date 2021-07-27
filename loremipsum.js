//import { LoremIpsum } from "lorem-ipsum";
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});


async function li () {
    tx = await lorem.generateParagraphs(3)
    return (tx)
}


module.exports = {li}