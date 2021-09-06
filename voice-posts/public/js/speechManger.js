/**
 *
 * This file contains the main logic for the speech stuff.
 * This file depends on the p5 library
 *
 * @author Shadi Jiha
 * @date 05 Sept. 2021
 */

const Speech = new p5.SpeechRec("en-US", executeResult);
Speech.start(true);

// I am not a big fan of global variables but
// Because of time constraint no choice
let paused = false;

async function executeResult() {

    /**
     * @var string
     */
    const result = Speech.resultString;
    console.log(result);


    if (exact(result, "pause|stop|listening")) {
        pause();
    }
    if (exact(result, "resume|listen|unpause")) {
        unpause();
    }

    // If the speech is paused exit
    if (paused) {
        return;
    }

    if (has(result, "navigate|go to|goto")) {
        let href = undefined;
        if (has(result, "index|home"))
            href = "/";
        else if (has(result, "login"))
            href = "/login";
        else if (has(result, "register"))
            href = "/register";
        else if (has(result, "create"))
            href = "/create";

        if (href)
            window.location.href = href;
    }

    if (has(result, "enter|type")) {
        // If the speech if of form
        // --> Enter DATA in FIELD
        // The reson these and "and" here is because during testing the speech
        // Was confusing the word in sometimes with and
        if (result.match(/\w+\b.*\b(in|and)\s\w+/)) {
            const tokens = result.replace(/(enter|type)/g, "").split("in").filter(e => e !== "");
            let data = tokens[0].trim();
            const domNameOrId = tokens[1].trim();

            // Get the DOM By name or ID
            let DOM = document.getElementsByName(domNameOrId.replaceAll(" ", "_"))[0]
                || document.getElementById(domNameOrId.replaceAll(" ", "-"));

            // if the field is email
            // This is a specific case
            if (has(domNameOrId, "email")) {
                data = data.replace(/\bat\b/g, "@").replaceAll(" ", "");
            }

            // Assuming that dom will be an input
            if (DOM)
                DOM.value = data;
        }
    }

    if (has(result, "filter|filter by|filterby")) {
        // The filter is gonna be of format
        // filter COLUMN VALUE
        const queryRegex = "(filter( )?by|filter)";
        const column = result.replace(new RegExp(queryRegex), "").trim().split(" ")[0];

        const value = result.replace(new RegExp(queryRegex + "|" + column, "g"), "").trim();
        window.location.href = `/?filter=${column}.${value}`;
    }

    if (has(result, "submit")) {
        const DOM = document.querySelector('input[type="submit"]')
            || document.querySelector('button[type="submit"]')
        DOM?.click();
    }

    if (has(result, "new post|create post")) {
        window.location.href = "/create";
    }

    if (has(result, "logout|exit")) {
        document.getElementById("logout-link").click();
    }

    if (has(result, "read|repost")) {
        /****************** Reading by author *******************/
        if (has(result, "repost|read post by|read posts by")) {
            const author = result.replace(/(repost|read post(s?)) by/g, "").trim();

            const allTitles = document.querySelectorAll(`h3[data-author="${author.toLowerCase()}"]`);
            for (const title of allTitles) {
                await readText(title.innerText + " by " + author);

                const e = document.querySelector(`p[data-title="${title.innerText.toLowerCase()}"]`);
                await readText(e.innerText);
            }

            return;
        }

        /****************** Reading by title *******************/
            // The format will be:
            // --> read TITLE
        const title = without(result, "read");
        readText(document.querySelector(`p[data-title="${title.toLowerCase()}"]`).innerText);
    }

    if (exact(result, "back|go back")) {
        window.history.back();
    }
}

async function readText(text) {
    let speak = await fetch("https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" + encodeURIComponent(text.trim()));

    if (speak.status != 200) {
        alert(await speak.text());
        return;
    }

    let mp3 = await speak.blob();
    let blobUrl = URL.createObjectURL(mp3);
    document.getElementById("source").setAttribute("src", blobUrl);
    let audio = document.getElementById("audio");

    document.body.click();
    audio.pause();
    audio.load();
    await audio.play();
    await sleep(audio.duration * 1000);
}

/**
 * Updates the UI to inform the user that the microphone is paused
 * @returns {boolean} Return true
 */
function pause() {
    paused = true;
}

/**
 *  Updates the UI to inform the user that the microphone is running
 * @returns {boolean} false
 */
function unpause() {
    paused = false;
}

/***********************************
 * @param string
 * @param substring
 * @returns {boolean} True if the string contains any of the words delimited by | (or)
 */
const has = (string, substring) => {
    const tokens = substring.split("|");
    for (const e of tokens) {
        if (string.includes(e) && e !== "") {
            return true;
        }
    }
    return false;
}

/***********************************
 * @param string
 * @param string2
 * @returns {boolean} True if the string match exactly any of the words delimited by | (or)
 */
const exact = (string, string2) => {
    const tokens = string2.split("|");
    for (const e of tokens) {
        if (string === e && e !== "") {
            return true;
        }
    }
    return false;
}

const without = (string, blacklist) => {
    const array = blacklist.split("|");
    for (const black of array) {
        string = string.replace(black, "");
    }
    return string.trim();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
