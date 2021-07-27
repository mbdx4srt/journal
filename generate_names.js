const { uniqueNamesGenerator, adjectives, colors, animals } = require ("unique-names-generator")

function name ()
{
    const lowerCaseName = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        style: 'lowerCase'
    });
    return lowerCaseName
}

module.exports = {name};