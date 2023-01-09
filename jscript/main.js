/* optionally stop use of back button in order to maintain javascript 
   variable states limiting application use to buttons */

/*
        function disableBack() { window.history.forward(); }
        setTimeout("disableBack()", 0);
        window.onunload = function () { null };
*/



/* general variables */


/* special attention to myDatabase which is stored in local storage of the browser and has to be accessed via a stringify method  */

let myDatabase=[];  /* load as empty array if not currently in existence */
myDatabase = JSON.parse(localStorage.getItem("myDatabase") || "[]");

/* line to be used when storing updates to myDatabase
localStorage.setItem("myDatabase", JSON.stringify(myDatabase));  */

let itemNumber;
let addClickCount=0;
let dataObj=Object.create(Object.prototype);
let nameValue="";
let divID="";



/* Define constants referencing DOM nodes */

const main_pageRef=document.querySelector("#main_page_container");
const new_contact_pageRef=document.querySelector("#new_contact_container");
const view_contacts_pageRef=document.querySelector("#view_contacts_container");
const view_Contactsdiv=document.querySelector("#view_contacts");
const savedItemsRef=document.querySelector("#savedItems");
const newItemRef=document.querySelector("#addNew");
const addItemRef=document.querySelector("#newItemDiv");
const newItemHeaderRef=document.querySelector("#newItemHeader");
const fbtn2Ref=document.querySelector("#fbtn2");
const fbtn1Ref=document.querySelector("#fbtn1");
const mainForm=document.querySelector("#newContact");


/*
const dref=document.querySelector("#btn");
const bref=document.querySelector(".b");
const ddref=document.querySelector("#view_contacts_container");

bref.addEventListener("click",()=>{alert("it works")});
let h=dref.innerHTML;
ddref.insertAdjacentHTML("afterbegin",h);
console.log(ddref.innerHTML);
console.log(addItemRef);*/

/* event listener for Save button of contact addition screen */

fbtn2Ref.addEventListener("click",()=>{

    /*  validate form data alert if errors */

    /* now fill data object and push to local array */

    let formObj=new FormData(mainForm);
    nameValue=formObj.get('name');
    console.log(nameValue);
    myDatabase.push([nameValue,Array.from(formObj)]);
    /* update local storage copy */
    localStorage.setItem("myDatabase", JSON.stringify(myDatabase)); 

    savedItemsRef.textContent=`View Contacts(${myDatabase.length})`;
 /*   console.log(mainForm);
    console.log(...formObj);*/
    let v=myDatabase[0];
    v=Array.from(v);
    console.log(v);


    /*console.log(myDatabase.length);*/
    

    

    
})

/* eventlistener for Return button of save contact screen  */

fbtn1Ref.addEventListener('click',()=>{
 /*  new_contact_pageRef.classList.add('hidemainmenu');
   main_pageRef.classList.remove('hidemainmenu');*/
 /*  addItemRef.classList.add("hideMainMenu");
   main_pageRef.classList.remove("showItemdiv");*/
   new_contact_pageRef.classList.remove("show_page2");
   main_pageRef.classList.remove("hide_page1");
})

/* eventlistener for div click view contacts of main screen */

view_Contactsdiv.addEventListener('click',()=>{
    main_pageRef.classList.add("hide_page1");
    view_contacts_pageRef.classList.add("show_page3");

    /* load main viewing div with generated html and add event listeners */

    divString=``;

    myDatabase.forEach((element,index) => {
           divID="A"+index;
           nameValue=element[0];
           console.log(divID,nameValue);

          /* create a template string for use in dynamic html creation */

 /*          htmlString=`<div class="contactDiv" id="${divID}"><h3 class="nameString">${nameValue}</h3></div>`;*/
           htmlString=`<div class="contactDiv" id="${divID}"><h3 id="A${divID}">${nameValue}</h3></div>`;

           console.log(htmlString);
           divString=divString+htmlString;
    });
    
    view_contacts_pageRef.innerHTML="";
    view_contacts_pageRef.insertAdjacentHTML("afterbegin",divString);

    /* now iterate through all create and inserted divs and attach listener */

    for ( i=0; i<(myDatabase.length);i++){

        divID="#A"+i;
        tempRef=document.querySelector(divID);
        console.log(tempRef);
        str=divID+" clicked";
        tempRef.addEventListener('click',(e)=>{
            alert(e.target.getAttribute('id')+str)});

    }
    /* add a listener to parent div to catch all click events */

    /*view_contacts_pageRef.addEventListener('click',(e)=>{
        console.log(e.target.getAttribute('id'));
        console.log(e);
    });*/
    
    
})

newItemRef.addEventListener("click",(event)=>{
    console.log(event.target.getAttribute('id'));
    main_pageRef.classList.add("hide_page1");
    console.log(main_pageRef.classList);
    console.log(new_contact_pageRef);    
    new_contact_pageRef.classList.add("show_page2");
    console.log(new_contact_pageRef.classlist);
    addClickCount++;
/*if (addClickCount & 0x01){newItemHeaderRef.textContent="Close Item Entry Panel"}
else
{ newItemHeaderRef.textContent="Add New Media Item"}*/

});

/*
console.log("hello world");
console.log(savedItemsRef.innerHTML);
savedItemsRef.textContent=savedItemsRef.textContent+'('+`${myDatabase.length}`+')';*/
