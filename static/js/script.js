'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function() {
    var nameInputList = $('#nameList').val();
    createList(nameInputList, 2, ['bla']).then(function(data) {
        //createList('List', 2, ['testlist', 'testlist1']).then(function (data) {
        console.log('createList', data);
        displayLists(data);
    })
})




//neue Karte hinzufügen Button
$('#lists').delegate(".addCard", "click", function(e) {
        var $col = $(e.target).closest('.column');
        var id = parseInt($col.attr('data-listid'));
        console.log('id ' + id);
        var inputTextCard = $col.find('.inputCard').val();
        loadSingleList(id).then(function(data) {
                console.log('data ', data);           
                               
                if (!_.isArray(data.cards)) {
                    data.cards = [inputTextCard];
                } else {
                    data.cards.push(inputTextCard);
                }
                
                return updateList(id, data.name, data.pos, data.cards);
                
            })
            .then(function(lists) {
                console.log(lists.cards);
                // TODO: make sure the added card is visible in the user interface
                var cardDiv = $col.find('.cards');
                cardDiv.append($('<div>').text(inputTextCard).attr('class', 'card')); 
            })
  })



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
    $colli.find('.wrapListInput').append(saveButton);
    

    $('.saveButton').click(function(event){
        console.log(event);
      var newListName = input.val();
      var saveAsh3 = input.replaceWith("<h3>" + newListName + "</h3>");
      $('.saveButton').remove();
      loadSingleList(id).then(function(data){
        updateList(id, newListName, data.pos, data.cards)
      })
     
    })
    

  
})

//allow user to rename CARD
  $('#lists').delegate(".textWrap", "click", function(ev) {
    var originalCardName = $(ev.target).text();
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

    

    $('.saveButtonCard').click(function(){
        //console.log("--------------------------------------------------------------");
        //console.log(event.target);
        //console.log(id);
        var cardName = input.val();
      var newCardName = $('<div>').text(input.val()).attr('class', 'card');
      inputDiv.replaceWith(newCardName);
     
      $('.saveButtonCard').remove();
      $('.card').unwrap();
     
      loadSingleList(id).then(function(list){
        //console.log(list);
        var searchForIndex = $.inArray(originalCardName, list.cards);
        //console.log(searchForIndex);
        list.cards.splice(searchForIndex, 1, input.val());
        updateList(id, list.name, list.pos, list.cards);
      });
    })        
  })



// click to delete a card
$('#lists').delegate(".deleteCardButton", "click", function(event) {
    var $column = $(event.target).closest('.column');
    var $cardToDelete = $(event.target).closest('.card');
    var id = parseInt($column.attr('data-listid'));
    var index = $cardToDelete.index();
    console.log('deleteCard', id, index);
    deleteCard(id, index);
    $cardToDelete.remove();
})


// Delete card
function deleteCard(id, indexCardToDelete) {
    loadSingleList(id).then(function(list) {
        //console.log(list);
        //console.log("searchForIndex");
        //console.log(searchForIndex);
        list.cards.splice(indexCardToDelete, 1);
        updateList(id, list.name, list.pos, list.cards);
    });
}


// move card up
  $('#lists').delegate(".upButton", "click", function(event) {
           
      var $coll = $(event.target).closest('.column');
      var id = parseInt($coll.attr('data-listid'));
   
      loadSingleList(id).then(function(data){
    
          var currentCard = $(event.target).parent('.card');
          var textCurrentCard = (currentCard.find('.textWrap')).text();
          //console.log(textCurrentCard);
          var previousCard = currentCard.prev();
          var textPreviousCard = (previousCard.find('.textWrap')).text();
          //console.log(textPreviousCard);
          currentCard.insertBefore(previousCard);
          
          if(previousCard.length == 0){        // if card is already the topmost card
            return;
          }
          // 'overwrite' textCurrentCard with textPreviousCard
          var searchForIndexOfCurrent = $.inArray(textCurrentCard, data.cards);
          data.cards.splice(searchForIndexOfCurrent, 1, textPreviousCard);

          // 'overwrite' textPreviousCard with textCurrentCard
          var searchForIndexOfPrevious = $.inArray(textPreviousCard, data.cards);
          data.cards.splice(searchForIndexOfPrevious, 1, textCurrentCard);

        updateList(id, data.name, data.pos , data.cards)
      })  
  })

