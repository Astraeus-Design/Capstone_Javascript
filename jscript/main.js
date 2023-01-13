/* optionally stop use of back button in order to maintain javascript 
   variable states and limiting application use to defined buttons */

/*
        function disableBack() { window.history.forward(); }
        setTimeout("disableBack()", 0);
        window.onunload = function () { null };
*/

/***************************************************************************/
/*                                                                         */
/*                             general variables                           */
/*                                                                         */
/***************************************************************************/

/* special attention to myDatabase which is stored in local storage of the browser and has to be accessed via a stringify method  */

let myDatabase=[];  /* load as empty array if not currently in existence */
myDatabase = JSON.parse(localStorage.getItem("myDatabase") || "[]");



let itemNumber;                             /* used with array referencing */
let addClickCount=0;                        /* general counter for testing */
let dataObj=Object.create(Object.prototype);/* a base object for use with DB */
let nameValue="";                           /* used for display purposes */
let divID="";                               /* used in html generation */
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


/* Define constants referencing DOM nodes classes and ID's from index.html */

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

    /* copy name field into first field of array for alphabetical sorting */

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

/*this event listener catches all child events of contacts div container*/

  console.log("view_contacts");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));
  tempRef=e.target.classList;
  console.log(e.target.classList);

  targetID=e.target.getAttribute('id');  
  if((targetID==='deleteDiv')||(targetID==='deleteHeader')){
      console.log("triggered by div click");

     /* this section handles the view/delete mode bar on contacts page */ 

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
       viewMode=true;   /* indicates now in view mode */          


      };

     }
     else if(tempRef.contains('contactDiv')||tempRef.contains('contactH3')){
        targetID=targetID.replace(/A/g,'');
    
        

        if (viewMode){

          /* if we are in view mode then show contact for viewing/editing */
    
           copyArrayData('fromDatabase',targetID);

          console.log(view_contacts_pageRef.classList,new_contact_pageRef.classList);
          view_contacts_pageRef.classList.remove("show_page3");
          new_contact_pageRef.classList.add("show_page2");
          arrivingFromContacts=true;
          pageID="view";
          refIndex=targetID;  /* use separate global to indicate record to save in view screen */
          
      }
      else{

         /*  request to delete contact record */

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


function alphaSort(){        /* this is in effect a bubble sort */

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
/*                 Function to handle mouseover event(experimental!!)       */
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
/*                Function to handle mouse out event(experimental!!)        */
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
/*                for use displaying contact details(experimental!!)        */
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

  if (pageID=="view"){             /* return to main page from view page */
       console.log(new_contact_pageRef.classlist,main_pageRef.classlist);
 
       new_contact_pageRef.classList.remove("show_page2");
       main_pageRef.classList.remove("hide_page1");
       pageID="main";

  }
  else if (pageID=="contact"){   /* return to main page from contacts page */
      view_contacts_pageRef.classList.remove("show_page3");
      main_pageRef.classList.remove("hide_page1");
      pageID="main";

  };


});


/****************************************************************************/
/*                                                                          */
/*        Event listener for main screen add new contact                    */
/*                                                                          */
/****************************************************************************/



newItemRef.addEventListener('click',(e)=>{

    console.log("newitemref");  /* id marker for testing */

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



/****************************************************************************/
/*                                                                          */
/*          Event listener for main screen show view contacts               */
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

   
    /* add a listener to parent div to catch all click events, assign only once */
    
     if ( firstTimeVisit)  
     {
       view_contacts_pageRef.addEventListener('click',contactDivClick);

      /* this section is experimental and currently removed */
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

    /*  validate form data alert if errors( at present just missing name ) */

    /* fill data object and push to local array */

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

       /* sort database array alphabetically and clear form fields   */
       
       alphaSort();
       clearFormfields();

      };

      /* update local storage copy and screen contact count indicator */

      localStorage.setItem("myDatabase", JSON.stringify(myDatabase)); 
      savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;

      /* if we have arrived from contacts page then return to contacts page after saving data */
    
      if (arrivingFromContacts){
       new_contact_pageRef.classList.remove("show_page2");
       view_contacts_pageRef.classList.add("show_page3");
       arrivingFromContacts=false;
       pageID="contact";

      }
    }

    
});


/****************************************************************************/
/*                                                                          */
/*        Event listener for Return button of contact page edit             */
/*                                                                          */
/****************************************************************************/

fbtn1Ref.addEventListener('click',(e)=>{

  console.log("btn1ref");  /* id marker for testing */
  console.log(e.target.getAttribute('id'));

  if(arrivingFromMain){                                /* return to main page */
   new_contact_pageRef.classList.remove("show_page2");
   main_pageRef.classList.remove("hide_page1");
   arrivingFromMain=false;
   pageID="main";
  }
  else if(arrivingFromContacts){                   /* return to contacts page */
    new_contact_pageRef.classList.remove("show_page2");
    view_contacts_pageRef.classList.add("show_page3");
    arrivingFromContacts=false;
    pageID="contact";
  };
});




/* code that runs outside of all eventlisteners */
/* On entry to script update label to indicate number of contacts on main page */

savedContactsHdr.textContent=`View Contacts(${myDatabase.length})`;

