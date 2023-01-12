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
let refIndex=0;                /* for use in saving a viewed contact */
let firstTimeVisit=true;       /* used to indicate when first visit contacts */
let timerRef;                  /* used to set and cancel general timer */
let mouseoverID="";            /* used to detect mouseover div identity */
let mouseoutID="";
let timerIDs=[];               /* keep reference array of timers to cancel */


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

/*****************************************************************************/
/*                                                                           */
/*         Function to bidirectionally copy data from database to form       */
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
    /* copy name field into first field of array, used for sorting */
    myDatabase[dbIndex][0]=mainForm.elements['contactName'].value;

    
  };

  
};

/*****************************************************************************/
/*                                                                           */
/*          Function to regenerate HTML for contacts list page               */
/*                                                                           */
/*****************************************************************************/


function regenHTML(){
  
  divString=``;

  myDatabase.forEach((element,index) => {
          divID="A"+index;
          nameValue=element[0];
          console.log(divID,nameValue);

         /* create a template string for use in dynamic html creation */

         /*          htmlString=`<div class="contactDiv" id="${divID}"><h3 class="nameString">${nameValue}</h3></div>`;*/
          if (index & 0x01){
          htmlString=`<div class="contactDiv oddDiv" id="${divID}"><h3 class="contactH3" id="A${divID}">${nameValue}</h3></div>`;
          }
          else{
            htmlString=`<div class="contactDiv evenDiv" id="${divID}"><h3 class="contactH3" id="A${divID}">${nameValue}</h3></div>`;           
          };

          console.log(htmlString);
          divString=divString+htmlString;
      });
   
   contacts_dynamicDiv.innerHTML="";
   contacts_dynamicDiv.insertAdjacentHTML("afterbegin",divString);
};

/*****************************************************************************/
/*                                                                           */
/*       Function to clear main form fields when editing new contact record  */
/*                                                                           */
/*****************************************************************************/

function clearFormfields(){

  mainForm.elements['contactName'].value="";
  mainForm.elements['mobile'].value="";
  mainForm.elements['landline'].value="";
  mainForm.elements['email1'].value="";
  mainForm.elements['email2'].value="";
  mainForm.elements['linkedin'].value="";
  mainForm.elements['facebook'].value="";
  mainForm.elements['birthday'].value="";
 
};


/*****************************************************************************/
/*                                                                           */
/*       Function to act as callback for contact form divs                   */
/*                                                                           */
/*****************************************************************************/

function contactDivClick(e){

  console.log("view_contacts");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));
  tempRef=e.target.classList;
  console.log(e.target.classList);

    targetID=e.target.getAttribute('id');
    if((targetID==='deleteDiv')||(targetID==='deleteHeader')){
      console.log("triggered by div click");

  /*this event listener catches all child events of contacts div container*/

     deletehdr=document.querySelector("#deleteHeader");

     if (viewMode){
       /*set style of button via toggle of class */
        console.log("in true");
        viewMode_divRef.classList.toggle("deleteToggle");
        deletehdr.textContent="Delete Mode";
        viewMode=false;   /* indicates now in delete mode */
     }
     else{

      /*set style of button via toggle of class */
       console.log("in false");
       viewMode_divRef.classList.toggle("deleteToggle");
       deletehdr.textContent="View Mode";
       viewMode=true;   /* indicates now in delete mode */          


      };

     }
     else if(tempRef.contains('contactDiv')||tempRef.contains('contactH3')){
        targetID=targetID.replace(/A/g,'');
    
        /* set values for form ready for viewing and editing */
        if (viewMode){

       /* if we are in view mode then show contact for viewing/editing */
    
           copyArrayData('fromDatabase',targetID);
/*        
    mainForm.elements['contactName'].value=myDatabase[targetID][1][0][1];
    mainForm.elements['mobile'].value=myDatabase[targetID][1][1][1];
    mainForm.elements['landline'].value=myDatabase[targetID][1][2][1];
    mainForm.elements['email1'].value=myDatabase[targetID][1][3][1];
    mainForm.elements['email2'].value=myDatabase[targetID][1][4][1];
    mainForm.elements['linkedin'].value=myDatabase[targetID][1][5][1];
    mainForm.elements['facebook'].value=myDatabase[targetID][1][6][1];
    mainForm.elements['birthday'].value=myDatabase[targetID][1][7][1];
*/        
          console.log(view_contacts_pageRef.classList,new_contact_pageRef.classList);
          view_contacts_pageRef.classList.remove("show_page3");
          new_contact_pageRef.classList.add("show_page2");
          arrivingFromContacts=true;
          pageID="view";
          refIndex=targetID;  /* use seperate global to indicate record to save in view screen */
          /*console.log(myDatabase[targetID][1]);*/
      }
      else{

         /*  request to delete contact record               */
         if (confirm(`Do you want to delete ${myDatabase[targetID][0]}?`)){

            /* remove contact record and update local storage also
               regenerate html for contacts page */

            myDatabase.splice(targetID,1);
            localStorage.setItem("myDatabase", JSON.stringify(myDatabase));

            savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;
            regenHTML();
        
            
         };
      };
    };
  };



