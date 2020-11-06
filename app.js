const form = document.querySelector(".sidebar form");
const input = document.querySelector(".sidebar input");
const apiKey="668e3d39d52a645e064391881ef3df01"
function DateNow(){
    let presentday = new Date();
    let day = String(presentday.getDate()).padStart(2, '0');
    let month = String(presentday.getMonth() + 1).padStart(2, '0'); //January is 0!
    let year = presentday.getFullYear();
    return "("+month+"/"+day+"/"+year+")"
}
function KtoF(value){
    return ((value-273.15)*1.8)+32
  }