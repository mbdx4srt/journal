const {li} = require("./loremipsum")
async function bl() {
    const tx =  await li()
   return (tx)
}

bl().then(x => console.log(x))