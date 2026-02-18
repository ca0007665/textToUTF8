// 我是作者
const lang = document.documentElement.getAttribute("lang");
var pro = false;
function checkmode(){
    const params = new URLSearchParams(window.location.search);
    const _pro = params.get("pro");
    pro = (_pro != null);
}
checkmode();
function escapeHTML(str){
    return str.replace(/[&<>"']/g, function(match){
        const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
        };
        return escapeMap[match];
    });
}
function textToHex(text){
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hexArray = Array.from(bytes, byte => 
        byte.toString(16).padStart(2, '0')
    );
    return hexArray.join('');
}
function hexToText(hexString){
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
}

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const encode = document.getElementById("encode");
const decode = document.getElementById("decode");

encode.addEventListener("click", Encode);
decode.addEventListener("click", Decode);
outputText.addEventListener("dblclick", Copy);

function Encode(){
    let input = inputText.value.trim();
    if(!pro)input = escapeHTML(input);
    const hexString = textToHex(input);
    outputText.innerHTML = hexString;
}
function Decode(){
    const input = inputText.value.trim();
    const cleanHex = input.replace(/\s+/g, '');
    if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
        throw new Error("Illegal character detected.");
    }
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Illegal length.");
    }   
    const text = hexToText(cleanHex);
    if(pro) outputText.textContent = text;
    else outputText.innerHTML = text;
}
function hint(text) {
    let tip = document.createElement("div");
    tip.textContent = text;
    tip.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        background: #eeeeeecc;
        color: black;
        padding: 10px;
        border-radius: 4px;
        z-index: 9999
    `;
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 2000);
}
function Copy(){
    navigator.clipboard.writeText(outputText.textContent).then(() => {
        const copy_successful = {
            "en-us": "Copy successful.",
            "zh-cn": "复制成功"
        };
        hint(copy_successful[lang]);
    }).catch(err => {
        hint("Error.");
    });
}
