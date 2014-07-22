var panels;
var loaded=false;
var color_on="#f8f8f8", color_off="#ff9900";


try{document.addEventListener('DOMContentLoaded', Initialize, false);}
catch(e){window.onload=Initialize;}
window.onscroll=OnScroll;

// helper func
function id(n){return document.getElementById(n);}
function getElementsByClass(className)
{
  if(document.getElementsByClassName)
    return document.getElementsByClassName(className);
  var res = [];
  var eles = document.body.getElementsByTagName("*");
  for(var i=0;i<eles.length; i++){
    if(eles[i].className && eles[i].className.indexOf(className)!=-1)
      res.push(eles[i]);
  }
  return res;
}

// change menu position
// css handles the positioning automatically
function OnScroll()
{
	return;
  if(window.pageYOffset>310)
  {
    if(id("menu_relative"))
      id("menu_relative").id="menu_fixed";
  }
  else
  {
    if(id("menu_fixed"))
      id("menu_fixed").id="menu_relative";
  }
}

// Initializer
function Initialize()
{
  if(loaded){window.scrollTo(0,0);return;}
  loaded=true;

  // do $$ latex processing
  var ts =getElementsByClass("latexembeder");
  for(var i =0; i<ts.length; i++)
  {
    var splits = ts[i].innerHTML.split("$");
    var editedhtml="";
    for(var j = 0; j<splits.length-1; j++)
    {
      if (j%2==1){
        var inner = "<img src='http://latex.codecogs.com/gif.latex?"+ splits[j] +"' class='latex' />";
        splits[j] = "<span class='dollarspan'>"+inner+"</span>";}
      editedhtml+=splits[j];
    }
    if(splits.length)editedhtml+=splits.pop();
    ts[i].innerHTML=editedhtml;
  }

  // build the panel objects
  panels = new Array();
  pushPanel("mis");
  pushPanel("cs");
  pushPanel("ideas");
  anc = location.hash;

  if(!anc.length){PanelSwitch(panels[0].id);return;}

  // detecting and expanding collapsible sections
  tags=anc.split("+");
  anc=tags[0];
  buts=getElementsByClass("colla_bigbut");
  for(var i=1; i<tags.length; i++)
  {
    for(j=0; j<buts.length; j++)
    {
      if(tags[i]==buts[j].id)
        collaSwitch(buts[j]);
    }
  }

  // detect the panel to be shown and show it
  for(var i = 0; i<panels.length; i++){
    if(anc=="#"+panels[i].id){
      PanelSwitch(panels[i].id);return;
    }
  }
}

function pushPanel(n)
{
  ele = id("p_"+n);
  ele.mbutton = id("m_"+n);
  ele.mbutton.mpanel=ele;
  ele.mshown = false;
  panels.push(ele);
}

//change hash section in URL when panel switches
function changeHash(hash)
{
  anc = location.hash;
  //hash = hash==panels[0].id? "":hash;
  if(!anc.length)
  {
    location.hash=hash;
    return;
  }
  tags=anc.split("+");
  for(var i=1; i<tags.length; i++)
    hash+="+"+tags[i];
  location.hash=hash;
}


//switch to a specific panel with id of n
function PanelSwitch(n)
{
  var shown = -1;
  var toshow= -1;
  var ele = id(n);
  // collapse all panels, and look for the panel to be switched to
  for(var i = 0; i<panels.length; i++)
  {
    if(panels[i].style.display=="block")
      shown = i;
    if(panels[i].id==n)
      toshow=i;
    panels[i].style.display="none";
    panels[i].mshown = false;
    panels[i].mbutton.style.backgroundColor=color_off;
    panels[i].mbutton.style.color=color_on;
    panels[i].mbutton.style.borderColor=color_on;
  }
  changeHash(n);
  ele.style.display="block";
  ele.mshown = true;
  ele.mbutton.style.backgroundColor=color_on;
  ele.mbutton.style.color=color_off;
}
//when mouse moves over menu button
function POV(but)
{
  but.style.backgroundColor="#FFB547";
  but.style.color=color_on;
}
//when mouse moves outta menu button
function POT(but)
{
  if(but.mpanel.mshown)
  {
    but.style.backgroundColor=color_on;
    but.style.color=color_off;
  }
  else
  {
    but.style.backgroundColor=color_off;
    but.style.color=color_on;
  }
}
//add collapsible section's tag to URL
function addTag(t)
{
  var exist = false;
  var tags=location.hash.split("+");
  for(var i in tags){
    if(t==tags[i])
      exist=true;
  }
  if(!exist)
    location.hash+="+"+t;
}
//remove collapsible section's tag from URL
function removeTag(t)
{
  if(!location.length)
  tags=location.hash.split("+");
  newhash=tags[0];
  for(var i=1; i<tags.length; i++){
    if(t==tags[i])
      continue;
    newhash+="+"+tags[i];
  }
  location.hash=newhash;
}
//open or close collapsible div
function collaSwitch(but)
{
  //but is the button of class colla_button. 
  //we shall look for colla_display and switch its state
  hidden = but.innerHTML=="Show More";
  display = but.parentElement.firstChild;
  while(!display.className || display.className.indexOf("colla_display")==-1)
    display = display.nextSibling;
  if(hidden)
  {
    display.style.display="block";
    but.innerHTML="Show Less";
    addTag(but.id);
  }
  else
  {
    display.style.display="none";
    but.innerHTML="Show More";
    removeTag(but.id);
  }
}
