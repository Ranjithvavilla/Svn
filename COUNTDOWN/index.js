let countEl = document.getElementById("hello-el");
let prevEl = document.getElementById("prev-el");
 let count =0;
 function increment(){
    count+=1;
    countEl.innerText=count;
 }
 function save(){
    prevEl.innerText+=count+" "+"-";
    countEl.innerText=0;
    count=0;

 }