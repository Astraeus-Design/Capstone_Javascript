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
let arrivingFromMain=false;    /* used to determine operation mode of screen */
let arrivingFromContacts=false; /* as per variable above */
let viewMode=true;              /* used to determine view or delete mode */
let pageID="main";             /* used to allow main header as back button */


/* Define constants referencing DOM nodes */

const main_pageRef=document.querySelector("#main_page_container");
const new_contact_pageRef=document.querySelector("#new_contact_container");
const view_contacts_pageRef=document.querySelector("#view_contacts_container");
const contacts_dynamicDiv=document.querySelector("#contact_divs_container");
const titleHdrRef=document.querySelector("#maintitle");
const viewMode_divRef=document.querySelector("#deleteDiv");

const view_Contactsdiv=document.querySelector("#view_contacts");
const savedContactsHdr=document.querySelector("#savedContactsHdr");
/*const savedItemsRef=document.querySelector("#savedItems");*/
const newItemRef=document.querySelector("#addNew");
const addItemRef=document.querySelector("#newItemDiv");
const newItemHeaderRef=document.querySelector("#newItemHeader");
const fbtn2Ref=document.querySelector("#fbtn2");
const fbtn1Ref=document.querySelector("#fbtn1");
const mainForm=document.querySelector("#newContact");



/*****************************************************************************/
/*                                                                           */
/*        General functions for use with event listeners                     */
/*                                                                           */
/*****************************************************************************/

function copyArrayData(direction,dbIndex){


  if (direction==='fromDatabase'){ 

    mainForm.elements['contactName'].value=myDatabase[dbIndex][1][0][1];
    mainForm.elements['mobile'].value=myDatabase[dbIndex][1][1][1];
    mainForm.elements['landline'].value=myDatabase[dbIndex][1][2][1];
    mainForm.elements['email1'].value=myDatabase[dbIndex][1][3][1];
    mainForm.elements['email2'].value=myDatabase[dbIndex][1][4][1];
    mainForm.elements['linkedin'].value=myDatabase[dbIndex][1][5][1];
    mainForm.elements['facebook'].value=myDatabase[dbIndex][1][6][1];
    mainForm.elements['birthday'].value=myDatabase[dbIndex][1][7][1];


  }
  else if(direction==='toDatabase'){

    myDatabase[dbIndex][1][0][1]=mainForm.elements['contactName'].value;
    myDatabase[dbIndex][1][1][1]=mainForm.elements['mobile'].value;
    myDatabase[dbIndex][1][2][1]=mainForm.elements['landline'].value;
    myDatabase[dbIndex][1][3][1]=mainForm.elements['email1'].value;
    myDatabase[dbIndex][1][4][1]=mainForm.elements['email2'].value;
    myDatabase[dbIndex][1][5][1]=mainForm.elements['linkedin'].value;
    myDatabase[dbIndex][1][6][1]=mainForm.elements['facebook'].value;
    myDatabase[dbIndex][1][7][1]=mainForm.elements['birthday'].value;

    /* update copy of local storage when database written */
  }

  
}


/****************************************************************************/
/*                                                                          */
/*  Event listener for main header div to act as back button                */
/*                                                                          */
/****************************************************************************/


titleHdrRef.addEventListener('click',(e)=>{

  console.log("titleheadref");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));

  if (pageID=="view"){
       console.log(new_contact_pageRef.classlist,main_pageRef.classlist);
 
       new_contact_pageRef.classList.remove("show_page2");
       main_pageRef.classList.remove("hide_page1");
       pageID="main";
  }
  else if (pageID=="contact"){
      view_contacts_pageRef.classList.remove("show_page3");
      main_pageRef.classList.remove("hide_page1");
      pageID="main";

  };


});


/****************************************************************************/
/*                                                                          */
/*        Event listener for main screen new contact                        */
/*                                                                          */
/****************************************************************************/


/* add event listener for main screen div click "add new contact" */


newItemRef.addEventListener('click',(e)=>{

  console.log("newitemref");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));

    console.log(e.target.getAttribute('id'));
    main_pageRef.classList.add("hide_page1");
    console.log(main_pageRef.classList);
    console.log(new_contact_pageRef);    
    new_contact_pageRef.classList.add("show_page2");
    addClickCount++;
    arrivingFromMain=true;
    pageID="view";
/*if (addClickCount & 0x01){newItemHeaderRef.textContent="Close Item Entry Panel"}
else
{ newItemHeaderRef.textContent="Add New Media Item"}*/

});


/* add event listener for main page "View contacts"         */
/* eventlistener for div click view contacts of main screen */



/****************************************************************************/
/*                                                                          */
/*          Event listener for main screen view contacts                    */
/*                                                                          */
/****************************************************************************/