//move card down
  $('#lists').delegate(".downButton", "click", function(event) {
           
      var $col = $(event.target).closest('.column');
      var id = parseInt($col.attr('data-listid'));
   
      loadSingleList(id).then(function(data){
    
          var currentCard = $(event.target).parent('.card');
          var textCurrentCard = (currentCard.find('.textWrap')).text();
          //console.log(textCurrentCard);
          var nextCard = currentCard.next();
          var textNextCard = (nextCard.find('.textWrap')).text();
          //console.log(textNextCard);
          currentCard.insertAfter(nextCard);
          
          if(nextCard.length == 0){        // if card is already the bottommost card
            return;
          }
          
          // 'overwrite' textNextCard with textCurrentCard
          var searchForIndexOfNext = $.inArray(textNextCard, data.cards);
          data.cards.splice(searchForIndexOfNext, 1, textCurrentCard);

          // 'overwrite' textCurrentCard with textNextCard
          var searchForIndexOfCurrent = $.inArray(textCurrentCard, data.cards);
          data.cards.splice(searchForIndexOfCurrent, 1, textNextCard);

        updateList(id, data.name, data.pos , data.cards)
      })  
  })
  
  //move card to the right
$('#lists').delegate(".rightButton", "click", function(event) {
           
      var $col = $(event.target).closest('.column');
      var currentId = parseInt($col.attr('data-listid'));
      var nextId = currentId + 1;
      var cardToMove = $(event.target).closest('.card');
      var textCardToMove = cardToMove.text();

      // delete Card from current List
      loadSingleList(currentId).then(function(data){
        var searchForIndex= $.inArray(textCardToMove, data.cards);
        data.cards.splice(searchForIndex,1);
        cardToMove.remove();
       updateList(currentId, data.name, data.pos , data.cards)
     })  
     // add specific card to list which is one further to the right
     loadSingleList(nextId).then(function(data){
         console.log(data);
        $('.cards').append($('<div>').text(textCardToMove).attr('class', 'card'));
       // var searchForIndex= $.inArray(textCardToMove, data.cards);
    //data.cards.splice(searchForIndex,0, textCardToMove);
        if($('.column').length == 0){        // if this is already the last list
            return;
          }
          
        updateList(nextId, data.name, data.pos , data.cards)
  })
})


// Dragula Drag & Drop
var drake = dragula([$('#lists').get(0)], {direction: 'horizontal'});

drake.on('dragend', function(el, target, source, sibling) {
  
  var newIdx = $(el).index();
  var id = parseInt(el.getAttribute('data-listid'));
  
  // TODO: send update to server
  console.log('moved id', id, 'new index', newIdx);

  loadSingleList(id).then(function(data){
      updateList(id, data.name, newIdx, data.cards)
  })
  
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
        var lists = $('#lists');
        var column = $('<div>').attr('class', 'column').attr('data-listid', list.id);
        var content = $('<div>').attr('class', 'content'); 
        var headline =  $('<div>').attr('class', 'headline');
        var title = ($('<h3>').text(list.name).attr('class', 'title'));
         
            
    if (list.cards) {
        var allCards = $('<div>').attr('class', 'cards');
        list.cards.forEach(function(cardText) {
            var card = $('<div>');
            card.attr('class', 'card');
            card.append($('<span class="textWrap">').text(cardText));
            var deleteCardButton = $('<button>').text('x').addClass('deleteCardButton');
            card.append(deleteCardButton);
            var rightButton = $('<button>').text('>').attr('class', 'rightButton');
            card.append(rightButton);
            var downButton = $('<button>').text('v').attr('class', 'downButton');
            card.append(downButton);
            var upButton = $('<button>').text('^').attr('class', 'upButton');
            card.append(upButton);
            //var leftButton = $('<button>').text('<').attr('class', 'leftButton');
            //card.append(leftButton);
                        
            allCards.append(card);
            
        });
        content.append(allCards);
    }
    lists.append(column);

// textarea of 'add card' button
    var inputCard = $('<textarea>').attr('class', 'inputCard').attr('placeholder', ' enter your card name');
    content.append(inputCard);

// Add Card Button
    var addCard = $('<button>').text('add card...').attr('class', 'addCard');
    content.append(addCard);

// Delete List Button
    var deleteListButton = $('<button>').text('x').addClass('deleteListButton');
    column.append(deleteListButton);
    
    column.append(headline);
    column.append(content);
    headline.append(title);
    });
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