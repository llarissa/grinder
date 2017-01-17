'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function() {
    var nameInputList = $('#nameList').val();
    createList(nameInputList, 2, ['bla']).then(function(data) {
        //createList('List', 2, ['testlist', 'testlist1']).then(function (data) {
        console.log('createList', data);
        buildList(data);
    });
});




//neue Karte hinzufügen Button
function addCardButton() {
    //console.log('addCardButton');
   var addCard = $('<button>').text('add card...').attr('class', 'addCard');
   $('.context').append(addCard);
    $('.addCard').click(function(e) {
        console.log('addCardButton');
        var $col = $(e.target).closest('.column');
        var id = parseInt($col.attr('data-listid'));
        console.log('id ' + id);
        loadSingleList(id).then(function(data) {
                console.log('data ', data);

                var inputTextCard = $col.find('.inputCard').val();
                var cardDiv = $col.find('.cards');
                               
                if (!_.isArray(data.cards)) {
                    data.cards = [inputTextCard];
                } else {
                    data.cards.push(inputTextCard);
                }
                //cardDiv.append($('<div>').text(inputTextCard).attr('class', 'card'));
                return updateList(id, data.name, data.pos, data.cards);
                displayLists(lists);
            })
            .then(function(lists) {
                console.log(lists.cards);
                //displayLists(lists);
                
                

                // TODO: make sure the added card is visible in the user interface
            })
    })
    
}


//allow user to rename LIST
  $('#lists').delegate(".headline", "click", function(ev) {
    var $colli = $(ev.target).closest('.column');
    var id = parseInt($colli.attr('data-listid'));
    var input = $("<input>", {
        val: $(this).text(),
        type: "text",
    });
    input.attr('class', 'listRename');
    $(this).replaceWith(input);
    input.select();
    var saveButton = $('<button>').text('accept').attr('type','submit').attr('class', 'saveButton');
    var wrapListInput  = input.wrap("<div class='wrapListInput'></div>");
    //thisCard = $colli.closest('.wrapListInput');
    $('.wrapListInput').append(saveButton);
    
    

    $('.saveButton').click(function(data){
      var newListName = input.val();
      var saveAsh3 = input.replaceWith("<h3>" + newListName + "</h3>");
      $('.saveButton').remove();
      return updateList(id, newListName, data.pos, data.cards)
    })
    

  
})

//allow user to rename CARD
  $('#lists').delegate(".card", "click", function(ev) {
    var $colu = $(ev.target).closest('.column');
    var id = parseInt($colu.attr('data-listid'));
    var input = $("<input>", {
        val: $(this).text(),
        type: "text"
    });
      
    $(this).replaceWith(input);
    input.select();
    var inputDiv = input.wrap("<div class='wrapDiv'></div>");
    //var thatCard = $colu.find('.card');
    var saveButtonCard = $('<button>').text('accept').attr('type','submit').attr('class', 'saveButtonCard');
    $('.wrapDiv').append(saveButtonCard);

    

    $('.saveButtonCard').click(function(data){
        var cardName = input.val();
      var newCardName = $('<div>').text(input.val()).attr('class', 'card');
      inputDiv.replaceWith(newCardName);
     
      $('.saveButtonCard').remove();
      $('.card').unwrap();
     //var searchForIndex = $.inArray(cardName, data.cards);
      
      return updateList(id, data.name, data.pos, newCardName)
      })
          
  })

  $('.upButton').click(function(event){
      var currentCard = $(event.target).closest('.card');
      var prevCard = currentCard.prev();
      if(prevCard.length == 0)  // if card is already the topmost card
        return;
    $(event.target).insertBefore(prevCard);
    updateList(event.data.id, event.data.name, event.data.pos , data.cards)
  })
  
 $('.downButton').click(function (event) { 
     var currentCard = $(event.target).closest('.card');
      var nextCard = currentCard.next();
      if(nextCard.length == 0)  // if card is already the topmost card
        return;
    $(event.target).insertAfter(nextCard);
    updateList(event.data.id, event.data.name, event.data.pos , data.cards)
     
 })


// Dragula Drag & Drop
var drake = dragula([$('#lists').get(0)], {direction: 'horizontal'});

drake.on('dragend', function(el, target, source, sibling) {
  
  var newIdx = $(el).index();
  var id = parseInt(el.getAttribute('data-listid'));
  
  // TODO: send update to server
  console.log('moved id', id, 'new index', newIdx);
  
});


// This file is included in every page.

// creating a list on the server
function createList(name, pos, cards) {
    return $.ajax('/api/lists', {
        type: 'POST',
        data: {
            name: name,
            pos: pos,
            cards: cards
        }
    });
}

// getting all `list`s from server
function loadLists() {
    return $.ajax('/api/lists');
}

// getting ONE list from server
function loadSingleList(id) {
    return $.ajax('/api/lists/' + id);
}

// update an existing list
function updateList(id, name, pos, cards) {
    return $.ajax('/api/lists/' + id, {
        type: 'POST',
        data: {
            name: name,
            pos: pos,
            cards: cards
        }
    });
}


// clickt to delete list
$('#lists').delegate(".deleteListButton", "click", function(event){
    var $column2 = $(event.target).closest('.column');
    var id =parseInt($column2.attr('data-listid'));
    deleteList(id);
    $column2.remove();
})

// delete a specific list
function deleteList(id) {
    return $.ajax('/api/lists/' + id, {
        type: 'DELETE'
    });
} 


// Example code for displaying lists in the browser
function displayLists(lists) {
    // Lists should be ordered based on their 'pos' field
    lists.rows = _.sortBy(lists.rows, 'pos');
    lists.rows.forEach(function(list) {
        var listElem = buildList(list);
    });
}

function buildList(list) {
    var lists = $('#lists');
    var column = $('<div>').attr('class', 'column').attr('data-listid', list.id);
    var curElem = $('<div>').attr('class', 'context'); 
    var headline =  $('<div>').attr('class', 'headline');
    var title = ($('<h3>').text(list.name).attr('class', 'title'));
    
    headline.append(title);
    
    


    //Karte hinzufügen

    var inputCard = $('<textarea>').attr('class', 'inputCard');
    var deleteListButton = $('<button>').text('x').addClass('deleteListButton');   
    
    //$('.addCard').click(addCardButton);
    addCardButton();
    if (list.cards) {
        var innerUl = $('<div>').attr('class', 'cards');
        var i=0;
        list.cards.forEach(function(card) {
            innerUl.append($('<div>').text(card).attr('class', 'card').attr('data-position', i));
            innerUl.append($('<button>').text('^').attr('class', 'upButton'));
            innerUl.append($('<button>').text('v').attr('class', 'downButton'));
            
    
            i++;
        });
        curElem.append(innerUl);
    }
    lists.append(column);
    column.append(deleteListButton, headline, curElem);
    curElem.append(inputCard);
    
    
}


// start: execute functions above
loadLists()
    .then(function(data) {
        console.log('Lists', data.rows);
        if (data.rows.length) {
            // If some lists are found display them
            displayLists(data);
        } else {
            // If no lists are found, create sample list
            // and re-display.
            console.log('No lists found, creating one.');
            createList('Your first list', 0, ['Example-card 1', 'Example-card 2', 'my card'])
                .then(function(list) {
                    console.log('Created list', list);
                    return loadLists();
                })
                .then(function(lists) {
                    displayLists(lists);
                })
        }

    });