view_Contactsdiv.addEventListener('click',(e)=>{

  console.log("contactdivsref");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));

    main_pageRef.classList.add("hide_page1");
    view_contacts_pageRef.classList.add("show_page3");
    pageID="contact";
    arrivingFromMain=false;
    arrivingFromContacts=true;

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
    
    contacts_dynamicDiv.innerHTML="";
    contacts_dynamicDiv.insertAdjacentHTML("afterbegin",divString);

    /* now iterate through all create and inserted divs and attach listener */

   /* for ( i=0; i<(myDatabase.length);i++){

        divID="#A"+i;
        tempRef=document.querySelector(divID);
        console.log(tempRef);
        str=divID+" clicked";
        tempRef.addEventListener('click',(e)=>{
            alert(e.target.getAttribute('id')+str)
        
        
        
        
        
        
        
        });

    }*/
    /* add a listener to parent div to catch all click events */

    view_contacts_pageRef.addEventListener('click',(e)=>{

      console.log("view_contacts");  /* id marker for testing */
      console.log(e.target.getAttribute('id'));

        targetID=e.target.getAttribute('id');
        if((targetID==='deleteDiv')||(targetID==='deleteHeader')){
          console.log("triggered by div click");

      /*this event listener catches all child events of contacts div container*/

         if (viewMode){
           /*set style of button via toggle of class */
 
            viewMode_divRef.classList.toggle("deleteToggle");
            viewMode_divRef.textContent="Delete Mode";
            viewMode=false;   /* indicates now in delete mode */
         }
         else{
 
          /*set style of button via toggle of class */
 
           viewMode_divRef.classList.toggle("deleteToggle");
           viewMode_divRef.textContent="View Mode";
           viewMode=true;   /* indicates now in delete mode */          


          };
        }
        else{
        targetID=targetID.replace(/A/g,'');
        
        /* set values for form ready for viewing and editing */

        mainForm.elements['contactName'].value=myDatabase[targetID][1][0][1];
        mainForm.elements['mobile'].value=myDatabase[targetID][1][1][1];
        mainForm.elements['landline'].value=myDatabase[targetID][1][2][1];
        mainForm.elements['email1'].value=myDatabase[targetID][1][3][1];
        mainForm.elements['email2'].value=myDatabase[targetID][1][4][1];
        mainForm.elements['linkedin'].value=myDatabase[targetID][1][5][1];
        mainForm.elements['facebook'].value=myDatabase[targetID][1][6][1];
        mainForm.elements['birthday'].value=myDatabase[targetID][1][7][1];
        
        console.log(view_contacts_pageRef.classList,new_contact_pageRef.classList);
        view_contacts_pageRef.classList.remove("show_page3");
        new_contact_pageRef.classList.add("show_page2");
        arrivingFromContacts=true;
        pageID="view";
        /*console.log(myDatabase[targetID][1]);*/
        }
    });
    
    
});


/****************************************************************************/
/*                                                                          */
/*        Event listener for Save button of edit                            */
/*                                                                          */
/****************************************************************************/

fbtn2Ref.addEventListener('click',(e)=>{

    /*  validate form data alert if errors */

    /* now fill data object and push to local array */

    console.log("btn2ref");  /* id marker for testing */
    console.log(e.target.getAttribute('id'));

    let formObj=new FormData(mainForm);
    nameValue=formObj.get('name');
    console.log(nameValue);
    myDatabase.push([nameValue,Array.from(formObj)]);
    /* update local storage copy */
    localStorage.setItem("myDatabase", JSON.stringify(myDatabase)); 

    savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;
 /*   console.log(mainForm);
    console.log(...formObj);*/
    let v=myDatabase[0];
    v=Array.from(v);
    console.log(v);


    /*console.log(myDatabase.length);*/
    

    

    
});

/* eventlistener for Return button of save contact screen  */

/****************************************************************************/
/*                                                                          */
/*        Event listener for Return button of edit                          */
/*                                                                          */
/****************************************************************************/

fbtn1Ref.addEventListener('click',(e)=>{

  console.log("btn1ref");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));

  if(arrivingFromMain){
   new_contact_pageRef.classList.remove("show_page2");
   main_pageRef.classList.remove("hide_page1");
   arrivingFromMain=false;
   pageID="main";
  }
  else if(arrivingFromContacts){
    new_contact_pageRef.classList.remove("show_page2");
    view_contacts_pageRef.classList.add("show_page3");
    arrivingFromContacts=false;
    pageID="contact";
  };
});



/****************************************************************************/
/*                                                                          */
/*        Event listener for contact screen view/delete mode div            */
/*                                                                          */
/****************************************************************************/

/*viewMode_divRef.addEventListener('click',()=>{

/* if clicked toggle state between view and delete mode setting flags */
/*   console.log("i'm clicked");
  if (viewMode){
       /*set style of button via toggle of class */

/*       viewMode_divRef.classList.toggle("deleteToggle");
       viewMode_divRef.textContent="Delete Mode";
       viewMode=false;   /* indicates now in delete mode */
  /*}
  else{

       /*set style of button via toggle of class */

/*       viewMode_divRef.classList.toggle("deleteToggle");
       viewMode_divRef.textContent="View Mode";
       viewMode=true;   /* indicates now in delete mode */

/*  };

  });


/*   on entry to script update label to indicate number of contacts */

savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;