/****************************************************************************/
/*                                                                          */
/*     Function to sort database array into alphabetical order              */
/*                                                                          */
/****************************************************************************/


function alphaSort(){ 

   myDatabase.sort((a,b)=>{
     if (a[0]>b[0]){

       return(1);
     }
     else if (a[0]<b[0]){
       return(-1);
     }

     return 0;
  });

};


/****************************************************************************/
/*                                                                          */
/*                 Function to handle mouseover event                       */
/*                                                                          */
/****************************************************************************/

function mouseover(e){
    /*console.log(e.target.classList);*/
    /*if (e.target.classList.contains('contactDiv')){*/
        
        mouseoverID=e.target.getAttribute('id');
        mouseoverID=mouseoverID.replace(/A/g,'');
        /*console.log(mouseoverID,timerIDs[mouseoverID]);*/
        timerIDs[mouseoverID]=setTimeout(displayFloatDiv,2500);
        console.log( "mouseover setting timer ",timerIDs[mouseoverID]);
   /* }*/


};

/****************************************************************************/
/*                                                                          */
/*                Function to handle mouse out event                        */
/*                                                                          */
/****************************************************************************/

function mouseout(e){

    /* cancel timer   */

    /*console.log(e.target.classList);*/

    /*if (e.target.classList.contains('contactDiv')){*/
        
        mouseoutID=e.target.getAttribute('id');
        mouseoutID=mouseoutID.replace(/A/g,'');
        /*console.log(mouseoverID,timerIDs[mouseoverID]);*/
        console.log("mouseout clearing timer ",timerIDs[mouseoverID]);
        if (mouseoutID===mouseoverID) clearTimeout(timerIDs[mouseoverID]);
    /*}*/

    /*console.log("mouseout");*/
    
    


};


/****************************************************************************/
/*                                                                          */
/*                Function to Create and display a floated div              */
/*                for use displaying contact details                        */
/*                                                                          */
/****************************************************************************/

function displayFloatDiv(){
  console.log(mouseoverID);
  console.log(myDatabase[mouseoverID]);
  console.log("floating div is ",mouseoverID);
  
};




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
    
    addClickCount++;
    arrivingFromMain=true;
    arrivingFromContacts=false;
    pageID="view";
    clearFormfields();
    new_contact_pageRef.classList.add("show_page2");

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

    regenHTML();

   

    /* now iterate through all create and inserted divs and attach listener */

   /* for ( i=0; i<(myDatabase.length);i++){

        divID="#A"+i;
        tempRef=document.querySelector(divID);
        console.log(tempRef);
        str=divID+" clicked";
        tempRef.addEventListener('click',(e)=>{
            alert(e.target.getAttribute('id')+str)
        
    
      });*/

    


    /* add a listener to parent div to catch all click events, assign once */
    
     if ( firstTimeVisit)  
     {
       view_contacts_pageRef.addEventListener('click',contactDivClick);

      /*now listener is assigned add a listener for mouseover and mouseout events */ /* future work in progress */
 /*      const contactDivref=document.querySelectorAll(".contactDiv");
       console.log(contactDivref);
       for( z in contactDivref){
              document.querySelector(z.getAttribute('id').addEventListener('mouseover',mouseover));
              document.querySelector(z.getAttribute('id').addEventListener('mouseout',mouseout));
              return;
        }*/
       
       firstTimeVisit=false; 
     }
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

    if (nameValue===''){

        alert("Contact name required");
    }
    else{
      if (arrivingFromContacts){
        /* overwrite current array data with any edited values */
        copyArrayData('toDatabase',refIndex); 
        alphaSort();
        /* update html to reflect any changes made to contact  */
        regenHTML();
      }
     else{
       /* push new record to array */
       myDatabase.push([nameValue,Array.from(formObj)]);

       /* sort database array alphabetically     */
       
       alphaSort();

       /* now clear form fields for new entry to be entered        */

       clearFormfields();

      };

      /* update local storage copy and screen contact count indicator */
      localStorage.setItem("myDatabase", JSON.stringify(myDatabase)); 
      savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;

      /* if we have arrived from contacts page then return after saving data */
    
      if (arrivingFromContacts){
       new_contact_pageRef.classList.remove("show_page2");
       view_contacts_pageRef.classList.add("show_page3");
       arrivingFromContacts=false;
       pageID="contact";

      }
    }

    
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





/*   on entry to script update label to indicate number of contacts */

savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;

